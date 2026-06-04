# VitalsCheck Backend — Express.js API

Backend REST API untuk sistem deteksi dini risiko Penyakit Tidak Menular (PTM) berbasis machine learning.

**Project**: CC26-PSU319 | Coding Camp 2026
**Stack**: Express.js, Prisma ORM, PostgreSQL/Supabase, Node.js

---

## 📋 Quick Start

### Prerequisites
- Node.js 16+
- npm atau yarn
- PostgreSQL/Supabase account

### 1. Setup Project

```bash
# Clone atau navigate ke folder backend
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### 2. Configure Environment

Edit `.env` dengan nilai aktual:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/vitalscheck
MODEL_API_URL=https://vitalscheck-api.onrender.com
JWT_SECRET=ganti_dengan_secret_yang_kuat
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Catatan DATABASE_URL**:
- Local PostgreSQL: `postgresql://postgres:password@localhost:5432/vitalscheck`
- Supabase: Ambil dari Supabase dashboard → Settings → Database → URI

### 3. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (create tables)
npx prisma migrate dev

# (Optional) Seed initial data
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

---

## 🔗 API Endpoints

**Base URL**: `http://localhost:5000/api`

### Authentication
```http
POST   /auth/register       # Daftar user baru
POST   /auth/login          # Login (return JWT token)
GET    /auth/me             # Get current user (require token)
```

### User Profile
```http
GET    /users/profile       # Get user profile
PUT    /users/profile       # Update user profile
```

### Screening / Health Check
```http
POST   /screenings          # Create new screening
GET    /screenings          # Get all user's screenings
GET    /screenings/:id      # Get specific screening
DELETE /screenings/:id      # Delete screening
```

### Education Content
```http
GET    /education           # Get education contents
GET    /education?category=low|medium|high  # Filter by risk category
```

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev              # Start dengan nodemon (auto reload)
npm run start            # Start production mode
npm run lint             # Lint code dengan ESLint
npm run format           # Format code dengan Prettier
```

### Database Management

```bash
# Create new migration setelah edit schema.prisma
npx prisma migrate dev --name <migration_name>

# View database di Prisma Studio (GUI)
npx prisma studio

# Reset database (DANGER — hapus semua data)
npx prisma migrate reset
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── app.js                  # Express setup & middleware
│   ├── server.js               # Entry point, listen port
│   ├── config/                 # Configuration (db, env)
│   ├── routes/                 # Route definitions
│   ├── controllers/            # Request handlers
│   ├── services/               # Business logic
│   ├── middlewares/            # Custom middleware
│   ├── validators/             # Input validation schemas
│   └── utils/                  # Helper functions
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Generated migrations
├── .env.example                # Env template
├── package.json
└── STRUCTURE.md                # Detailed documentation
```

---

## 📊 Database Schema

Database dimanage dengan Prisma ORM. Schema di `prisma/schema.prisma`:

**Tables**:
- `User` — user accounts (email, password, etc)
- `Screening` — health screening results
- `HealthProfile` — user health profile
- `EducationContent` — preventive education materials

Lihat `prisma/schema.prisma` untuk detail lengkap.

---

## 🔐 Authentication

Sistem menggunakan **JWT (JSON Web Token)**:

1. User login → server return JWT token
2. Client attach token ke header: `Authorization: Bearer <token>`
3. Server verifikasi token di `auth.middleware.js`

Token valid selama `JWT_EXPIRES_IN` (default 7 hari).

---

## 📚 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js 16+ |
| **Framework** | Express.js 4.x |
| **Database** | PostgreSQL / Supabase |
| **ORM** | Prisma |
| **Auth** | JWT + bcryptjs |
| **Validation** | Joi / Zod |
| **HTTP Client** | Axios |
