# 🛒 Website Bán Hàng — Tài Liệu FRONTEND (FE)

> Mục tiêu: Định nghĩa **giao diện**, **component**, **luồng** và **trạng thái** cho MVP e‑commerce. Chuẩn bị sẵn để dev FE (React/Next.js + Tailwind/TanStack Query) có thể code ngay.

---

## 0) Phạm vi nhanh
- B2C (MVP), sản phẩm hữu hình, có biến thể (màu/size).
- Thanh toán: COD + 1 cổng online (VNPay/MoMo/Stripe tùy thị trường).
- Vận chuyển: tính phí theo địa chỉ/khối lượng, ETA cơ bản.

---

## 1) Nguyên tắc UI & Layout
- **Grid**: container 1200–1440px, 12 cột, gutter 16–24px.
- **Responsive**: Desktop ≥1024, Tablet 768–1023, Mobile ≤767.
- **Design tokens**: màu chủ đạo/nhấn, radius 8–12, shadow md, spacing 4/8/12/16.
- **Trạng thái**: loading skeleton, empty, error, disabled; toast notifications.
- **A11y**: focus ring, alt text, contrast ≥ 4.5:1, keyboard navigable.

---

## 2) Kiến trúc Component (mức trang)
- `LayoutShell` (Header + Nav + Footer + AnnouncementBar)
- Trang: Home, PLP (Category/Search), PDP, Cart, Checkout, Auth, Account, Admin (MVP tối thiểu)

---

## 3) Trang chủ (Home)
**Mục tiêu**: điều hướng nhanh vào danh mục/SP chủ lực, truyền thông khuyến mãi.

**Bố cục**
1. Header: logo, search (autosuggest), account, cart badge.
2. Mega Menu: danh mục đa cấp.
3. Hero/Banner (carousel), USP 3–4 thẻ.
4. Danh mục nổi bật (grid 2×3).
5. Sản phẩm mới/bán chạy (grid 4×2).
6. Promo banner ngang.
7. Blog/News 3 cards.
8. Footer: menu, social, legal, newsletter.

**Component**
- `Header`, `NavMegaMenu`, `SearchBox`, `ProductCard`, `CategoryCard`, `PromoBanner`, `BlogCard`, `Footer`.

**Interaction**
- Autosuggest khi gõ ≥2 ký tự; enter → PLP; click gợi ý → PDP.
- Quick add to cart trên `ProductCard` nếu biến thể đơn giản.

---

## 4) Danh mục / Kết quả tìm kiếm (PLP/Search)
**Bố cục**
- Sidebar trái: `FilterPanel` (giá slider, thương hiệu, thuộc tính), nút Clear-all.
- Content: `SortSelect`, số sản phẩm/trang, grid 3–4 cột, `Pagination`.
- `Breadcrumb` trên cùng.

**Component**
- `Breadcrumb`, `FilterPanel`, `PriceRange`, `AttributeFilter`, `SortSelect`, `ProductCard`, `Pagination`, `EmptyState`.

**Trạng thái**
- Loading: skeleton 12–16 card.
- No-results: hiển thị gợi ý “xóa bớt bộ lọc” + link danh mục cha.

---

## 5) Trang chi tiết sản phẩm (PDP)
**Bố cục**
- Cột trái: `ImageGallery` (zoom, video), thumbnail dọc.
- Cột phải: tên, rating, `PriceBlock` (giá gạch + % giảm), `VariantPicker` (màu/size), tồn kho, `QuantityStepper`, `CTAGroup` (Add to Cart, Buy Now), `PolicyBox`, `ETABox`.
- Tab dưới: `Tabs` → Mô tả, Thông số, `ReviewList` & `ReviewForm`, Q&A, `RelatedProducts`.

**Quy tắc**
- Hết hàng → disable CTA + “Thông báo khi có”.
- Chọn biến thể → cập nhật giá/SKU/tồn/ảnh tức thì.

---

## 6) Giỏ hàng (Cart)
**Bố cục**
- Danh sách `CartItem` (ảnh, tên, biến thể, giá, qty, remove).
- `CouponInput`, `ShippingEstimator`, `CartSummary` (tạm tính, ship, tổng).
- CTA: Tiếp tục mua / Thanh toán.

**Validation**
- Thay đổi qty cập nhật ngay; coupon hiển thị thành công/thất bại rõ ràng.

---

## 7) Checkout (3 bước hoặc one‑page)
**Luồng đề xuất (3 bước)**
1. **Địa chỉ**: `AddressForm` (họ tên, phone, email, địa chỉ tỉnh/huyện/xã), ghi chú.
2. **Vận chuyển**: `ShippingMethodList` (tên đối tác, phí, ETA).
3. **Thanh toán**: `PaymentMethodList` (COD/Online), `TermsCheckbox`, `PlaceOrderButton`.
4. **Thank You**: mã đơn, tóm tắt, `TrackingWidget`.

**Không đồng bộ**
- Sau `PlaceOrder`: tạo order pending; nếu Online → redirect gateway; quay lại → hiển thị kết quả.

---

## 8) Auth & Tài khoản
- **Auth**: `AuthModal` (Login/Register/Forgot), SSO (Google/Apple nếu có).
- **Tài khoản**: `ProfileForm`, `AddressBook`, `OrderList`, `OrderDetail`, `RMAForm`, `Wishlist`, `NewsletterToggle`.

---

## 9) Admin FE (MVP tối thiểu)
- Data table (server-side): Sản phẩm/Đơn hàng/Khách hàng/Khuyến mãi.
- Form tạo/sửa, filter, bulk actions, export CSV.
- `RBACGuard` để ẩn/hiện menu theo vai trò.

---

## 10) Mapping FE ↔ API (Endpoints chính)
- Home: `GET /categories`, `GET /products?sort=top`, `GET /blog`
- PLP/Search: `GET /products`, `GET /search`, `GET /search/suggest`
- PDP: `GET /products/{slug}`, `GET /products/{id}/reviews`, `POST /products/{id}/reviews`
- Cart: `GET/POST/PATCH/DELETE /cart*`, `POST /coupons/validate`
- Checkout: `POST /checkout/address`, `POST /checkout/shipping`, `POST /checkout/payment`, webhooks payment/shipping
- Account: `GET /orders`, `GET /orders/{code}`, `POST /orders/{code}/rma`

---

## 11) Tiêu chí chấp nhận UI (trích)
- PDP biến thể hết hàng → nút “Thêm giỏ” **disabled** + tooltip lý do.
- Autosuggest hiển thị ≤ 300ms; điều hướng không reload (SPA/ISR).
- Checkout hiển thị tổng tiền cập nhật real‑time khi đổi phương thức ship/coupon.
- Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1 trên ≥ 85% lượt.

---

## 12) Gợi ý stack & thư viện
- Next.js (SSR/ISR), TanStack Query, Zustand/Redux, Tailwind, Headless UI/Radix, react-hook-form + zod, SWR cho webhook result polling.
- Theo dõi lỗi: Sentry, performance: Web Vitals/Real User Monitoring.

