# E-Commerce Platform Backend (NestJS)

Backend API cho nền tảng thương mại điện tử được xây dựng với NestJS, TypeScript, PostgreSQL, và TypeORM.

## 🚀 Công Nghệ

- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 15
- **ORM**: TypeORM 0.3.x
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Caching**: Redis
- **Queue**: Bull (Redis-based)

## 📁 Cấu Trúc Project

```
backend-nestjs/
├── src/
│   ├── app.module.ts           # Root module
│   ├── main.ts                 # Entry point
│   │
│   ├── config/                 # Configuration
│   │   └── typeorm.config.ts
│   │
│   ├── common/                 # Common utilities
│   │   ├── decorators/         # Custom decorators
│   │   ├── guards/             # Auth guards
│   │   ├── filters/            # Exception filters
│   │   ├── interceptors/       # Interceptors
│   │   └── pipes/              # Validation pipes
│   │
│   ├── database/
│   │   ├── entities/           # TypeORM entities
│   │   ├── migrations/         # Database migrations
│   │   └── seeds/              # Seed data
│   │
│   └── modules/                # Feature modules
│       ├── auth/               # Authentication
│       ├── users/              # User management
│       ├── products/           # Product catalog
│       ├── categories/         # Categories
│       ├── cart/               # Shopping cart
│       └── orders/             # Order management
│
├── test/                       # E2E tests
├── package.json
├── tsconfig.json
├── nest-cli.json
└── docker-compose.yml
```

## 🛠️ Cài Đặt

### Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 15
- Redis >= 7
- npm hoặc yarn

### Bước 1: Clone và cài đặt dependencies

```bash
# Di chuyển vào thư mục backend
cd backend-nestjs

# Cài đặt dependencies
npm install
```

### Bước 2: Cấu hình Environment

```bash
# Copy file .env.example
cp .env.example .env

# Chỉnh sửa file .env với thông tin cấu hình của bạn
```

### Bước 3: Khởi động Database (với Docker)

```bash
# Khởi động PostgreSQL và Redis
docker-compose up -d db redis

# Hoặc khởi động tất cả services
docker-compose up -d
```

### Bước 4: Chạy Migrations

```bash
# Tạo database tables
npm run migration:run
```

### Bước 5: Khởi động Application

```bash
# Development mode với hot-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## 🐳 Docker

### Khởi động toàn bộ stack với Docker Compose

```bash
# Build và khởi động tất cả services
docker-compose up --build

# Chạy trong background
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down
```

## 📝 Scripts

```bash
# Development
npm run start:dev              # Khởi động với hot-reload
npm run start:debug            # Khởi động với debug mode

# Build
npm run build                  # Build production
npm run start:prod             # Chạy production build

# Testing
npm run test                   # Unit tests
npm run test:watch             # Tests với watch mode
npm run test:cov               # Test coverage
npm run test:e2e               # E2E tests

# Database
npm run migration:generate     # Tạo migration mới
npm run migration:run          # Chạy migrations
npm run migration:revert       # Rollback migration
npm run seed                   # Seed data

# Code Quality
npm run lint                   # ESLint
npm run format                 # Prettier
```

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Đăng ký user mới
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/refresh` - Refresh access token

### Users
- `GET /api/v1/users/me` - Lấy thông tin user hiện tại
- `GET /api/v1/users/me/addresses` - Lấy địa chỉ của user
- `GET /api/v1/users` - Lấy danh sách users (Admin)
- `GET /api/v1/users/:id` - Lấy thông tin user theo ID (Admin)

### Products (Coming in Sprint 3)
- `GET /api/v1/products` - Danh sách sản phẩm
- `GET /api/v1/products/:id` - Chi tiết sản phẩm
- `POST /api/v1/products` - Tạo sản phẩm (Admin)

### Orders (Coming in Sprint 5)
- `GET /api/v1/orders` - Danh sách đơn hàng
- `GET /api/v1/orders/:id` - Chi tiết đơn hàng
- `POST /api/v1/orders` - Tạo đơn hàng

### API Documentation

Swagger UI có sẵn tại: `http://localhost:3000/docs`

## 🔒 Authentication

API sử dụng JWT (JSON Web Tokens) cho authentication.

### Cách sử dụng:

1. Đăng ký hoặc đăng nhập để nhận access token
2. Thêm token vào header của requests:
   ```
   Authorization: Bearer <your-access-token>
   ```

### Token Expiration:
- Access Token: 30 phút
- Refresh Token: 7 ngày

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests với coverage
npm run test:cov

# Run E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

## 📊 Database Migrations

```bash
# Tạo migration mới (tự động)
npm run migration:generate -- -n MigrationName

# Tạo migration rỗng
npm run typeorm migration:create -- -n MigrationName

# Chạy migrations
npm run migration:run

# Rollback migration
npm run migration:revert
```

## 🔧 Development Tips

### Hot Reload
Application tự động reload khi bạn thay đổi code trong development mode.

### Debugging
```bash
# Start với debug mode
npm run start:debug

# Attach debugger từ VS Code
# Sử dụng configuration "Attach to NestJS"
```

### Database GUI
PgAdmin4 có sẵn tại: `http://localhost:5050`
- Email: `admin@admin.com`
- Password: `admin`

## 🚀 Deployment

### Production Build

```bash
# Build application
npm run build

# Start production server
npm run start:prod
```

### Environment Variables (Production)

Đảm bảo set các biến môi trường sau trong production:

```bash
NODE_ENV=production
JWT_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-refresh-secret>
DB_HOST=<production-db-host>
DB_PASSWORD=<strong-db-password>
```

## 📚 Documentation

- [Requirements](../docs/00_context/requirements.md)
- [Implementation Guide](../docs/00_context/implementation-guide.md)
- [Project Roadmap](../docs/01_plan/project-roadmap.md)
- [Sprint 1 Tasks](../docs/02_implement/sprint-1-foundation.md)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Ensure all tests pass
5. Submit a pull request

## 📞 Support

Để được hỗ trợ, vui lòng tạo issue trên repository hoặc liên hệ team.

## 📄 License

[Private] - Chỉ sử dụng nội bộ.

