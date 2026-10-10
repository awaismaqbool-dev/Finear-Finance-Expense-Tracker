# Finear full-stack app

This is the replacement full-stack application. Its interface and server API both run in this Next.js project. The old Vite app (`../Frontend/Finear`) and Express/MongoDB app (`../Backend`) are read-only references during migration and are not runtime dependencies.

## Requirements

- Node.js 20.9 or newer.
- MySQL database and credentials.
- SMTP credentials for production email verification and password reset.

## Local setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL`, MySQL connection fields, and a random `JWT_SECRET` with at least 32 characters.
2. Run `npm install`.
3. Generate the Prisma client and apply the checked-in schema migration:

   ```bash
   npm run prisma:generate
   npm run db:migrate
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

Open http://localhost:3000. In development, when SMTP is not configured, the OTP is returned to the UI as a development-only code. Production requires SMTP configuration.

## Checks

Run `npm run lint` and `npm run typecheck` during implementation. Run `npm run build` after the planned testing phase.

## Current API

- `/api/auth/*` — signup, login, logout, current user, verification, and password recovery.
- `/api/dashboard` — authenticated finance overview; `/api/dashboard/budget` — monthly budget.
- `/api/transactions` — authenticated transaction list/create/update/delete.
- `/api/goals` and `/api/goals/[goalId]` — savings goals; `/api/goals/contribute` — goal contributions.
- `/api/savings/withdraw` — transfer flexible savings back to cash/bank.
- `/api/profile/image` — 5 MB JPG/JPEG/PNG upload to `public/uploads`.
- `/api/export` — authenticated Excel workbook download.

Every finance query is scoped by the signed-in user on the server. Amounts are stored as MySQL decimals and displayed in PKR.
