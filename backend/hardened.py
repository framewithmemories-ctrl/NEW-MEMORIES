"""Production hardening wrapper for the Memories FastAPI application.

The legacy server remains intact while this module adds security controls that are
applied after route registration and before uvicorn serves the app.
"""
import math
import os

from fastapi import Depends, HTTPException, Request
from fastapi.routing import APIRoute
from fastapi.dependencies.utils import get_dependant

import server

app = server.app


def _bearer_token(request: Request) -> str:
    value = (request.headers.get("authorization") or "").strip()
    if not value.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = value[7:].strip()
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return token


def _decode_user(request: Request) -> dict:
    payload = server.decode_token(_bearer_token(request))
    if payload.get("role") != "user" or not payload.get("sub"):
        raise HTTPException(status_code=403, detail="User authentication required")
    return payload


def _decode_admin(request: Request) -> dict:
    payload = server.decode_token(_bearer_token(request))
    if payload.get("role") != "admin" or not payload.get("sub"):
        raise HTTPException(status_code=403, detail="Admin access required")
    return payload


async def require_owner_path(request: Request):
    payload = _decode_user(request)
    user_id = request.path_params.get("user_id")
    if user_id != payload["sub"]:
        raise HTTPException(status_code=403, detail="Not authorized for this account")


async def require_owner_body(request: Request):
    payload = _decode_user(request)
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid request body")
    if body.get("user_id") != payload["sub"]:
        raise HTTPException(status_code=403, detail="Not authorized for this account")


async def validate_order_request(request: Request):
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid request body")

    user_id = body.get("user_id")
    auth = (request.headers.get("authorization") or "").strip()
    is_guest = isinstance(user_id, str) and user_id.startswith("guest_") and 12 <= len(user_id) <= 80
    if auth:
        payload = _decode_user(request)
        if user_id != payload["sub"]:
            raise HTTPException(status_code=403, detail="Not authorized for this account")
    elif not is_guest:
        raise HTTPException(status_code=401, detail="Please log in before placing an account order")

    items = body.get("items")
    try:
        client_total = float(body.get("total_amount"))
    except (TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid order total")
    if not isinstance(items, list) or not items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")
    if not math.isfinite(client_total) or client_total < 0 or client_total > 100000:
        raise HTTPException(status_code=400, detail="Order total must be between ₹0 and ₹100,000")

    # Verify every cart line against the current catalog. The client may not
    # invent products, prices, quantities, or a negative line value.
    catalog_total = 0.0
    for item in items:
        product_id = item.get("product_id")
        if not product_id:
            raise HTTPException(status_code=400, detail="Every order item must include a product_id")
        try:
            quantity = int(item.get("quantity", 0))
            client_price = float(item.get("price"))
        except (TypeError, ValueError):
            raise HTTPException(status_code=400, detail="Invalid order item")
        if quantity < 1 or quantity > 50 or not math.isfinite(client_price) or client_price < 0:
            raise HTTPException(status_code=400, detail="Invalid item quantity or price")
        product = await server.db.products.find_one({"id": product_id})
        if not product:
            raise HTTPException(status_code=400, detail="One or more products are no longer available")
        expected_price = float(product.get("base_price", 0))
        if abs(client_price - expected_price) > 0.01:
            raise HTTPException(status_code=409, detail="Product price changed. Please refresh your cart and try again.")
        catalog_total += expected_price * quantity

    delivery_type = body.get("delivery_type")
    if delivery_type not in ("pickup", "delivery"):
        raise HTTPException(status_code=400, detail="Invalid delivery type")
    if delivery_type == "delivery" and not body.get("delivery_address"):
        raise HTTPException(status_code=400, detail="Delivery address is required")

    delivery = 0 if delivery_type == "pickup" or catalog_total >= 1000 else 50
    tax = round(catalog_total * 0.18)
    maximum_payable = catalog_total + delivery + tax
    if client_total > maximum_payable + 0.01:
        raise HTTPException(status_code=409, detail="Order total is higher than the current catalog total")


async def validate_positive_amount(request: Request):
    payload = _decode_user(request)
    try:
        amount = float(request.query_params.get("amount", "nan"))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid amount")
    if not math.isfinite(amount) or amount <= 0 or amount > 100000:
        raise HTTPException(status_code=400, detail="Amount must be a finite positive value up to ₹100,000")

    order_id = request.query_params.get("order_id")
    if not order_id or len(order_id) > 100:
        raise HTTPException(status_code=400, detail="Invalid order id")
    order = await server.db.orders.find_one({"id": order_id, "user_id": payload["sub"]})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.get("status") in {"cancelled", "refunded"}:
        raise HTTPException(status_code=409, detail="This order cannot be paid")
    if amount > float(order.get("total_amount", 0)) + 0.01:
        raise HTTPException(status_code=400, detail="Wallet payment cannot exceed the order total")


async def validate_positive_points(request: Request):
    _decode_user(request)
    try:
        points = int(request.query_params.get("points", "-1"))
    except ValueError:
        raise HTTPException(status_code=400, detail="Points must be a positive whole number")
    if points <= 0 or points > 1000000:
        raise HTTPException(status_code=400, detail="Points must be a positive whole number")


async def block_unverified_wallet_topup(request: Request):
    raise HTTPException(
        status_code=503,
        detail="Wallet top-up is temporarily unavailable until secure payment verification is enabled",
    )


def _add_dependency(route: APIRoute, dependency):
    route.dependencies.append(Depends(dependency))
    route.dependant = get_dependant(path=route.path, call=route.endpoint, dependencies=route.dependencies)


for route in list(app.routes):
    if not isinstance(route, APIRoute):
        continue
    path = route.path
    methods = route.methods or set()

    if path == "/api/products" and "POST" in methods:
        _add_dependency(route, _decode_admin)
    elif path == "/api/users/{user_id}" and methods & {"GET", "PUT"}:
        _add_dependency(route, require_owner_path)
    elif path == "/api/designs" and "POST" in methods:
        _add_dependency(route, require_owner_body)
    elif path == "/api/designs/{user_id}" and "GET" in methods:
        _add_dependency(route, require_owner_path)
    elif path == "/api/orders" and "POST" in methods:
        _add_dependency(route, validate_order_request)
    elif path == "/api/orders/{user_id}" and "GET" in methods:
        _add_dependency(route, require_owner_path)
    elif path == "/api/users/{user_id}/wallet/add-money" and "POST" in methods:
        _add_dependency(route, block_unverified_wallet_topup)
    elif path == "/api/users/{user_id}/wallet/convert-points" and "POST" in methods:
        _add_dependency(route, validate_positive_points)
    elif path == "/api/users/{user_id}/wallet/pay" and "POST" in methods:
        _add_dependency(route, validate_positive_amount)


if os.environ.get("ENVIRONMENT", "").lower() in {"prod", "production"}:
    admin_password = os.environ.get("ADMIN_PASSWORD", "")
    if not admin_password or admin_password == "memories2024" or len(admin_password) < 12:
        raise RuntimeError("ADMIN_PASSWORD must be explicitly configured and at least 12 characters in production")
    cors = [x.strip() for x in os.environ.get("CORS_ORIGINS", "").split(",") if x.strip()]
    if not cors or "*" in cors:
        raise RuntimeError("CORS_ORIGINS must explicitly list trusted frontend origins in production")
