# 🚀 Quick Start Guide - E-Commerce Platform

## Bước 1: Cài Đặt Dependencies

```bash
# Di chuyển vào thư mục backend
cd backend-nestjs

# Cài đặt Node.js packages
npm install
```

## Bước 2: Cấu Hình Environment

```bash
# Copy file .env.example thành .env
copy .env.example .env

# File .env đã có sẵn với config mặc định:
# - Database: PostgreSQL (localhost:5432)
# - Redis: localhost:6379
# - JWT secrets (đổi trong production!)
```

## Bước 3: Khởi Động Database với Docker

```bash
# Khởi động PostgreSQL và Redis
docker-compose up -d db redis

# Kiểm tra containers đang chạy
docker ps

# Xem logs nếu cần
docker-compose logs -f db
```

## Bước 4: Tạo Database Tables (Migrations)

**⚠️ LƯU Ý**: TypeORM migrations chưa được tạo. Có 2 cách:

### Cách 1: Auto-sync (Development only)
Mở file `.env` và set:
```
DB_SYNCHRONIZE=true
```
TypeORM sẽ tự động tạo tables khi chạy app.

### Cách 2: Tạo Migration (Recommended)
```bash
# Generate migration từ entities
npm run migration:generate -- -n InitialSchema

# Run migration
npm run migration:run
```

## Bước 5: Chạy Backend Server

```bash
# Development mode với hot-reload
npm run start:dev

# Server sẽ chạy tại: http://localhost:3000
```

## Bước 6: Truy Cập & Test API

### 1. Mở Swagger Documentation
```
http://localhost:3000/docs
```

### 2. Test Health Check
```
GET http://localhost:3000/health
GET http://localhost:3000/api/v1
```

### 3. Test Authentication

**Đăng ký user mới:**
```bash
POST http://localhost:3000/api/v1/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "username": "testuser",
  "password": "SecurePass123!",
  "firstName": "Test",
  "lastName": "User"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "test@example.com",
    "username": "testuser",
    "role": "customer"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": "30m"
}
```

**Đăng nhập:**
```bash
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "SecurePass123!"
}
```

**Lấy profile (với token):**
```bash
GET http://localhost:3000/api/v1/users/me
Authorization: Bearer <your-access-token>
```

## 🛠️ Useful Commands

### Development
```bash
npm run start:dev        # Start với hot-reload
npm run start:debug      # Start với debugger
npm run build            # Build production
npm run start:prod       # Run production build
```

### Database
```bash
npm run migration:generate -- -n MigrationName   # Tạo migration
npm run migration:run                            # Chạy migrations
npm run migration:revert                         # Rollback migration
```

### Testing
```bash
npm run test             # Run unit tests
npm run test:watch       # Watch mode
npm run test:cov         # Coverage report
npm run test:e2e         # E2E tests
```

### Code Quality
```bash
npm run lint             # ESLint check
npm run format           # Prettier format
```

### Docker
```bash
docker-compose up -d                    # Start all services
docker-compose up -d db redis           # Start only db & redis
docker-compose logs -f api              # View API logs
docker-compose down                     # Stop all services
docker-compose down -v                  # Stop và xóa volumes
```

## 🔍 Kiểm Tra Services

### Check PostgreSQL
```bash
# Access PgAdmin: http://localhost:5050
# Email: admin@admin.com
# Password: admin

# Hoặc dùng psql
docker exec -it ecommerce_db psql -U ecommerce_user -d ecommerce_db
```

### Check Redis
```bash
docker exec -it ecommerce_redis redis-cli ping
# Response: PONG
```

### Check API
```bash
curl http://localhost:3000/health
```

## 🐛 Troubleshooting

### Port đã được sử dụng
```bash
# Windows: Tìm process đang dùng port 3000
netstat -ano | findstr :3000

# Kill process (thay PID)
taskkill /PID <PID> /F
```

### Database connection error
```bash
# Kiểm tra PostgreSQL đang chạy
docker ps | findstr postgres

# Restart database
docker-compose restart db
```

### Module not found
```bash
# Xóa node_modules và cài lại
rmdir /s /q node_modules
npm install
```

### Migration errors
```bash
# Drop toàn bộ schema và chạy lại
# ⚠️ CHỈ DÙNG TRONG DEVELOPMENT!
docker-compose down -v
docker-compose up -d db redis
npm run migration:run
```

## 📚 Next Steps

1. **Đọc documentation**: Xem `docs/01_plan/project-roadmap.md`
2. **Hiểu architecture**: Đọc `docs/00_context/implementation-guide.md`
3. **Start coding**: Bắt đầu với Sprint 2 tasks
4. **Write tests**: Mỗi feature cần có tests
5. **Update docs**: Cập nhật sprint document hàng ngày

## 🎯 Development Workflow

1. **Morning**: Đọc sprint tasks, pull latest code
2. **Develop**: Implement feature theo task list
3. **Test**: Write & run tests (coverage > 80%)
4. **Commit**: Clear commit messages
5. **Document**: Update sprint progress
6. **Review**: Code review trước khi merge

## 🔗 Important Links

- **API Docs**: http://localhost:3000/docs
- **PgAdmin**: http://localhost:5050
- **Project Docs**: `docs/` folder
- **Backend README**: `backend-nestjs/README.md`

## 📞 Need Help?

- Check `docs/` folder for detailed documentation
- Review error logs: `docker-compose logs -f`
- Ask team members
- Create issue trong repository

---

**Happy Coding! 🚀**
