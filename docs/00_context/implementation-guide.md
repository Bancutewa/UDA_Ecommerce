# Implementation Guide - E-Commerce Platform Backend

**Status**: Foundation Document - DO NOT EDIT WITHOUT EXPLICIT APPROVAL  
**Last Updated**: 2025-10-08  
**Version**: 1.0

## 1. 🏗️ Architecture Overview

### 1.1 System Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  (Web Browser, Mobile App, Admin Dashboard)                     │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS/WSS
┌────────────────────────▼────────────────────────────────────────┐
│                     API Gateway / Load Balancer                  │
│                    (Nginx, AWS ALB, Cloudflare)                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼────────┐ ┌────▼──────┐  ┌──────▼────────┐
│  Web API       │ │  Admin    │  │  WebSocket    │
│  (FastAPI)     │ │  API      │  │  Server       │
│                │ │           │  │               │
└───────┬────────┘ └────┬──────┘  └──────┬────────┘
        │               │                 │
        └───────────────┼─────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼────────┐ ┌───▼──────┐ ┌─────▼──────────┐
│  Business      │ │  Cache   │ │  Message Queue │
│  Logic Layer   │ │  (Redis) │ │  (Celery+Redis)│
└───────┬────────┘ └──────────┘ └────────────────┘
        │
┌───────▼────────┐
│   Data Layer   │
│  (PostgreSQL)  │
└────────────────┘

┌─────────────────────────────────────────────┐
│         External Services                    │
│  • Payment Gateways (VNPay, MoMo)          │
│  • Shipping APIs (GHTK, Viettel Post)      │
│  • Email/SMS (SendGrid, Twilio)            │
│  • Search Engine (Elasticsearch)            │
│  • Storage (AWS S3, Cloudinary)            │
└─────────────────────────────────────────────┘
```

### 1.2 Technology Stack

**Core Framework**
- **FastAPI** (Python 3.11+): High-performance async web framework
- **Pydantic**: Data validation and serialization
- **SQLAlchemy 2.0**: ORM with async support
- **Alembic**: Database migrations

**Database**
- **PostgreSQL 15+**: Primary relational database
- **Redis 7+**: Caching and session storage
- **Elasticsearch 8**: Full-text search (optional, can start with PostgreSQL full-text search)

**Task Queue**
- **Celery**: Distributed task queue
- **Redis**: Message broker for Celery

**Authentication & Security**
- **python-jose**: JWT token handling
- **passlib + bcrypt**: Password hashing
- **python-multipart**: File upload handling

**Testing**
- **pytest**: Testing framework
- **pytest-asyncio**: Async test support
- **httpx**: Async HTTP client for testing
- **faker**: Test data generation

**Development Tools**
- **uvicorn**: ASGI server
- **black**: Code formatting
- **ruff**: Fast Python linter
- **mypy**: Static type checking

## 2. 📂 Project Structure

```
ecommerce_platform/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # FastAPI application entry
│   │   ├── config.py                  # Configuration management
│   │   ├── database.py                # Database connection
│   │   ├── dependencies.py            # FastAPI dependencies
│   │   │
│   │   ├── api/                       # API endpoints
│   │   │   ├── __init__.py
│   │   │   ├── v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py           # Authentication endpoints
│   │   │   │   ├── users.py          # User management
│   │   │   │   ├── products.py       # Product catalog
│   │   │   │   ├── categories.py     # Categories
│   │   │   │   ├── cart.py           # Shopping cart
│   │   │   │   ├── orders.py         # Order management
│   │   │   │   ├── payments.py       # Payment processing
│   │   │   │   ├── shipping.py       # Shipping integration
│   │   │   │   ├── reviews.py        # Product reviews
│   │   │   │   ├── admin.py          # Admin endpoints
│   │   │   │   └── webhooks.py       # Webhook handlers
│   │   │   └── deps.py               # Route dependencies
│   │   │
│   │   ├── models/                    # SQLAlchemy models
│   │   │   ├── __init__.py
│   │   │   ├── base.py               # Base model class
│   │   │   ├── user.py               # User, Address, Session
│   │   │   ├── product.py            # Product, Variant, Media
│   │   │   ├── category.py           # Category hierarchy
│   │   │   ├── order.py              # Order, OrderItem
│   │   │   ├── payment.py            # Payment transactions
│   │   │   ├── shipping.py           # Shipment tracking
│   │   │   ├── promotion.py          # Coupons, Promotions
│   │   │   ├── review.py             # Product reviews
│   │   │   └── audit.py              # Audit logs
│   │   │
│   │   ├── schemas/                   # Pydantic schemas
│   │   │   ├── __init__.py
│   │   │   ├── user.py               # User DTOs
│   │   │   ├── product.py            # Product DTOs
│   │   │   ├── order.py              # Order DTOs
│   │   │   ├── payment.py            # Payment DTOs
│   │   │   └── common.py             # Shared schemas
│   │   │
│   │   ├── services/                  # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py       # Authentication logic
│   │   │   ├── user_service.py       # User operations
│   │   │   ├── product_service.py    # Product operations
│   │   │   ├── order_service.py      # Order processing
│   │   │   ├── payment_service.py    # Payment integration
│   │   │   ├── shipping_service.py   # Shipping integration
│   │   │   ├── cart_service.py       # Cart management
│   │   │   ├── promotion_service.py  # Promotion calculations
│   │   │   ├── email_service.py      # Email notifications
│   │   │   └── search_service.py     # Search functionality
│   │   │
│   │   ├── integrations/              # External API clients
│   │   │   ├── __init__.py
│   │   │   ├── payment/
│   │   │   │   ├── vnpay.py
│   │   │   │   ├── momo.py
│   │   │   │   └── base.py
│   │   │   ├── shipping/
│   │   │   │   ├── ghtk.py
│   │   │   │   ├── viettel_post.py
│   │   │   │   └── base.py
│   │   │   └── notification/
│   │   │       ├── email.py
│   │   │       └── sms.py
│   │   │
│   │   ├── utils/                     # Utility functions
│   │   │   ├── __init__.py
│   │   │   ├── security.py           # JWT, password hashing
│   │   │   ├── validators.py         # Custom validators
│   │   │   ├── pagination.py         # Pagination helpers
│   │   │   ├── exceptions.py         # Custom exceptions
│   │   │   └── logging.py            # Logging configuration
│   │   │
│   │   └── tasks/                     # Celery tasks
│   │       ├── __init__.py
│   │       ├── email_tasks.py        # Email sending
│   │       ├── order_tasks.py        # Order processing
│   │       └── inventory_tasks.py    # Inventory sync
│   │
│   ├── alembic/                       # Database migrations
│   │   ├── versions/
│   │   ├── env.py
│   │   └── alembic.ini
│   │
│   ├── tests/                         # Test suite
│   │   ├── __init__.py
│   │   ├── conftest.py               # Pytest fixtures
│   │   ├── test_auth.py
│   │   ├── test_products.py
│   │   ├── test_orders.py
│   │   └── integration/
│   │       ├── test_payment_flow.py
│   │       └── test_order_flow.py
│   │
│   ├── scripts/                       # Utility scripts
│   │   ├── init_db.py                # Initialize database
│   │   ├── seed_data.py              # Seed test data
│   │   └── migrate.py                # Migration helper
│   │
│   ├── .env.example                   # Environment variables template
│   ├── .gitignore
│   ├── requirements.txt               # Production dependencies
│   ├── requirements-dev.txt           # Development dependencies
│   ├── pytest.ini                     # Pytest configuration
│   ├── pyproject.toml                 # Python project config
│   └── README.md
│
└── docs/                              # Documentation
    ├── 00_context/                    # Technical foundation
    │   ├── requirements.md
    │   ├── implementation-guide.md
    │   └── api-reference.md
    ├── 01_plan/                       # Project management
    │   └── project-roadmap.md
    └── 02_implement/                  # Sprint execution
        └── sprint-1-foundation.md
```

## 3. 🔧 Core Patterns & Practices

### 3.1 Layered Architecture

**Presentation Layer (API)**
- FastAPI routers handle HTTP requests
- Input validation with Pydantic schemas
- Response serialization
- Error handling

**Business Logic Layer (Services)**
- Encapsulates business rules
- Orchestrates data access and external integrations
- Transaction management
- Caching logic

**Data Access Layer (Models)**
- SQLAlchemy ORM models
- Database queries and operations
- Relationship management

**Integration Layer**
- External API clients
- Webhook handlers
- Message queue producers/consumers

### 3.2 Dependency Injection

```python
# dependencies.py
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

async def get_db() -> AsyncSession:
    async with async_session_maker() as session:
        yield session

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    # Validate token and return user
    pass

# Usage in routes
@router.get("/me")
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user
```

### 3.3 Repository Pattern (Optional)

```python
# repositories/user_repository.py
class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_by_id(self, user_id: int) -> User | None:
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def create(self, user_data: dict) -> User:
        user = User(**user_data)
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
```

### 3.4 Service Layer Pattern

```python
# services/order_service.py
class OrderService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.payment_service = PaymentService()
        self.inventory_service = InventoryService(db)
        self.email_service = EmailService()
    
    async def create_order(
        self,
        user_id: int,
        cart_items: list,
        shipping_address_id: int,
        payment_method: str
    ) -> Order:
        # 1. Validate inventory
        await self.inventory_service.validate_stock(cart_items)
        
        # 2. Calculate totals
        order_data = await self._calculate_order_totals(cart_items)
        
        # 3. Create order
        order = Order(**order_data, user_id=user_id)
        self.db.add(order)
        
        # 4. Reserve inventory
        await self.inventory_service.reserve_stock(cart_items, order.id)
        
        # 5. Process payment
        if payment_method != "COD":
            payment_result = await self.payment_service.create_payment(
                order_id=order.id,
                amount=order.total,
                method=payment_method
            )
            order.payment_url = payment_result.url
        
        await self.db.commit()
        
        # 6. Send confirmation email (async task)
        send_order_confirmation_email.delay(order.id)
        
        return order
```

### 3.5 Error Handling

```python
# utils/exceptions.py
class AppException(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code

class NotFoundException(AppException):
    def __init__(self, message: str):
        super().__init__(message, status_code=404)

class UnauthorizedException(AppException):
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(message, status_code=401)

# main.py
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.message}
    )
```

### 3.6 Async Programming

```python
# Use async/await for I/O operations
async def get_product_details(product_id: int, db: AsyncSession):
    # Database query
    result = await db.execute(
        select(Product).where(Product.id == product_id)
    )
    product = result.scalar_one_or_none()
    
    if not product:
        raise NotFoundException("Product not found")
    
    # Parallel external API calls
    reviews, inventory = await asyncio.gather(
        fetch_reviews(product_id),
        check_inventory(product_id)
    )
    
    return {
        "product": product,
        "reviews": reviews,
        "inventory": inventory
    }
```

## 4. 🗄️ Database Design

### 4.1 Core Principles
- Use UUIDs for public-facing IDs (prevent enumeration)
- Soft deletes with `deleted_at` timestamp
- Audit timestamps: `created_at`, `updated_at`
- JSON columns for flexible attributes
- Indexes on frequently queried columns
- Foreign key constraints with appropriate cascade rules

### 4.2 Schema Example

```python
# models/product.py
class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(Text)
    brand_id = Column(Integer, ForeignKey("brands.id"))
    category_id = Column(Integer, ForeignKey("categories.id"), index=True)
    status = Column(Enum(ProductStatus), default=ProductStatus.DRAFT, index=True)
    
    # SEO
    meta_title = Column(String(255))
    meta_description = Column(String(500))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    brand = relationship("Brand", back_populates="products")
    category = relationship("Category", back_populates="products")
    variants = relationship("ProductVariant", back_populates="product", lazy="selectin")
    media = relationship("ProductMedia", back_populates="product")
    reviews = relationship("Review", back_populates="product")
```

### 4.3 Migration Strategy
- Always use Alembic for schema changes
- Test migrations on staging before production
- Keep migrations reversible when possible
- Add indexes in separate migrations for large tables
- Backup database before major migrations

## 5. 🔐 Authentication & Authorization

### 5.1 JWT Authentication

```python
# utils/security.py
from jose import jwt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
```

### 5.2 Role-Based Access Control (RBAC)

```python
# models/user.py
class Role(str, Enum):
    CUSTOMER = "customer"
    STAFF = "staff"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"

class Permission(str, Enum):
    READ_PRODUCTS = "read:products"
    WRITE_PRODUCTS = "write:products"
    READ_ORDERS = "read:orders"
    WRITE_ORDERS = "write:orders"
    MANAGE_USERS = "manage:users"

# dependencies.py
def require_role(required_role: Role):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in [required_role, Role.SUPER_ADMIN]:
            raise UnauthorizedException("Insufficient permissions")
        return current_user
    return role_checker

# Usage
@router.post("/products")
async def create_product(
    product: ProductCreate,
    current_user: User = Depends(require_role(Role.ADMIN))
):
    pass
```

## 6. 🔌 API Design Standards

### 6.1 RESTful Conventions

```
GET    /api/v1/products           # List products
GET    /api/v1/products/{id}      # Get product by ID
POST   /api/v1/products           # Create product
PUT    /api/v1/products/{id}      # Update product (full)
PATCH  /api/v1/products/{id}      # Update product (partial)
DELETE /api/v1/products/{id}      # Delete product

# Nested resources
GET    /api/v1/products/{id}/reviews
POST   /api/v1/products/{id}/reviews

# Actions
POST   /api/v1/orders/{id}/cancel
POST   /api/v1/orders/{id}/confirm
```

### 6.2 Response Format

```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "Product Name",
    "price": 100000
  },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### 6.3 Pagination

```python
# utils/pagination.py
from typing import Generic, TypeVar, List
from pydantic import BaseModel

T = TypeVar("T")

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    per_page: int
    total_pages: int

async def paginate(
    query,
    page: int = 1,
    per_page: int = 20,
    max_per_page: int = 100
) -> PaginatedResponse:
    per_page = min(per_page, max_per_page)
    total = await db.scalar(select(func.count()).select_from(query.subquery()))
    items = await db.scalars(
        query.offset((page - 1) * per_page).limit(per_page)
    )
    return PaginatedResponse(
        items=list(items),
        total=total,
        page=page,
        per_page=per_page,
        total_pages=(total + per_page - 1) // per_page
    )
```

## 7. 🧪 Testing Strategy

### 7.1 Test Pyramid
- **Unit Tests (70%)**: Test individual functions and methods
- **Integration Tests (20%)**: Test API endpoints and database operations
- **E2E Tests (10%)**: Test complete user flows

### 7.2 Test Structure

```python
# tests/conftest.py
import pytest
from httpx import AsyncClient
from app.main import app
from app.database import Base, engine

@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
async def test_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

# tests/test_auth.py
@pytest.mark.asyncio
async def test_register_user(client: AsyncClient, test_db):
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "password": "SecurePass123!",
            "username": "testuser"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
```

## 8. 🚀 Deployment & DevOps

### 8.1 Environment Variables

```bash
# .env.example
# Application
APP_NAME=E-Commerce Platform
APP_ENV=development
DEBUG=true
SECRET_KEY=your-secret-key-change-in-production

# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/ecommerce
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=40

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
JWT_SECRET_KEY=your-jwt-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Payment Gateways
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

MOMO_PARTNER_CODE=your_partner_code
MOMO_ACCESS_KEY=your_access_key
MOMO_SECRET_KEY=your_secret_key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Storage
STORAGE_TYPE=local  # or s3, cloudinary
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your-bucket-name
```

### 8.2 Docker Configuration

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY ./app ./app
COPY ./alembic ./alembic
COPY alembic.ini .

# Run migrations and start server
CMD alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://postgres:postgres@db:5432/ecommerce
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: ecommerce
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  celery_worker:
    build: .
    command: celery -A app.tasks worker --loglevel=info
    depends_on:
      - redis
      - db

volumes:
  postgres_data:
```

## 9. 📝 Code Style & Standards

### 9.1 Python Style Guide
- Follow PEP 8
- Use type hints
- Maximum line length: 100 characters
- Use Black for formatting
- Use Ruff for linting

### 9.2 Naming Conventions
- Classes: `PascalCase`
- Functions/Variables: `snake_case`
- Constants: `UPPER_SNAKE_CASE`
- Private methods: `_leading_underscore`

### 9.3 Documentation
- Docstrings for all public functions and classes
- Type hints for all function parameters and returns
- README for each major module

## 10. 📚 References
- FastAPI Documentation: https://fastapi.tiangolo.com/
- SQLAlchemy 2.0: https://docs.sqlalchemy.org/
- Pydantic V2: https://docs.pydantic.dev/
- Alembic: https://alembic.sqlalchemy.org/

---

**Document Control**
- **Owner**: Engineering Team
- **Review Cycle**: Monthly or on architecture changes
- **Approval Required**: Yes (Tech Lead + Senior Engineer)

