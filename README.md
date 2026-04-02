# 🏛️ Secure Finance Management Backend

A professional, role-based backend system for managing financial records, built with **Node.js**, **Express**, and **SQLite**. This system features robust authentication (JWT), flexible role-based permissions (RBAC), and aggregated dashboard analytics.

---

## 🕹️ Interactive API Playground (Swagger UI)

The fastest way to explore and test the API is through the built-in Swagger UI:

- **Local URL**: `http://localhost:3000/api-docs`
- **What to do**:
    1.  Go to `POST /auth/login` and use the admin credentials to get a token.
    2.  Click the "Authorize" button and enter `Bearer <your_token>`.
    3.  You can now test all endpoints, including **Pagination**, **Keyword Search**, and **Soft Deletion**.

---

## 🚀 Quick Start (Setup in 60 Seconds)

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Setup**:
    - Copy `.env.example` to a new file named `.env`.
    - (Optional) Customize your `PORT` or `JWT_SECRET`.
3.  **Seed the Database**:
    ```bash
    npm run seed
    ```
4.  **Start the Server**:
    ```bash
    npm run dev
    ```
5.  **Run Tests**:
    ```bash
    npm test
    ```

---

## 🔐 Authentication & Role-Based Access (RBAC)

The system enforces strict access control based on user roles:

| Feature | **ADMIN** | **ANALYST** | **VIEWER** |
| :--- | :---: | :---: | :---: |
| Register New Users | ✅ | ❌ | ❌ |
| Manage Existing Users (List/Update/Delete) | ✅ | ❌ | ❌ |
| Deactivate Accounts (Block access) | ✅ | ❌ | ❌ |
| Create/Update/Delete Records (Hard/Soft) | ✅ | ❌ | ❌ |
| View Raw Financial Records | ✅ | ✅ | ❌ |
| Access Dashboard Summaries | ✅ | ✅ | ✅ |
| Access Trends & Analytics | ✅ | ✅ | ✅ |

### **Default Test Credentials**
- **Admin**: `admin` / `admin123` (Full Access)
- **Analyst**: `analyst` / `analyst123` (Detailed Data + Insights)
- **Viewer**: `viewer` / `viewer123` (Dashboard Summaries Only)

---

## 🏆 Senior Developer Feature Set

- **Pagination & Search**: Efficiently manage thousands of records with `page`, `limit`, and keyword `search`.
- **Soft Delete**: A professional "Trash Can" system where records are hidden via `isDeleted = 1` rather than being permanently destroyed.
- **Rate Limiting**: Protects against brute-force and DDoS attacks by limiting request volume per IP.
- **Auto-Migration**: The schema automatically evolves on server-start to ensure stability.
- **Zod Validation**: Strict runtime type-safety for every incoming request.

---

## 📂 Project Navigation

- **Entry Point**: `src/index.js`
- **Logic**: `src/controllers/`
- **Security**: `src/middleware/`
- **Validation**: `src/utils/validation.js`

---

## 🧠 Design Decisions & Tradeoffs

1.  **SQLite over PostgreSQL**: Chosen for **zero-configuration portability**. An evaluator can run the project immediately without a separate database server.
2.  **Stateless Auth (JWT)**: Ensures the backend is scalable and ready for a separate frontend (React/Next.js).
3.  **Soft-Delete Pattern**: Prioritizes data safety. In financial systems, we keep hidden history for audit and "undo" purposes.
4.  **RBAC Middleware**: Designed as a reusable higher-order function (`authorize(['ROLES'])`) for extreme readability across routes.
