# MEMORIES — Pre-Launch Security Audit

Date: 2026-09-15
Branch: `NEW-MEMORIES-2026`

## Critical findings

### 1. Customer order authorization
`GET /api/orders/{user_id}` currently accepts an arbitrary user ID without JWT ownership validation.

Required fix:
- Require the authenticated user.
- Return 403 when the token subject does not match `{user_id}`.
- Do not expose another customer's orders.

### 2. Order creation trusts client `user_id`
`POST /api/orders` currently accepts `user_id` from the request body and awards points to that ID.

Required fix:
- Authenticate the request with the user JWT.
- Derive the effective user ID from the JWT subject.
- Ignore/reject a mismatching body `user_id`.
- Validate the authenticated user exists.

### 3. Wallet amounts need server-side validation
Wallet endpoints accept numeric amounts directly from the request. Negative values can invert the intended operation.

Affected operations:
- wallet add-money
- wallet convert-points
- wallet pay

Required fix:
- Require finite values.
- Require `amount > 0` for money operations.
- Require `points > 0` and `points <= current_points` for conversion.
- Use atomic MongoDB conditional updates for wallet debits to prevent race-condition double spending.

## High-priority checkout consistency

The frontend creates an order and then calls wallet payment. If wallet payment fails, an order can remain created without the wallet deduction.

Required production flow:
1. Validate authenticated customer.
2. Validate cart/product data server-side.
3. Validate final payable amount server-side.
4. Reserve/deduct wallet atomically when wallet payment is selected.
5. Create/mark the order as paid only after successful payment.
6. On failure, do not leave a falsely successful order.
7. Make wallet payment idempotent using the order ID.

## Additional authorization review

The following customer-owned resources already use `verify_user_access` and should remain protected:
- saved photos
- wallet balance
- wallet transactions
- wallet payment

The generic user endpoints should also be reviewed before production:
- `GET /api/users/{user_id}`
- `PUT /api/users/{user_id}`
- `GET/POST /api/designs/{user_id}`

These currently accept a user ID directly and should be restricted to the owner where they expose or mutate private customer data.

## Payment gateway

No Razorpay/Stripe integration was found in the audited checkout/backend flow. Current checkout supports COD and internal wallet payment.

Before launch, explicitly decide whether the first production release will be:
- COD + wallet only, or
- COD + wallet + an online payment gateway (recommended for a full e-commerce flow).

Do not advertise an online payment option until server-side payment verification is implemented.

## Production security checklist

- [ ] Strong `JWT_SECRET`
- [ ] Strong `ADMIN_PASSWORD`
- [ ] Production `CORS_ORIGINS` restricted to the real frontend domain
- [ ] MongoDB Atlas/private production database configured
- [ ] HTTPS for frontend and API
- [ ] No secrets committed to Git
- [ ] Server-side order price validation
- [ ] Server-side ownership validation for all private resources
- [ ] Atomic wallet operations
- [ ] Idempotent payment/order processing
- [ ] Production error logging without leaking secrets or customer data
- [ ] Final mobile and customer purchase-flow regression
