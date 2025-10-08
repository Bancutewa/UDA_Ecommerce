# 🧪 Test API Guide

## ✅ Quick Tests

### 1. Health Check
```bash
curl http://localhost:3000/api/v1/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-08T...",
  "uptime": 123.456,
  "environment": "development"
}
```

### 2. API Info
```bash
curl http://localhost:3000/api/v1
```

## 🔐 Authentication Tests

### Register New User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "SecurePass123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Expected Response:**
```json
{
  "user": {
    "id": 1,
    "email": "test@example.com",
    "username": "testuser",
    "firstName": "Test",
    "lastName": "User",
    "role": "customer",
    "isActive": true,
    "isVerified": false
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "30m"
}
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

### Get Current User Profile
```bash
# Replace <TOKEN> with your access token from login/register
curl http://localhost:3000/api/v1/users/me `
  -H "Authorization: Bearer <TOKEN>"
```

### Refresh Access Token
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh `
  -H "Content-Type: application/json" `
  -d '{
    "refreshToken": "<YOUR_REFRESH_TOKEN>"
  }'
```

## 📦 Products (Coming Soon - Sprint 3)
```bash
curl http://localhost:3000/api/v1/products
```

## 🛒 Cart (Coming Soon - Sprint 4)
```bash
curl http://localhost:3000/api/v1/cart `
  -H "Authorization: Bearer <TOKEN>"
```

## 📋 Orders (Coming Soon - Sprint 5)
```bash
curl http://localhost:3000/api/v1/orders `
  -H "Authorization: Bearer <TOKEN>"
```

## 🌐 Using Swagger UI (Recommended)

1. Open browser: http://localhost:3000/docs
2. Click on any endpoint
3. Click "Try it out"
4. Fill in the parameters
5. Click "Execute"
6. See the response

### Authenticate in Swagger:
1. Register or Login via API
2. Copy the `accessToken` from response
3. Click "Authorize" button (🔓) at top
4. Paste token in format: `<your-access-token>`
5. Click "Authorize"
6. Now you can test protected endpoints!

## 📊 Database Check

### Check PostgreSQL
```bash
docker exec -it ecommerce_db psql -U ecommerce_user -d ecommerce_db
```

### List Tables
```sql
\dt
```

### Check Users Table
```sql
SELECT * FROM users;
```

### Exit psql
```sql
\q
```

## 🔍 Common Issues

### Port Already in Use
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Database Connection Error
```bash
# Check if PostgreSQL is running
docker ps | findstr postgres

# Restart database
docker-compose restart db
```

### Redis Connection Error
```bash
# Check if Redis is running
docker ps | findstr redis

# Restart Redis
docker-compose restart redis
```

## 📝 Development Workflow

1. **Make Code Changes** - Edit files in `src/`
2. **Auto Reload** - Webpack watches for changes
3. **Check Logs** - View terminal for compilation status
4. **Test API** - Use Swagger or curl
5. **Check Database** - View data in PgAdmin or psql

## 🎯 Next Steps

1. ✅ Server is running
2. ✅ Test authentication endpoints
3. ✅ Register a user
4. ✅ Login and get token
5. ✅ Test protected endpoints
6. 📝 Read Sprint 2 documentation
7. 🚀 Start implementing Sprint 2 features

## 🔗 Resources

- **API Docs**: http://localhost:3000/docs
- **PgAdmin**: http://localhost:5050 (admin@admin.com / admin)
- **Project Docs**: `../docs/`
- **Roadmap**: `../docs/01_plan/project-roadmap.md`

---

**Happy Testing! 🎉**

