# MEMORIES — Pre-Launch Security Audit

Date: 2026-09-15
Branch: `NEW-MEMORIES-2026`

## Completed hardening

Production now uses `backend/hardened.py` through the Docker entrypoint. The wrapper applies controls without rewriting the large legacy `server.py` in-place.

Completed:
- Customer `GET /api/orders/{user_id}` ownership enforcement.
- Authenticated `POST /api/orders` ownership and basic total/item/delivery validation.
- Customer `GET/PUT /api/users/{user_id}` ownership enforcement.
- Customer design creation/list ownership enforcement.
- Public `POST /api/products` is no longer trusted; admin authentication is required.
- Wallet payment and points operations reject invalid/negative values at the hardened entrypoint.
- Direct browser wallet top-up is disabled until a real payment provider verifies the transaction server-side. This closes the critical free-money vulnerability in the legacy `add-money` endpoint.
- Production refuses the legacy default admin password and requires an explicit strong `ADMIN_PASSWORD`.
- Production requires explicit `CORS_ORIGINS` and rejects wildcard CORS when `ENVIRONMENT=production`.
- MongoDB is no longer exposed on host port 27017 by the supplied docker-compose configuration.
- Docker and non-Docker deployment instructions now use `hardened:app`.

## Remaining launch blockers

### 1. Real payment top-up / online payments
The current application has no verified online payment gateway. Wallet top-up is intentionally disabled.

For a production e-commerce launch, choose one:
- Launch with COD only and do not expose wallet top-up, or
- Implement Razorpay/another gateway with server-side signature verification, webhooks, payment states, idempotency, and refunds.

Do not re-enable direct wallet balance mutation from the browser.

### 2. Server-side catalog price validation
`POST /api/orders` still receives the final amount and item prices from the client. Basic bounds are enforced, but a full production implementation must load the referenced products/options from MongoDB and calculate the payable total on the server.

### 3. Final production environment values
Before launch, configure:
- `MONGO_URL`
- `DB_NAME`
- `JWT_SECRET`
- `ADMIN_USERNAME`
- strong `ADMIN_PASSWORD` (12+ chars)
- `ENVIRONMENT=production`
- exact `CORS_ORIGINS`
- frontend `REACT_APP_BACKEND_URL`
- AI/Google/WhatsApp variables if those features are required

## Production checklist

- [x] Customer resource ownership hardening
- [x] Order authentication and basic validation
- [x] Wallet negative/invalid-value protection
- [x] Wallet top-up abuse closed
- [x] MongoDB host exposure removed from compose
- [x] Production admin-password guard
- [x] Production CORS guard
- [x] Docker entrypoint hardened
- [ ] Server-side product/price calculation
- [ ] Verified online payment gateway, if online payment is required
- [ ] HTTPS for frontend and API
- [ ] Secrets configured only in deployment environment
- [ ] Final mobile/customer purchase-flow regression
- [ ] Production smoke test against the deployed API/frontend
