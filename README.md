# Finance Data Processing & Access Control Backend

A professional, role-based backend system for managing financial records, built with Node.js, Express, and SQLite. This system features robust authentication (JWT), flexible role-based permissions (RBAC), and aggregated dashboard analytics.

## 🚀 Quick Start (Evaluate in 2 Minutes)

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Setup**:
    - Copy `.env.example` to `.env`.
    - (Optional) Customize the `JWT_SECRET` and `PORT`.
3.  **Seed the database**:
    ```bash
    npm run seed
    ```
4.  **Start the server**:
    ```bash
    npm run dev
    ```


---

## 🔐 Authentication & Roles

The system uses **JWT (JSON Web Tokens)** for stateless authentication.

### **Required Environment Variables**

Before running the server, copy `.env.example` to a new file named `.env` and configure the following:

- `PORT`: Server port (Default: `3000`).
- `JWT_SECRET`: Secret key for signing tokens (Use a complex string).
- `DB_PATH`: Path for the SQLite database file.
- `ADMIN_INITIAL_PASSWORD`: Initial password for the seeded admin account.

### **Default Test Credentials**

- **Admin**: `admin` / `admin123` (Full Access)
- **Analyst**: `analyst` / `analyst123` (Raw Data + Insights)
- **Viewer**: `viewer` / `viewer123` (Dashboard Only)

### **Role-Based Access Control (RBAC)**

| Feature | ADMIN | ANALYST | VIEWER |
| :--- | :---: | :---: | :---: |
| Register New Users | ✅ | ❌ | ❌ |
| Create/Update/Delete Records | ✅ | ❌ | ❌ |
| View Raw Financial Records | ✅ | ✅ | ❌ |
| Access Dashboard Summaries | ✅ | ✅ | ✅ |
| Access Trends & Analytics | ✅ | ✅ | ✅ |


---

## 🛣️ API Reference

### **Auth Endpoints**
- `POST /auth/login`: Authenticate and receive a JWT.
- `POST /auth/register`: (Admin Only) Create a new user with a specific role.

### **Transaction Endpoints** (Support Filters: `type`, `category`, `startDate`, `endDate`)
- `GET /transactions`: Retrieve all records (accessible to all roles).
- `POST /transactions`: (Admin Only) Create a new entry.
- `PUT /transactions/:id`: (Admin Only) Update an existing entry.
- `DELETE /transactions/:id`: (Admin Only) Remove an entry.

### **Dashboard Endpoints**
- `GET /dashboard/summary`: Net balance, total income, and total expenses.
- `GET /dashboard/categories`: Aggregated totals grouped by category.
- `GET /dashboard/trends`: Monthly income vs. expense performance.

---

## 🛠️ Technology Stack

-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: SQLite (Portability & Zero-Config)
-   **Security**: `bcryptjs` (Hashing) & `jsonwebtoken` (JWT)
-   **Validation**: `Zod` (Schema-based input validation)
-   **Middleware**: `morgan` (Logging) & `dotenv` (Environment Config)

---

## 📂 Project Structure

```text
src/
├── controllers/      # Business logic (Auth, Transactions, Dashboard)
├── db/               # Database config, migrations, and seeding
├── middleware/       # Authentication & RBAC guards
├── routes/           # API route definitions
├── utils/            # Zod validation schemas
└── index.js          # Entry point & global error handling
```

---

## 🧠 Design Decisions & Tradeoffs

In building this project, several key architectural decisions were made to prioritize **clarity**, **security**, and **portability**:

1.  **SQLite over PostgreSQL/MongoDB**: Chosen for **zero-configuration portability**. An evaluator can run the project immediately without setting up a separate database server. For production, this could be easily swapped for a managed relational database due to our clean controller/service separation.
2.  **JWT (Stateless Auth)**: Implemented to ensure the backend is scalable and can easily work with a separate frontend without managing session state on the server.
3.  **Zod for Runtime Type Safety**: Every incoming request is validated against a schema before it ever hits the database. this protects against SQL injection, malformed data, and unexpected crashes.
4.  **RBAC Middleware**: Designed as a reusable higher-order function (`authorize(['ROLES'])`). This makes adding new roles or changing permissions incredibly simple and readable in the route files.
5.  **Soft Delete vs. Hard Delete**: For this assignment, we use hard deletes for simplicity, though the database schema is structured such that "Deleted At" columns could be added without breaking existing logic.

