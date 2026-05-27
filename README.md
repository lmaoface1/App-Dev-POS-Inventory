# SmartSale — Point of Sale & Inventory Management System

> IT 323 Final Project

SmartSale is a web-based Point of Sale and Inventory Management System built for small to medium businesses. It supports two user roles — **Admin** and **Cashier** — each with their own dashboard and permissions.

---

## Features

### Admin

- Dashboard with sales summary, revenue, and low stock alerts
- Inventory management — add, edit, delete, and adjust product stock
- Order history with itemized sale details
- Sales analytics with Chart.js visualizations
- Report generation
- User management — create and delete cashier and admin accounts

### Cashier

- Point of Sale screen — search products, add to cart, and checkout
- Automatic stock deduction on every sale
- Printable receipt after checkout
- Personal order history

---

## Tech Stack

| Layer          | Technology                           |
| -------------- | ------------------------------------ |
| Frontend       | React.js + Vite                      |
| Styling        | Tailwind CSS                         |
| Backend        | Node.js + Express                    |
| Database       | Supabase (PostgreSQL, cloud-hosted)  |
| Authentication | Custom JWT (jsonwebtoken + bcryptjs) |
| Charts         | Chart.js                             |

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)
- A free [Supabase](https://supabase.com) account

---

## Database Setup (Supabase)

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com), sign in, and create a new project. Wait for it to fully provision.

### 2. Run the schema

Go to **SQL Editor → New Query**, paste and run the following:

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(10) CHECK (role IN ('admin', 'cashier')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products / Inventory
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150),
  category VARCHAR(100),
  price DECIMAL(10,2),
  stock INT DEFAULT 0,
  low_stock_threshold INT DEFAULT 5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales transactions
CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  cashier_id INT REFERENCES users(id),
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sale items
CREATE TABLE sale_items (
  id SERIAL PRIMARY KEY,
  sale_id INT REFERENCES sales(id),
  product_id INT REFERENCES products(id),
  quantity INT,
  unit_price DECIMAL(10,2)
);
```

### 3. Enable RLS and add policies

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service full access on users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access on products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access on sales" ON sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access on sale_items" ON sale_items FOR ALL USING (true) WITH CHECK (true);
```

### 4. Get your API keys

Go to **Project Settings → API** and copy:

- **Project URL** — looks like `https://xxxxxxxxxxxx.supabase.co`
- **service_role key** — the long `eyJ...` secret key

> ⚠️ Never share or commit the service_role key publicly.

---

## Backend Setup

### 1. Navigate to the backend folder

```bash
cd smartsale-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your `.env` file

Create a `.env` file in the root of the backend folder:

```env
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
JWT_SECRET=smartsale_secret_2024
PORT=5000
```

> Replace `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` with your actual values from Supabase.

### 4. Start the backend server

```bash
npm run dev
```

The server will start at `http://localhost:5000`.

---

## Frontend Setup

### 1. Navigate to the frontend folder

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the frontend

```bash
npm run dev
```

The app will open at `http://localhost:5173`.

---

## First-Time Login

Before logging in, you need to create an admin account. Use Postman, Thunder Client, or any API client:

```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin",
  "email": "admin@smartsale.com",
  "password": "yourpassword",
  "role": "admin"
}
```

Then log in through the SmartSale login page at `http://localhost:5173`.

---

## API Reference

| Method | Endpoint                      | Access  | Description                   |
| ------ | ----------------------------- | ------- | ----------------------------- |
| POST   | `/api/auth/register`          | Public  | Create a user account         |
| POST   | `/api/auth/login`             | Public  | Login, returns JWT token      |
| GET    | `/api/auth/users`             | Admin   | Get all users                 |
| GET    | `/api/products`               | All     | Get all products              |
| POST   | `/api/products`               | Admin   | Add a product                 |
| PUT    | `/api/products/:id`           | Admin   | Edit a product                |
| DELETE | `/api/products/:id`           | Admin   | Delete a product              |
| GET    | `/api/products/low-stock`     | Admin   | Get low stock items           |
| POST   | `/api/sales`                  | Cashier | Process a checkout            |
| GET    | `/api/sales`                  | Admin   | Get all sales                 |
| GET    | `/api/sales/:id`              | Admin   | Get sale details with items   |
| GET    | `/api/dashboard/summary`      | Admin   | Revenue + transaction summary |
| GET    | `/api/dashboard/sales-by-day` | Admin   | Sales data for charts         |

---

## User Roles

| Role        | Access                                                                  |
| ----------- | ----------------------------------------------------------------------- |
| **Admin**   | Dashboard, Inventory, Orders, Sales Analytics, Reports, User Management |
| **Cashier** | Point of Sale, My Orders                                                |

---

## Environment Variables

| Variable               | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `SUPABASE_URL`         | Your Supabase project URL                       |
| `SUPABASE_SERVICE_KEY` | Your Supabase service_role secret key           |
| `JWT_SECRET`           | Secret string used to sign JWT tokens           |
| `PORT`                 | Port the Express server runs on (default: 5000) |

---

## Security Notes

- Passwords are hashed using **bcryptjs** before being stored in the database
- All protected routes require a valid **JWT token** in the `Authorization: Bearer <token>` header
- The `service_role` key is only used server-side and never exposed to the frontend
- Admin-only routes are protected by both JWT verification and a role check middleware

---

_SmartSale — IT 323 Final Project | USTP_
