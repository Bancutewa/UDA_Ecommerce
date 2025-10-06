# 🧩 Website Bán Hàng — Tài Liệu BACKEND (BE)

> Mục tiêu: Đặc tả **API chi tiết**, **luồng nghiệp vụ**, **bảo mật**, **webhook** cho MVP e‑commerce. Gợi ý stack: NestJS + Prisma + PostgreSQL + Swagger.

---

## 0) Chuẩn chung
- REST + JSON, mã hóa TLS; `Content-Type: application/json`.
- JWT (HS/RS) cho khách hàng; RBAC cho Admin. Refresh token.
- `X-Request-Id` để trace, idempotency key cho thanh toán.
- Chuẩn lỗi: `{error:{code,message,details?}}` với HTTP status phù hợp.

---

## 1) Auth
### 1.1 Endpoints
- `POST /auth/register` → **201** `{id,email,name,token}`  
  Body: `{email, phone?, password, name}`
- `POST /auth/login` → **200** `{token, refresh_token}`  
  Body: `{emailOrPhone, password}`
- `POST /auth/refresh` → **200** `{token}`
- `POST /auth/logout` → **204**
- (Optional) OTP:
  - `POST /auth/otp/send` `{phone}` → **200**
  - `POST /auth/otp/verify` `{phone, code}` → **200** `{token}`

### 1.2 Quy tắc
- Hash mật khẩu (argon2/bcrypt), lock tạm thời khi brute‑force (rate‑limit).
- Email verify (optional cho MVP).

---

## 2) Catalog
- `GET /categories` → **200** `[{id,name,slug,parent_id,children[]}]`
- `GET /products`  
  Query: `category, q, brand, min_price, max_price, attrs, sort, page, size`  
  **200**: `{items:[{id,slug,name,thumbnail,price,compare_at,rating,count}], total}`
- `GET /products/{slug}`  
  **200**: `{id,name,slug,brand,description,attributes[], variants[], media[], price_range, seo, related[]}`
- `GET /products/{id}/reviews?page=` → review phân trang
- `POST /products/{id}/reviews` (auth) `{rating, content, media[]}` → **201**

---

## 3) Search
- `GET /search/suggest?q=` → `[{type,label,url}]` (cache 30–60s)
- `GET /search?q=` → trả tương tự `/products` (ưu tiên tốc độ, index/search service)

---

## 4) Cart
- `GET /cart` → **200** `{items, subtotal, discount_total, estimated_shipping, total}`
- `POST /cart/items` `{variant_id, qty}` → **201**
- `PATCH /cart/items/{item_id}` `{qty}` → **200**
- `DELETE /cart/items/{item_id}` → **204**
- `POST /coupons/validate` `{code}` → **200** `{valid, value, reason?}`

**Lưu ý**: `cart_id` theo session + liên kết user sau login; đồng bộ đa thiết bị.

---

## 5) Checkout & Orders
- `POST /checkout/address` `{shipping_address, billing_address?}` → **200** lưu context checkout
- `POST /checkout/shipping` `{carrier_code}` → **200** `{fee, eta, methods[]}`
- `POST /checkout/payment` `{method:"COD|ONLINE", gateway?}`  
  - COD → **200** `{order_code, status:"processing"}`  
  - ONLINE → **200** `{order_code, redirect_url}`

- `GET /orders` (auth) → **200** danh sách đơn
- `GET /orders/{code}` → **200** chi tiết đơn
- `POST /orders/{code}/cancel` (rule‑based) → **200** `{status}`

### 5.1 Luồng nghiệp vụ
1) Tạo order **pending** từ cart + snapshot giá/khuyến mãi.  
2) Thanh toán:  
   - COD → `payment_status=unpaid`, `order_status=processing`.  
   - Online → redirect gateway, chờ webhook.  
3) Kho xử lý → tạo shipment → cập nhật tracking & trạng thái.  
4) Giao thành công → `order_status=delivered`.

---

## 6) Payment Gateway
- `POST /payments/webhook` (public)  
  Body (theo gateway): `status: paid|failed|refunded`, `transaction_id`, `order_code`, `signature`, `amount`…  
  **Xử lý**: xác minh chữ ký, idempotent xử lý; cập nhật `payments` + `orders.payment_status`.

- `GET /payments/{order_code}` (optional) → tra cứu trạng thái đã biết.

---

## 7) Shipping
- `POST /shipping/rate` `{address, items[]}` → **200** `{carrier_rates[]}`
- `POST /shipping/create` `{order_code, carrier_code}` → **200** `{tracking_no, label_url?}`
- `POST /shipping/webhook` → cập nhật `shipments.status` (picked/in_transit/delivered/failed/returned)

---

## 8) RMA (Đổi/Trả)
- `POST /orders/{code}/rma` `{reason, items[], photos[]}` → **201** `{rma_id, status:"pending"}`
- `GET /rma/{rma_id}` → **200** `{status, history[]}`
- `POST /rma/{rma_id}/approve|reject|refund` (admin) → **200**

---

## 9) Admin (RBAC)
- Products: `GET/POST/PATCH/DELETE /admin/products`, `/admin/variants`, `/admin/media`
- Categories: CRUD `/admin/categories`
- Inventory: `PATCH /admin/variants/{id}/inventory` `{delta|set}`
- Orders: `GET/PATCH /admin/orders/{code}` (đổi trạng thái, hoàn tiền partial)
- Promotions/Coupons: CRUD `/admin/promotions`, `/admin/coupons`
- Users: `/admin/users` (khóa/mở, phân vai)
- CMS: `/admin/pages`, `/admin/blog`
- Reports: `/admin/reports/sales?from=&to=`, `/admin/reports/products`, `/admin/reports/customers`

---

## 10) Bảo mật & Phi chức năng
- OWASP Top 10/ASVS L1–2; HTTPS mọi nơi; HSTS.
- Không lưu thô dữ liệu thẻ (PCI DSS) — dùng token từ gateway.
- RBAC + nguyên tắc least‑privilege; audit logs; rate‑limit; CSRF/XSS/SQLi protections.
- Hiệu năng: TTFB < 0.8s; tìm kiếm < 500ms (cache); autoscale.
- Observability: APM/Tracing, centralized logs; `X-Request-Id`.
- SLA: Uptime ≥ 99.9%, RPO ≤ 5', RTO ≤ 1h.

---

## 11) Swagger / OpenAPI
- `/docs` bảo vệ bằng auth (basic hoặc token).
- Mô tả schema cho mọi DTO; ví dụ request/response; tags theo bounded context.

---

## 12) Tiêu chí chấp nhận (E2E quan trọng)
- Webhook “paid” hợp lệ → `orders.payment_status=paid` trong ≤ 5 phút, gửi email xác nhận trong ≤ 1 phút.
- Coupon `SALE20` (điều kiện: đơn ≥ 500k) → giảm 20% nhưng không vượt 100k; hết hạn trả thông báo lý do.
- PDP biến thể hết hàng → chặn thêm giỏ, trả về lỗi chuẩn `VALIDATION_ERROR` khi bypass FE.

