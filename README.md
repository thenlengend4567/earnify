# Earnify - Reward Platform

A production-ready "Reward Platform" where users can sign up, complete tasks (ads, offers) to earn virtual currency, and request withdrawals. Built with **Next.js 14**, **PostgreSQL**, **Prisma**, and **Tailwind-like Vanilla CSS**.

## 🚀 Features
- **User Authentication**: Secure Signup/Login using HTTP-Only Cookies (JWT).
- **Dashboard**: Real-time balance interaction and task listing.
- **Earning System**: Users can complete tasks to earn rewards.
- **Wallet**: Withdrawal request system (PayPal, Bank, Crypto).
- **Admin Panel**: Manage users, stats, and approve/reject withdrawals.
- **Responsive Design**: Premium dark-mode UI.

## 🛠 Tech Stack
- **Frontend**: Next.js 14 (App Router), React, Vanilla CSS (Variables).
- **Backend**: Next.js API Routes.
- **Database**: PostgreSQL (via Prisma ORM).
- **Auth**: Custom JWT implementation (`jose`, `bcryptjs`).

## 📦 Installation & Setup

1.  **Clone the repository** & install dependencies:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/earnify?schema=public"
    JWT_SECRET_KEY="your-super-secret-key-at-least-32-chars-long"
    ```

3.  **Database Setup**:
    Ensure you have a PostgreSQL instance running. Then run:
    ```bash
    npx prisma migrate dev --name init
    ```

4.  **Run Locally**:
    ```bash
    npm run dev
    ```
    Visit `http://localhost:3000`.

## 🚀 Deployment

### Cloud Provider (Vercel / Railway / Render)
1.  **Database**: Provision a PostgreSQL database (e.g., on Railway, Supabase, or Neon).
2.  **Push Code**: Connect repository to Vercel (recommended for Next.js).
3.  **Environment**: Set `DATABASE_URL` and `JWT_SECRET_KEY` in Vercel project settings.
4.  **Build Command**: Vercel detects Next.js automatically.
    -   Build command: `npx prisma generate && next build` (Ensure prisma generate runs!)
    -   Install command: `npm install`

### VPS (Docker / PM2)
1.  Build the app: `npm run build`
2.  Start with PM2: `pm2 start npm --name "earnify" -- start`
3.  Use Nginx as reverse proxy.

## 🔐 Security Notes
- **Password Hashing**: Uses `bcryptjs` with salt size 10.
- **Session Security**: Uses HTTP-Only, Secure, SameSite cookies to prevent XSS/CSRF.
- **Role-Based Access Control (RBAC)**: Middleware protects `/admin` routes.
- **Input Validation**: API endpoints validate all inputs (amounts, IDs).
- **Atomic Transactions**: Prisma `$transaction` ensures balance updates and money logs never desync.

## 💰 Monetization Strategy (How to make it real)
1.  **Ad Networks**: Integrate Google AdSense, AdMob, or Unity Ads into the "Task" flow. Real tasks would trigger ad views.
2.  **Offerwalls**: Integrate CPA networks (e.g., CPAGrip, OGAds). Use Postback URLs to call `/api/tasks/webhook` (needs implementation) to credit users automatically.
3.  **Affiliate Marketing**: Add "Referral" tasks that link to affiliate products.

## 📜 Legal & Safety (Disclaimer)
- **TOS**: You should add a Terms of Service page outlining prohibited behaviors (botting, multiple accounts).
- **Privacy**: Add a Privacy Policy regarding data collection (email).
- **Fraud Prevention**: Logic should be added to detect IP spoofing (VPNs) before paying out.

---
**Created by Antigravity**
