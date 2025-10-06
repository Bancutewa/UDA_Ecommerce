# 🗃️ Website Bán Hàng — Tài Liệu DATABASE (DB – PostgreSQL)

> Mục tiêu: Định nghĩa **lược đồ bảng**, **quan hệ**, **index**, **ràng buộc**, và ghi chú triển khai (Prisma/ORM).

---

## 0) Sơ đồ quan hệ (ER – tóm tắt)
```
users 1—* addresses
products 1—* product_variants
products 1—* product_media
categories *—* products (join: product_categories)
orders 1—* order_items
orders 1—1 payments
orders 1—* shipments
carts 1—* cart_items
coupons *—* orders (order_coupons) hoặc áp mức item
products 1—* reviews (users viết)
logs_audit ghi nhận thay đổi (actor, action, target)
```
Gợi ý: Dùng UUID (v4) cho khóa chính; `code` có thể là human‑readable cho order.

---

## 1) Bảng & Cột (chi tiết)

### 1.1 `users`
- `id PK UUID`, `email VARCHAR UNIQUE`, `phone VARCHAR UNIQUE`, `password_hash`, `name`, `status ENUM('active','blocked')`, `created_at`, `updated_at`
- Index: `email`, `phone`

### 1.2 `addresses`
- `id PK`, `user_id FK -> users`, `name`, `phone`, `line1`, `ward`, `district`, `province`, `country`, `is_default BOOL`
- Composite index: `(user_id, is_default)`

### 1.3 `categories`
- `id PK`, `parent_id FK -> categories`, `name`, `slug UNIQUE`, `position INT`
- Index: `parent_id`, `slug`

### 1.4 `brands` (optional)
- `id PK`, `name`, `slug UNIQUE`

### 1.5 `products`
- `id PK`, `name`, `slug UNIQUE`, `brand_id FK -> brands NULL`, `description TEXT`, `status ENUM('draft','active','archived')`, `seo JSONB`, `created_at`, `updated_at`
- Index: `slug`, `status`, `brand_id`

### 1.6 `product_variants`
- `id PK`, `product_id FK -> products`, `sku UNIQUE`, `barcode UNIQUE NULL`, `price NUMERIC(12,2)`, `compare_at_price NUMERIC(12,2) NULL`, `weight NUMERIC(10,2) NULL`, `dimensions JSONB NULL`, `inventory_qty INT DEFAULT 0`, `attributes JSONB`
- Index: `product_id`, `sku`

### 1.7 `product_media`
- `id PK`, `product_id FK -> products`, `variant_id FK -> product_variants NULL`, `url`, `alt`, `is_primary BOOL`
- Index: `product_id`, `variant_id`

### 1.8 `product_categories` (join)
- `product_id FK -> products`, `category_id FK -> categories`
- PK composite: `(product_id, category_id)`

### 1.9 `reviews`
- `id PK`, `product_id FK -> products`, `user_id FK -> users`, `rating INT CHECK 1..5`, `content TEXT`, `media JSONB NULL`, `status ENUM('pending','approved','rejected')`, `created_at`
- Index: `product_id`, `user_id`, `status`

### 1.10 `carts`
- `id PK`, `user_id FK -> users NULL`, `session_id VARCHAR UNIQUE NULL`, `currency CHAR(3)`, `created_at`, `updated_at`
- Index: `user_id`, `session_id`

### 1.11 `cart_items`
- `id PK`, `cart_id FK -> carts`, `variant_id FK -> product_variants`, `qty INT CHECK (qty>0)`, `price_snapshot NUMERIC(12,2)`, `attributes JSONB`
- Unique: `(cart_id, variant_id)`; Index: `cart_id`

### 1.12 `orders`
- `id PK`, `code VARCHAR UNIQUE`, `user_id FK -> users NULL`,  
  `subtotal NUMERIC(12,2)`, `discount_total NUMERIC(12,2)`, `shipping_fee NUMERIC(12,2)`, `tax NUMERIC(12,2)`, `total NUMERIC(12,2)`,  
  `status ENUM('pending','processing','shipped','delivered','cancelled','returned')`,  
  `payment_status ENUM('unpaid','paid','refunded','failed')`, `shipping_status ENUM('pending','shipped','delivered','failed')`,  
  `currency CHAR(3)`, `channel ENUM('web','mobile','pos')`, `metadata JSONB`,  
  `shipping_address JSONB`, `billing_address JSONB`,  
  `created_at`, `updated_at`
- Index: `code`, `user_id`, `status`, `payment_status`, `created_at`

### 1.13 `order_items`
- `id PK`, `order_id FK -> orders`, `variant_id FK -> product_variants`, `product_name`, `variant_attrs JSONB`, `qty INT`, `unit_price NUMERIC(12,2)`, `discount NUMERIC(12,2) DEFAULT 0`, `total NUMERIC(12,2)`
- Index: `order_id`

### 1.14 `payments`
- `id PK`, `order_id FK UNIQUE -> orders`, `gateway`, `amount NUMERIC(12,2)`, `status ENUM('pending','paid','failed','refunded')`, `transaction_ref VARCHAR`, `payload JSONB`, `paid_at TIMESTAMP NULL`
- Index: `order_id`, `status`, `transaction_ref`

### 1.15 `shipments`
- `id PK`, `order_id FK -> orders`, `carrier`, `fee NUMERIC(12,2)`, `tracking_no VARCHAR`, `status ENUM('pending','picked','in_transit','delivered','failed','returned')`, `eta DATE NULL`, `payload JSONB`
- Index: `order_id`, `tracking_no`, `status`

### 1.16 `coupons`
- `id PK`, `code VARCHAR UNIQUE`, `type ENUM('percent','fixed')`, `value NUMERIC(12,2)`, `max_discount NUMERIC(12,2) NULL`, `conditions JSONB`, `start_at TIMESTAMP`, `end_at TIMESTAMP`, `usage_limit INT`, `per_user_limit INT`, `status ENUM('active','expired','disabled')`
- Index: `code`, `status`, `(start_at,end_at)`

### 1.17 `order_coupons`
- `order_id FK -> orders`, `coupon_id FK -> coupons`, `discount_value NUMERIC(12,2)`
- PK composite: `(order_id, coupon_id)`

### 1.18 `promotions` (optional rule engine)
- `id PK`, `name`, `rule JSONB`, `start_at`, `end_at`, `status`
- Index: `(start_at,end_at)`, `status`

### 1.19 `logs_audit`
- `id PK`, `actor_id FK -> users`, `action`, `target_type`, `target_id`, `before JSONB`, `after JSONB`, `ip`, `user_agent`, `created_at`
- Index: `actor_id`, `target_type`, `target_id`, `created_at`

---

## 2) Ràng buộc & Quy tắc
- **FK ON UPDATE CASCADE**, **ON DELETE RESTRICT** (cẩn trọng xóa SP/biến thể).
- **CHECK** cho rating 1..5, qty > 0, giá ≥ 0.
- Chuẩn hóa tiền tệ: `NUMERIC(12,2)`, lưu `currency` trong order/cart.
- Dấu vết giá tại thời điểm mua: `order_items.unit_price`, `price_snapshot` ở `cart_items`.

---

## 3) Index & Hiệu năng
- Sản phẩm: Index `status`, `slug`, `brand_id`; thêm GIN cho `attributes JSONB` nếu filter thuộc tính.
- Tìm kiếm: xem xét dùng search service (Meilisearch/Elastic) đồng bộ từ DB.
- Đơn hàng: index `created_at`, `status`, `payment_status` để báo cáo nhanh.
- Phân vùng (partition) cho bảng `logs_audit` theo tháng nếu lưu lớn.

---

## 4) Gợi ý Prisma/ORM (mẫu rất rút gọn)
```prisma
model Product {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  status    ProductStatus @default(ACTIVE)
  media     ProductMedia[]
  variants  ProductVariant[]
  categories ProductCategories[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ProductVariant {
  id           String  @id @default(uuid())
  product      Product @relation(fields: [productId], references: [id])
  productId    String
  sku          String  @unique
  price        Decimal
  inventoryQty Int     @default(0)
  attributes   Json
}
```
*(Phần còn lại triển khai tương tự theo bảng ở trên.)*

---

## 5) Sao lưu & Khôi phục
- Backup hằng ngày, retention ≥ 30 ngày; kiểm thử khôi phục định kỳ.
- Migration có kịch bản rollback; ghi chú thay đổi schema vào `logs_audit` (optional).

---

## 6) Bảo mật dữ liệu
- Không lưu thô dữ liệu thẻ; token hóa theo gateway (PCI DSS).
- Mã hóa dữ liệu nhạy cảm (PG crypto extension) nếu cần.
- Phân quyền kết nối DB tối thiểu, chỉ‑read cho BI/reporting.

