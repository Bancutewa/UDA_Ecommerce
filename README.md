# 🛒 Website Bán Hàng Trực Tuyến (E-Commerce Platform)

## 1. 🎯 Mục Tiêu Tổng Thể

Phát triển nền tảng **bán hàng trực tuyến (B2C)**, với khả năng **mở rộng sang B2B hoặc Marketplace** trong tương lai. Hệ thống hỗ trợ bán **sản phẩm hữu hình**, quản lý tồn kho, thanh toán online & COD, và vận chuyển nội địa.

**Mục tiêu chính:**

- Trải nghiệm mua sắm **minh bạch, tiện lợi, cá nhân hóa** (gợi ý sản phẩm & khuyến mãi).
- Tích hợp **thanh toán an toàn**, **vận chuyển nhanh**, **CSKH 24/7**.
- Giảm rủi ro gian lận, **tuân thủ pháp lý** (VAT, bảo vệ dữ liệu cá nhân 2025).
- Hỗ trợ **báo cáo phân tích** giúp tối ưu vận hành.
- Tích hợp API thanh toán, vận chuyển, phân tích dữ liệu.
- Đảm bảo **bảo mật dữ liệu người dùng** và tuân thủ quy định thương mại điện tử.

---

## 2. 👥 Đối Tượng Sử Dụng

| Vai Trò                              | Mô Tả                                                                |
| ------------------------------------ | -------------------------------------------------------------------- |
| **Người dùng cuối** (Guest/Customer) | Duyệt, mua, theo dõi đơn hàng, wishlist, đổi/trả hàng                |
| **Nhân viên CS/Support**             | Tra cứu, ghi chú, xử lý đổi/trả, hỗ trợ khách hàng                   |
| **Quản trị viên (Admin)**            | Quản lý danh mục, sản phẩm, kho, đơn hàng, khuyến mãi, báo cáo       |
| **Seller (tuỳ chọn)**                | Quản lý gian hàng riêng, đơn hàng, tồn kho                           |
| **Đối tác tích hợp**                 | Thanh toán (VNPay, MoMo), vận chuyển (GHTK, Viettel Post), analytics |
| **Cơ quan quản lý**                  | Giám sát tuân thủ pháp lý, thuế VAT                                  |
| **Kỹ thuật viên / DevOps**           | Bảo trì, mở rộng, đảm bảo bảo mật hệ thống                           |

---

## 3. 🧱 Chức Năng Chính

### A. Trang Chủ & CMS

- Banner, USP, danh mục nổi bật, sản phẩm mới/bán chạy, blog/news.
- Quản lý nội dung tĩnh: Giới thiệu, Điều khoản, Landing Page khuyến mãi.
- **SEO cơ bản:** Meta, sitemap.xml, robots.txt, OpenGraph, breadcrumbs.

### B. Danh Mục & Tìm Kiếm

- **Cây danh mục đa cấp**, hỗ trợ thương hiệu, bộ sưu tập.
- **Bộ lọc nâng cao:** giá, thương hiệu, thuộc tính, khoảng giá.
- **Tìm kiếm thông minh:** autosuggest, typo-tolerant, lịch sử cá nhân hóa.
- **Sắp xếp:** mới nhất, giá tăng/giảm, đánh giá cao.

### C. Trang Sản Phẩm (PDP)

- Thông tin chi tiết, gallery ảnh/video, biến thể SKU theo màu/size.
- Hiển thị tồn kho theo biến thể, giá niêm yết + khuyến mãi.
- **Hành động:** thêm giỏ hàng, mua nhanh, wishlist, so sánh.
- **Schema.org:** Product, AggregateRating, Review.

### D. Giỏ Hàng & Thanh Toán

- Giỏ hàng lưu session/tài khoản, **đồng bộ đa thiết bị**.
- **Khuyến mãi:** coupon, voucher, giảm giá theo điều kiện.
- **Tính phí vận chuyển** theo địa chỉ/khối lượng.
- **Checkout:** 3 bước (địa chỉ → vận chuyển → thanh toán) hoặc one-page.
- Hỗ trợ COD, VNPay, MoMo, ZaloPay, Stripe, PayPal.
- **Xác nhận đơn:** Email/SMS/notification, webhook cập nhật trạng thái.

### E. Tài Khoản Người Dùng

- **Đăng ký/Đăng nhập:** Email, SSO (Google/Apple), OTP.
- **Hồ sơ cá nhân:** địa chỉ, phương thức thanh toán, newsletter.
- **Lịch sử mua hàng, theo dõi vận đơn, yêu cầu đổi/trả (RMA)**.

### F. Quản Trị Hệ Thống (Back Office)

- Quản lý sản phẩm, SKU, tồn kho, khuyến mãi, người dùng, nội dung.
- **RBAC phân quyền:** Admin, Content, Support, Warehouse, Finance.
- **Báo cáo:** doanh thu, tỉ lệ chuyển đổi, top sản phẩm, tồn kho chậm.
- **Export CSV/API** cho BI và phân tích dữ liệu.

### G. Thanh Toán & Vận Chuyển (Integration)

- **Thanh toán:** redirect hoặc embedded, hỗ trợ OTP/3DS.
- **Vận chuyển:** tính phí real-time, tạo vận đơn, tracking API.
- **Webhook:** cập nhật trạng thái giao dịch và vận đơn tự động.

### H. Đánh Giá & CSKH

- **Review:** có kiểm duyệt, hỗ trợ ảnh/video, chống spam.
- **CSKH:** live chat (Zendesk/Intercom), chatbot cơ bản, Help Center, ticket.

---

## 4. 🧩 Kiến Trúc & Dữ Liệu

### 4.1 Sơ Đồ Dữ Liệu (Tóm Tắt)

| Bảng                    | Mô tả                                            |
| ----------------------- | ------------------------------------------------ |
| `users`                 | Thông tin người dùng, email/phone, password_hash |
| `addresses`             | Địa chỉ giao hàng                                |
| `categories`            | Danh mục đa cấp                                  |
| `products`              | Thông tin sản phẩm, thương hiệu, mô tả           |
| `product_variants`      | SKU, giá, thuộc tính, tồn kho                    |
| `media`                 | Ảnh, video, alt text                             |
| `carts`, `cart_items`   | Dữ liệu giỏ hàng                                 |
| `orders`, `order_items` | Đơn hàng, chi tiết sản phẩm trong đơn            |
| `payments`              | Thanh toán, gateway, trạng thái                  |
| `shipments`             | Vận chuyển, tracking_no, ETA                     |
| `coupons`, `promotions` | Mã giảm giá, điều kiện áp dụng                   |
| `reviews`               | Đánh giá người dùng                              |
| `logs_audit`            | Lịch sử hành động, thay đổi dữ liệu              |

### 4.2 Sơ bộ

- users(id, email, phone, password_hash, status, created_at…)

- addresses(id, user_id, line1, ward/district/province, is_default…)

- categories(id, parent_id, name, slug, pos…)

- products(id, name, slug, brand_id, description, status…)

- product_variants(id, product_id, sku, barcode, price, compare_at_price, weight, dimensions, inventory_qty, attributes JSON)

- media(id, product_id/variant_id, url, alt, is_primary)

- carts / cart_items(session_id/user_id, variant_id, qty, price_snapshot…)

- orders(id, code, user_id, subtotal, discount_total, shipping_fee, tax, total, status, payment_status, shipping_status…)

- order_items(order_id, variant_id, qty, unit_price, discount…)

- payments(order_id, gateway, amount, status, transaction_ref, payload…)

- shipments(order_id, carrier, tracking_no, status, fee, eta…)

- coupons / promotions(code, type, value, conditions JSON, start/end, usage_limit, per_user_limit…)

- reviews(user_id, product_id, rating, content, media…)

- logs_audit(actor, action, target, before/after, ip, ua, ts…)

### 4.3 Tích Hợp / Interfaces

- **Payment:** VNPay, MoMo, Stripe, PayPal (webhook).
- **Shipping:** GHTK, Viettel Post (phí, vận đơn, tracking API).
- **Email/SMS/Push:** xác nhận đơn, OTP, thông báo khuyến mãi.
- **Analytics:** GA4, Tag Manager, BI Export.

---

## 5. 🧮 API Tham Khảo Nhanh

| Nhóm         | Endpoint                                                    | Mô tả                |
| ------------ | ----------------------------------------------------------- | -------------------- |
| **Auth**     | `POST /auth/register`, `POST /auth/login`, `POST /auth/otp` | Xác thực             |
| **Catalog**  | `GET /categories`, `GET /products`, `GET /products/{slug}`  | Danh mục, sản phẩm   |
| **Cart**     | `GET /cart`, `POST /cart/items`, `PATCH /cart/items/{id}`   | Giỏ hàng             |
| **Checkout** | `POST /checkout/address`, `POST /checkout/payment`          | Thanh toán           |
| **Orders**   | `GET /orders`, `POST /orders/{code}/cancel`                 | Đơn hàng             |
| **Reviews**  | `POST /products/{id}/reviews`                               | Đánh giá             |
| **Coupons**  | `POST /coupons/validate`                                    | Kiểm tra mã giảm giá |
| **Admin**    | CRUD sản phẩm, đơn hàng, báo cáo (JWT + RBAC)               | Quản trị             |

---

## 6. 🔄 Quy Trình Nghiệp Vụ

### 6.1 Đặt Hàng (Happy Path)

1. **Guest** duyệt sản phẩm → thêm giỏ → nhập địa chỉ → chọn thanh toán.
2. **COD:** `payment_status=unpaid`, `order_status=processing`.
3. **Online:** webhook xác nhận “paid” → cập nhật trạng thái.
4. Kho xử lý → tạo vận đơn → giao hàng → `order_status=delivered`.

### 6.2 Đổi/Trả (RMA)

1. Người dùng tạo yêu cầu trong 7/15/30 ngày → chọn lý do, upload ảnh.
2. Hệ thống duyệt → tạo phiếu → đối tác lấy hàng → kiểm hàng → hoàn tiền/đổi mới.
3. Cập nhật `order` và `payment` tương ứng.

---

## 7. 📊 Báo Cáo & Phân Tích

- Doanh thu theo kênh/thiết bị/chiến dịch.
- GMV, AOV, tỷ lệ chuyển đổi, tỷ lệ bỏ giỏ.
- Top sản phẩm, khách hàng, khu vực.
- Funnel: Sessions → PDP → Add-to-Cart → Checkout → Purchase.
- Xuất CSV hoặc đồng bộ API với BI Tools.

---

## 8. 🔒 Tuân Thủ & Bảo Mật

- **Mã hóa TLS 1.3**, JWT + Refresh token.
- **Audit log** toàn hệ thống.
- **RBAC phân quyền chi tiết** cho từng role.
- **Tuân thủ Nghị định 13/2025** (bảo vệ dữ liệu cá nhân).
- **Chống gian lận:** giới hạn API rate, kiểm tra hành vi người dùng.

---

## 9. 🧠 Gợi Ý Phát Triển Tương Lai

- Hỗ trợ **đa ngôn ngữ/tiền tệ** (VNĐ/USD).
- **Marketplace** cho nhiều người bán.
- **AI Recommendation** (sản phẩm liên quan, hành vi mua sắm).
- **Voice commerce** (đặt hàng qua giọng nói).
- **Chatbot CS thông minh** tích hợp NLP.

---

> 📘 **Tài liệu này mô tả chi tiết yêu cầu chức năng, kỹ thuật và nghiệp vụ của hệ thống Website Bán Hàng Trực Tuyến (E-Commerce Platform).**  
> Phiên bản: `v1.0.0` — Cập nhật ngày `06/10/2025`.
