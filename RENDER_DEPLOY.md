# 🚀 Render Deployment Guide

Follow these steps to deploy your **Finance Management Backend** to Render for your assignment submission.

## 1. Prepare your GitHub Repository
Ensure all your changes are committed and pushed to your GitHub repository.

## 2. Create a New Web Service on Render
1.  Log in to [Render](https://dashboard.render.com).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository.
4.  Select the repository for this project.

## 3. Configure the Web Service
Use the following settings:

| Setting | Value |
| :--- | :--- |
| **Name** | `finance-backend` (or your choice) |
| **Environment** | `Node` |
| **Build Command** | `npm install && npm run seed` |
| **Start Command** | `npm start` |

> [!TIP]
> Including `npm run seed` in your build command ensures that every time you deploy, the evaluator starts with a fresh set of sample data.

## 4. Set Environment Variables
Go to the **Environment** tab and add the following keys:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `PORT` | `10000` | (Default for Render) |
| `JWT_SECRET` | `replace-with-a-secure-random-string` | Used for securing logins. |
| `ADMIN_INITIAL_PASSWORD` | `admin123` | (Important for the evaluator to log in!) |
| `DB_PATH` | `./finance.db` | Path to your SQLite file. |

## 5. Verify the Deployment
Once the deployment is complete:
1.  Go to `https://your-app-name.onrender.com/health` to confirm the status is `UP`.
2.  Go to `https://your-app-name.onrender.com/api-docs` to view the Swagger UI.
3.  **Test It**: Use the `POST /auth/login` endpoint with the admin credentials to get a token, then click **Authorize** and enter `Bearer <your_token>` to test the other routes.

---
**Submission Note**: Include the URL of your deployed Swagger UI in your assignment submission as the "Documentation Link".
