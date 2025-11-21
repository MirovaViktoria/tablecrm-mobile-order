---
description: How to deploy the application to Vercel
---

# Deploying to Vercel

This project is configured for deployment on Vercel. Follow these steps to deploy.

## Prerequisites

1.  **Vercel Account**: Ensure you have an account at [vercel.com](https://vercel.com).
2.  **Vercel CLI**: (Optional) If you prefer command line, install it via `npm i -g vercel`.

## Option 1: Deploy via Git (Recommended)

1.  **Push your code** to a Git repository (GitHub, GitLab, or Bitbucket).
2.  **Go to Vercel Dashboard**: [https://vercel.com/dashboard](https://vercel.com/dashboard)
3.  **Add New Project**:
    *   Click "Add New..." -> "Project".
    *   Import your Git repository.
4.  **Configure Project**:
    *   **Framework Preset**: Vercel should automatically detect `Vite`.
    *   **Root Directory**: `./` (default)
    *   **Build Command**: `npm run build` (default)
    *   **Output Directory**: `dist` (default)
    *   **Environment Variables**: No special variables needed for this frontend-only build (API is proxied).
5.  **Deploy**: Click "Deploy".

## Option 2: Deploy via CLI

1.  Open your terminal in the project folder.
2.  Run the deploy command:
    ```bash
    npx vercel
    ```
3.  Follow the prompts:
    *   Set up and deploy? `Y`
    *   Which scope? (Select your account)
    *   Link to existing project? `N` (or `Y` if updating)
    *   Project name? `tablecrm-mobile-order`
    *   Directory? `./`
    *   Want to modify settings? `N`
4.  Wait for the deployment to complete. You will get a production URL.

## Important Note on API Proxy

The project includes a `vercel.json` file that configures the API proxy. This ensures that requests to `/api/*` are correctly forwarded to `https://app.tablecrm.com/api/*`. This is crucial for the app to work in production.
