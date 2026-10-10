# Finear Full-Stack Next.js Rewrite Plan

**Status:** Approved; implementation is underway.  
**Target:** Rewrite Finear's in-scope frontend and backend together as one full-stack Next.js application, using MySQL for persistence.

## 1. Correct target architecture

The delivered application will be the root-level `finear-next/` Next.js project. It will contain both:

- The TypeScript/React user interface built with Next.js App Router.
- The server-side backend implemented inside that same Next.js project, including API endpoints, authentication, business logic, database access, email, and upload handling.

This is a full-stack rewrite. The existing Express/MongoDB app in `Backend/` will **not** be the runtime backend for the new app and will **not** be modified as part of this rewrite. Its routes, controllers, middleware, and MongoDB models are references for understanding current behavior and fields. Re-implement the required behavior in the Next.js project, adapting it for MySQL and correcting security or consistency defects found during the audit.

The existing Vite app in `Frontend/Finear/` is also a reference only. Keep both old folders unchanged while building and reviewing the replacement. Do not copy the public marketing pages into the new app.

## 2. Scope

### Include: authenticated finance product

Rebuild these areas from the existing app:

- Sign up and login.
- Email verification OTP and resend.
- Forgot password, OTP verification, and set-new-password flow.
- Logout, session handling, and protected dashboard access.
- Dashboard overview: account balances, financial summaries, charts, and recent transactions.
- Income: list, add, edit, and delete.
- Expenses: list, add, edit, and delete.
- Savings: flexible savings, savings goals, contributions, withdrawals, editing, and deleting goals.
- Profile controls required by the app, including profile image and monthly budget settings.
- Transaction export if retained after the behavior audit.
- Loading, validation, success, empty, and recoverable error states.

The reference routes are in `Frontend/Finear/src/routes/AppRoutes.jsx`; auth and dashboard screens are in `Frontend/Finear/src/pages/Auth/` and `Frontend/Finear/src/pages/Dashboard/`.

### Exclude: public marketing website

Do not migrate or recreate Home, About Us, or Contact Us pages, their marketing layouts, routes, or content. This task is for the signed-in finance application and its auth entry/recovery flows only.

## 3. Stack and implementation rules

### One Next.js project for frontend and backend

- Use Next.js App Router and TypeScript for all application code (`.ts` and `.tsx`). No new JavaScript application modules.
- Implement backend endpoints in this Next.js project with Next.js Route Handlers under `app/api/` (or another App Router server mechanism when it has a clear reason). Do not call the old Express API at runtime.
- Keep database access, secrets, mail delivery, auth verification, and financial mutations on the server. Never import server-only modules into client components.
- Use Axios for frontend-to-Next.js API calls. Keep the Axios instance, base URL, credential behavior, and common request setup in a dedicated module under `lib/api/`.
- Put substantial/reused domain workflows in focused server-side service modules under `lib/services/`; examples include authentication, transaction/balance operations, goals, profile, and export. Avoid creating a service for every tiny helper.
- Keep SQL access in a dedicated `lib/db/` layer, with a shared connection/pool and parameterized queries or a selected typed query/ORM tool. Do not construct SQL by concatenating user input.
- Keep reusable domain, API request/response, and database-facing types in separate purposeful files under `lib/types/`. Define only types supported by actual behavior; avoid `any`, redundant declarations, and speculative fields. Treat request data as untrusted and validate it at the server boundary.

### UI libraries and visual requirements

- Reuse Recharts for the current dashboard graph needs; do not add another chart library for the same charts.
- Use `lucide-react` for icons.
- Use shadcn/ui components where they fit, especially dropdowns and calendar/date-picker controls. Keep shared primitives consistent and avoid duplicate custom controls.
- Use a mobile-first responsive approach. Dashboard use is primarily web, but every in-scope page, navigation pattern, chart, dialog, form, and data list must work on small mobile screens.
- Preserve Finear's recognizable dashboard style while rebuilding it in reusable components. Use glass effects on appropriate cards, panels, and overlays, with readable text and controls as the priority.
- Keep spacing, typography, colors, corner radii, borders, shadows, focus states, buttons, and segmented controls consistent across screens. Prefer shared variants and design tokens over per-page one-off styling.
- Use semantic markup, accessible labels, keyboard operation, visible focus states, and touch-friendly controls.

## 4. Target project organization

Use this as a guide, not a requirement to create empty folders in advance. Add files when a feature needs them.

```text
finear-next/
├── app/
│   ├── (auth)/                         # login, signup, verification, recovery
│   ├── (dashboard)/                    # protected finance pages and shared shell
│   ├── api/                            # Next.js Route Handlers (new backend)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                             # shared/shadcn primitives
│   ├── layout/                         # auth/dashboard shells and navigation
│   └── ...                             # reusable finance views and forms
├── lib/
│   ├── api/                            # Axios client for this app's API
│   ├── db/                             # MySQL pool, query helpers, repositories
│   ├── services/                       # server-side domain workflows
│   ├── types/                          # shared domain and API types
│   ├── validation/                     # request schemas and validation
│   └── utils/                           # small shared utilities
├── migrations/                         # versioned MySQL schema/data migrations
└── public/                              # only assets used by auth/dashboard
```

Parenthesized App Router groups organize code without adding URL segments. Confirm exact URLs against the existing auth/dashboard UX before implementation. Do not create a second Express server or preserve old Express API calls in the new app.

## 5. New backend behavior inside Next.js

### Route handlers and services

- Expose the auth, dashboard, transaction, goal, profile, and export operations required by the migrated UI as typed Next.js Route Handlers under `app/api/`.
- Keep route handlers focused on HTTP concerns: parse input, validate it, authenticate/authorize, invoke a service, and return a deliberate status and response shape.
- Keep financial rules and reusable workflows in server-only services. Use a database transaction when one operation changes multiple rows, such as saving a transaction and updating a profile balance.
- Centralize response/error conventions. Do not return SQL details, stack traces, passwords, OTPs, or SMTP configuration to the browser.
- Document endpoint method, path, input, output, and auth requirement as the routes are implemented. Keep frontend API request/response types in `lib/types/` aligned with these contracts.

### Authentication and authorization

- Implement signup, login, logout, email verification/resend, and password recovery in the Next.js backend.
- Hash passwords with a suitable password hashing library. Never store plaintext passwords.
- Use a secure server-managed session or HTTP-only cookie token. The proposed default is to preserve the existing HTTP-only JWT-cookie behavior, after review. Never store auth tokens in local storage.
- Validate session/token on every protected backend operation. UI route protection is only a UX layer and never the authorization boundary.
- Derive `userId` from the verified session on the server. Ignore any client-supplied owner ID.
- Scope every user-owned read, update, and delete by both the record ID and authenticated user ID. A user must not be able to view or mutate another account's profile, transaction, or goal by guessing an identifier.
- Store only a hash of OTP values where practical, enforce expiry and single-use behavior, and invalidate codes after success or replacement.

### Email and uploads

- Use Nodemailer for welcome/verification and password recovery mail where the audited flows require them.
- The owner will provide SMTP values through environment variables. Add only placeholder names to `.env.example`; never commit credentials.
- Store profile image uploads on the server initially, with validation for file type and size. Hide storage behind a small adapter/service so a cloud/object store can replace local disk later.
- Do not store uploaded image binaries in MySQL. Persist a storage key/path and serve files through a controlled route or configured static path.
- Before deployment, confirm the hosting platform's persistence model; local disk can be ephemeral on serverless hosts.

## 6. MySQL schema proposal

Create versioned migrations and use primary/foreign keys, indexes, and `created_at`/`updated_at`. The current Mongoose models in `Backend/userModels/` are source references for the initial data shape, not a requirement to retain MongoDB. Store money in `DECIMAL` with an agreed precision, never floating point. Store timestamps in UTC and format for display as needed.

### `users` (source: `authModel.js`)

- Primary key `id`; `name`; unique `email`; `password_hash`.
- `is_verified`; profile image reference such as `image_path`.
- Verification and password-reset OTP hashes and expiry timestamps, if the audited flows retain OTP verification.
- Creation/update timestamps.

### `profiles` (source: `profileModel.js`)

- Primary key `id`; unique `user_id` foreign key to `users.id`.
- `hand_balance`, `bank_balance`, `flexible_savings`, `monthly_budget` as `DECIMAL`.
- `currency` (current default is `PKR`).
- Creation/update timestamps.

### `transactions` (source: `TransactionModel.js`)

- Primary key `id`; `user_id` foreign key to `users.id`.
- `title`; `amount` as `DECIMAL`; `type` constrained to income/expense/savings; `source` constrained to cash/bank; `category`.
- Creation/update timestamps.
- Indexes for user/date and user/type/date listing and chart queries.

### `goals` (source: `goalsModel.js`)

- Primary key `id`; `user_id` foreign key to `users.id`.
- `goal_name`; `target_amount` and `saved_amount` as `DECIMAL`; priority constrained to high/medium/low; status constrained to active/completed.
- Creation/update timestamps and an index for user/date listing.

Decide foreign-key delete behavior explicitly. Enforce ownership and data consistency in service logic as well as schema constraints. Use a database transaction for related balance/ledger changes. The exact schema, SQL dialect/version, migration/query tooling, and balance rules must be confirmed before implementation.

## 7. API and user-data isolation

- The Next.js app's frontend calls its own `/api/...` Route Handlers through the shared Axios client. Do not configure the new app to call `Backend/` as a separate service.
- All auth/session checks and ownership filtering happen server-side in Next.js handlers/services.
- Validate every body, query, route parameter, enum, amount, and uploaded file. Never trust values because TypeScript types exist; runtime HTTP input has no TypeScript guarantees.
- Return consistent, safe errors and appropriate HTTP status codes. Keep internal errors in server logs without exposing sensitive detail.
- Handle duplicate emails, invalid/expired OTPs, insufficient available funds, invalid enum values, and missing/foreign-owned records deliberately.
- Store SMTP, session/JWT, and database secrets in environment variables. Document variable names in `.env.example` only.
- Since the browser and API are served by the same Next.js app, avoid unnecessary cross-origin/CORS configuration. Configure CORS only if a separate trusted client is later introduced.

## 8. UI and interaction requirements

- Rebuild shared auth/dashboard shells, dashboard navigation, profile menu, summary cards, charts, transaction list, forms, dialogs, dropdowns, segmented controls, and calendar controls as reusable components when reuse is real.
- Preserve existing feature behavior only after auditing it. Do not blindly recreate insecure or incorrect backend behavior; document and resolve discrepancies in financial rules before implementing them.
- Provide loading, empty, success, and recoverable error states for data-backed views.
- On mobile, collapse/adapt navigation, reflow cards and forms, keep charts legible, and prevent horizontal overflow. Do not hide essential transaction or balance information to fit a narrow screen.
- Use a consistent glass treatment (surface opacity, blur, border, shadow) on suitable panels, while maintaining contrast and readable controls.
- Confirm destructive actions and clearly explain any balance/history impact.
- Ensure dropdowns, calendars, dialogs, and forms work with keyboard, screen reader labels, and touch input.

## 9. Suggested implementation phases

1. **Review and approve this plan.** Resolve the decisions in Section 11 before ambiguous implementation begins.
2. **Audit the old product.** Inspect the Vite screens and Express controllers/models. Record UI actions, API behavior, validations, data calculations, and bugs. The old apps are read-only references during this work.
3. **Finalize architecture and contracts.** Confirm Next.js route handlers, session approach, MySQL version/schema/migrations/query layer, endpoint shapes, financial semantics, and upload strategy.
4. **Build the full-stack foundation.** Configure TypeScript, App Router route groups, design tokens/shared UI, MySQL pool/migrations, validation, server-only services, auth/session helpers, Axios client, and API types.
5. **Implement auth vertically.** Deliver signup, OTP verification/resend, login, password recovery, logout, and protected navigation using Next.js UI and Next.js server handlers.
6. **Implement dashboard overview vertically.** Deliver responsive shell/navigation, profile controls, summary data, Recharts visuals, and recent transactions against MySQL-backed Next.js handlers.
7. **Implement finance workflows vertically.** Add income/expense operations, savings/goals, budget/profile actions, image upload, and export, including ownership and transactional balance rules.
8. **Polish mobile/accessibility and errors.** Review every in-scope page at mobile and desktop sizes and verify keyboard/touch interactions and empty/loading/error states.
9. **Verify the replacement and plan cutover.** Run agreed checks and manual flows, document environment/setup/deployment needs, and get explicit owner approval before removing or replacing either old app.

## 10. Completion criteria

The full-stack rewrite is ready for cutover review when:

- All in-scope auth and finance screens run in `finear-next/`; public marketing pages have not been added.
- UI, API route handlers, services, validation, and database access for the new product live in the single Next.js project. The app does not depend on the old Express server at runtime.
- New application code is TypeScript; reusable domain/API types live in purposeful files under `lib/types/`; there are no unjustified `any` types.
- MySQL migrations create the agreed schema and all required flows use it.
- Passwords/OTP/session data are handled securely, and all protected records are isolated by authenticated user on the server.
- Financial operations preserve agreed balance/history rules and related database changes are atomic.
- Nodemailer uses owner-provided environment variables, and image storage is server-side behind a replaceable boundary.
- Recharts, Lucide, shared UI controls, and consistent glass/button/segment styles are used as specified.
- All in-scope pages and workflows are usable at mobile and desktop sizes and include useful loading/empty/error states.
- Setup, environment variable names, migrations, and deployment requirements are documented. The old Vite and Express apps remain unchanged until cutover is explicitly approved.

## 11. Owner-confirmed implementation decisions

1. **Session:** Preserve the HTTP-only JWT cookie design, with a seven-day session. Never store the JWT in local storage.
2. **Database:** Use Prisma ORM with MySQL and version-controlled Prisma migrations. Match the installed/deployment MySQL version.
3. **Currency:** Support PKR only for now and store amounts as fixed-precision decimals.
4. **Savings behavior:** Reproduce the existing savings and goal logic for this rewrite. Keep it centralized because the owner plans to revisit it later.
5. **Profile uploads:** Save images on the server for now. Accept JPG, JPEG, and PNG only, with a 5 MB maximum. Improve persistent/cloud storage later.
6. **Visual design:** Improve usability while preserving Finear identity. Use glass effects prominently, including segmented controls, add hover feedback, and ensure mobile usability.
7. **Checks:** Run ESLint and TypeScript type checks during each phase. Run the production build after the planned testing is complete.

## 12. Read-only reference files

These existing files inform the rewrite; they are not the target runtime implementation:

- Frontend routes: `Frontend/Finear/src/routes/AppRoutes.jsx`.
- Auth screens: `Frontend/Finear/src/pages/Auth/`.
- Dashboard screens: `Frontend/Finear/src/pages/Dashboard/`.
- Shared frontend layouts/components: `Frontend/Finear/src/components/`.
- MongoDB models and field definitions: `Backend/userModels/`.
- Existing endpoint and behavior reference: `Backend/routes/`, `Backend/controllers/`, and `Backend/server.js`.
- Existing email/upload/auth references: `Backend/config/`, `Backend/helper/`, and `Backend/middelWare/`.

Do not edit these reference apps as part of the Next.js rewrite unless the owner separately requests it.
