# ERP System

A modern ERP (Enterprise Resource Planning) system built with NestJS and Next.js.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![NestJS](https://img.shields.io/badge/NestJS-v10-red)
![Next.js](https://img.shields.io/badge/Next.js-v15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## 🚀 Features

- 🔐 JWT Authentication with role-based access control
- 👥 User management (CRUD)
- 🛡️ Protected routes on frontend and backend
- 📦 Inventory module *(coming soon)*
- 💰 Sales module *(coming soon)*

## 🛠️ Tech Stack

**Backend**
- NestJS + TypeScript
- TypeORM + PostgreSQL
- JWT Authentication
- class-validator

**Frontend**
- Next.js 15 + TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Axios

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database (we use Render)
- npm

## ⚙️ Installation

### 1. Clone the repository
````bash
git clone https://github.com/EmmanuelImanol/erp-system.git
cd erp-system
````

### 2. Backend setup
````bash
cd backend
npm install
````

Create a `.env` file in the `backend/` folder:
````env
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your_secret_key
PORT=3000
````
````bash
npm run start:dev
````

### 3. Frontend setup
````bash
cd frontend
npm install
````

Create a `.env.local` file in the `frontend/` folder:
````env
NEXT_PUBLIC_API_URL=http://localhost:3000
````
````bash
npm run dev
```

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register user | ❌ |
| POST | `/auth/login` | Login | ❌ |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users` | Get all users | Admin |
| GET | `/users/:id` | Get user by ID | Admin |
| POST | `/users` | Create user | Admin |
| PUT | `/users/:id` | Update user | Admin |
| DELETE | `/users/:id` | Delete user | Admin |

## 📁 Project Structure
```
erp-system/
├── backend/
│   └── src/
│       ├── auth/
│       │   ├── decorators/
│       │   ├── dto/
│       │   ├── enums/
│       │   ├── guards/
│       │   ├── interfaces/
│       │   └── strategies/
│       ├── users/
│       │   ├── dto/
│       │   └── entities/
│       └── utils/
└── frontend/
    ├── app/
    │   ├── (auth)/login/
    │   └── (dashboard)/
    │       └── dashboard/
    │           └── users/
    ├── components/
    ├── lib/
    └── types/
```

## 👤 Default Admin

After setting up the database, create the first admin user via:
```
POST /auth/register
{
  "name": "Admin",
  "email": "admin@erp.com",
  "password": "yourpassword"
}
````

Then update the role to `admin` directly in the database.

## 📄 License

MIT
