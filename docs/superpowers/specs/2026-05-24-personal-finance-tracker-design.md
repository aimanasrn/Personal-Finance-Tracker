# Personal Finance Tracker Design Spec

**Date:** 2026-05-24

## Product Summary

This product is a beginner-friendly web-based personal finance tracker for users who want something simpler than spreadsheets but more structured than notes. The app should feel local-friendly, mobile responsive, clean, and easy to use while still being built on a SaaS-ready foundation.

The first release focuses on the core money-tracking loop:
- sign up and log in
- add, edit, and delete income and expense transactions
- view totals and monthly summaries
- get simple category suggestions
- export monthly reports

The product should avoid accounting-heavy workflows and instead help users build confidence through fast entry, plain language, and clear monthly visibility.

## Target Users

Primary users:
- young working adults tracking salary and daily spending
- students or fresh graduates managing limited budgets
- side hustlers who want simple income and expense visibility
- users who dislike spreadsheets but still want structure and reports

Secondary future users:
- households that may later want shared finance views
- users who eventually want debt, savings, or AI-guided planning features

## Problems Solved

The MVP solves these main problems:
- financial records are scattered across notes, memory, banking apps, or Excel
- users do not know their real monthly balance
- manual categorization is inconsistent and annoying
- monthly review is too weak to reveal bad spending habits
- many finance tools feel too complex or too enterprise-like for beginners

## Product Scope

### MVP Features

- signup, login, and logout
- protected private finance pages
- add income transactions
- add expense transactions
- edit and delete transactions
- filter transactions by date, category, and type
- dashboard totals for income, expenses, and balance
- automatic category suggestion from transaction title keywords
- monthly report with charts and top spending categories
- exportable monthly report
- responsive UI that works well on mobile and desktop

### Not in MVP

These are intentionally planned for later phases and should not be built into the first release:
- debt tracker
- savings goals
- AI spending analysis
- recurring bills and reminders
- bank sync
- multi-currency
- shared or family accounts

## Product Positioning

The product should sit between a spreadsheet and a full finance suite. It should feel approachable, encouraging, and modern. Users should be able to log a transaction in seconds, understand their monthly state at a glance, and correct mistakes without friction.

Possible product names:
- CashNest
- FlowLedger
- Pennyboard
- TrackMint
- SpendBloom
- PocketPattern

Recommended naming direction:
- `CashNest` for a friendly, approachable brand
- `FlowLedger` for a cleaner, more product-oriented brand

## Platform and Technical Direction

The application should use a single Next.js codebase with the App Router. The frontend, server components, route handlers, and authenticated data access should live in one project to keep the MVP simple and cohesive.

Selected platform decisions:
- balanced responsive web app
- full authentication from day one
- Next.js full-stack architecture
- Supabase Postgres as the database platform

Primary stack:
- frontend: Next.js with React
- styling: Tailwind CSS
- backend: Next.js route handlers and server-side logic
- database: Supabase Postgres
- charts: Recharts
- authentication: full signup and login flow from day one

## Architecture Overview

The MVP should be split into the following clear responsibility areas:

### 1. Auth

Responsible for:
- signup
- login
- logout
- session management
- protected routes

### 2. Transactions

Responsible for:
- creating transactions
- editing transactions
- deleting transactions
- filtering by date, category, and type
- returning recent transaction lists

### 3. Reports

Responsible for:
- monthly income totals
- monthly expense totals
- monthly net balance
- spending by category
- top spending categories
- export support

### 4. Categories

Responsible for:
- default category definitions
- user custom categories later if needed
- keyword-based category suggestions
- category override behavior

### 5. UI Shell

Responsible for:
- responsive app layout
- navigation
- dashboard summary cards
- shared form patterns
- loading and empty states

## Data Boundaries

The most important boundary is user isolation. Every transaction, category rule, and query must be scoped to the authenticated user. No user should be able to access another user's records through URLs, filters, exports, or API requests.

Auto-categorization must be suggestion-based rather than mandatory. The app can suggest a category from the transaction title, but the user must always be able to change it before saving.

Monthly reporting data should be derived from transactions rather than stored permanently in the MVP. This keeps the first release simpler and avoids synchronization issues between stored summaries and source data.

## Database Schema

The MVP schema should stay compact and relational while leaving room for future modules.

### Core Tables

- `users`
- `profiles`
- `categories`
- `transactions`
- `category_rules`

### users

Managed by the authentication layer. The app should not store raw passwords in custom tables.

Expected fields handled by auth layer:
- `id`
- `email`
- `password_hash` or provider-managed equivalent
- auth timestamps and metadata

### profiles

Purpose: user-facing preferences and profile data separate from auth identity.

Fields:
- `id`
- `user_id`
- `display_name`
- `preferred_currency`
- `created_at`
- `updated_at`

### categories

Purpose: support system defaults and future user-defined categories.

Fields:
- `id`
- `user_id` nullable for system defaults
- `name`
- `type` enum: `income` or `expense`
- `color`
- `icon`
- `is_default`
- `created_at`

### transactions

Purpose: store all tracked financial events for the user.

Fields:
- `id`
- `user_id`
- `title`
- `amount`
- `type` enum: `income` or `expense`
- `category_id`
- `transaction_date`
- `notes` nullable
- `created_at`
- `updated_at`

### category_rules

Purpose: deterministic auto-category suggestions based on title keywords.

Fields:
- `id`
- `user_id`
- `keyword`
- `suggested_category_id`
- `priority`
- `created_at`

## Category Suggestion Model

The first release should use a deterministic keyword engine instead of AI. That gives predictable results, easier testing, and faster implementation.

Suggested logic:
1. Normalize the transaction title to lowercase.
2. Compare against known keywords such as `grab`, `mamak`, `salary`, and `shopee`.
3. Return the highest-priority matching category rule.
4. Pre-fill the category field with that suggestion.
5. Allow the user to override the suggestion before saving.

Example mappings:
- `Grab` -> `Transport`
- `Mamak` -> `Food`
- `Salary` -> `Income`
- `Shopee` -> `Shopping`

Future enhancement options:
- learn from user corrections
- fuzzy matching
- merchant alias libraries
- AI-enhanced classification

## Reporting Model

Monthly reports should be generated live from transaction data.

Each monthly report should compute:
- total income for the selected month
- total expenses for the selected month
- monthly net balance
- spending grouped by category
- top spending categories
- month-over-month comparison when prior data exists

### Export Model

The MVP export strategy should start simple:
- CSV export for transactions in the selected month
- print-friendly report layout for browser printing

PDF generation can be added later if needed, but it should not be required for v1.

## Page Structure

Core routes:
- `/` landing page
- `/login`
- `/signup`
- `/dashboard`
- `/transactions`
- `/transactions/new`
- `/transactions/[id]/edit`
- `/reports`
- `/settings`

### Landing Page

Purpose:
- explain the product value
- show a few app highlights
- drive signup and login

### Dashboard

Purpose:
- serve as the home base after login
- show income, expenses, and balance
- highlight recent transactions
- provide quick access to add a new transaction
- surface a monthly snapshot

### Transactions

Purpose:
- show the full transaction list
- support filters by date, category, and type
- support edit and delete actions

### Reports

Purpose:
- show monthly charts
- show top spending categories
- show monthly balance and summary
- allow export

### Settings

Purpose:
- manage profile details
- manage currency preference
- leave room for future category preferences

## Navigation Design

Desktop:
- top app bar
- left sidebar for Dashboard, Transactions, Reports, and Settings

Mobile:
- compact top bar
- bottom navigation for Dashboard, Transactions, Reports, and Settings
- easy-to-reach primary action for adding a transaction

## User Flow

First-run journey:
1. User lands on the homepage.
2. User signs up.
3. User arrives on an empty dashboard.
4. App encourages the first transaction entry.
5. User adds income and several expenses.
6. Dashboard updates totals and balance immediately.
7. User reviews and filters records on the Transactions page.
8. User opens Reports at month end to review charts and export a summary.

Primary ongoing loop:
1. Sign in
2. Add transactions quickly
3. Review balance on dashboard
4. Filter and correct transactions
5. Review monthly report
6. Export when needed

## UI and UX Direction

The interface should feel calm, trustworthy, and clear rather than corporate or accounting-heavy.

### Design Principles

- fast transaction entry
- immediate balance visibility
- low-friction editing
- understandable filters
- confidence-building language
- strong empty states and validation feedback

### Visual Style

Recommended direction:
- soft neutral base
- one confident accent color
- rounded cards and form controls
- spacious layout
- subtle, supportive chart styling

Suggested palette approach:
- background: warm off-white or light gray
- text: deep slate
- accent: teal, emerald, or blue-green
- income indicators: green
- expense indicators: coral or red-orange

### Content Tone

The app should prefer plain language over finance jargon. Labels like `Money In`, `Money Out`, and `Balance` may test better than more formal accounting terms.

### Responsive Behavior

On mobile:
- dashboard cards stack vertically
- transaction entry opens in a focused page or sheet
- filters collapse into a simplified control area
- navigation remains persistent and thumb-friendly

On desktop:
- dashboard uses a multi-column layout
- filters can stay visible inline
- charts and category breakdowns can sit side by side

### Avoid

- spreadsheet-like clutter
- dense enterprise dashboards
- overly playful visuals that reduce trust
- banking-app heaviness

## Security Considerations

The MVP must include:
- protected authenticated routes
- strict per-user data scoping
- server-side validation for all inputs
- safe password handling through the auth platform
- environment variable protection
- export actions limited to the current user's data
- audit-friendly timestamps on records
- rate limiting for auth endpoints
- session and CSRF protections appropriate to the auth implementation

Future hardening:
- row-level security in Supabase
- email verification
- password reset
- suspicious login detection
- analytics that avoid exposing sensitive financial details

## Suggested Folder Structure

```text
src/
  app/
    (marketing)/
      page.tsx
    (auth)/
      login/page.tsx
      signup/page.tsx
    (dashboard)/
      dashboard/page.tsx
      transactions/page.tsx
      transactions/new/page.tsx
      transactions/[id]/edit/page.tsx
      reports/page.tsx
      settings/page.tsx
    api/
  components/
    ui/
    layout/
    charts/
    forms/
  features/
    auth/
    transactions/
    reports/
    categories/
    settings/
  lib/
    auth/
    db/
    validation/
    utils/
  server/
    actions/
    queries/
  types/
```

## Monetization Ideas

Primary long-term monetization options:
- free plus Pro subscription
- annual Pro plan
- early adopter lifetime offer
- future family or shared-account plan
- future AI insights add-on

### Pricing Direction

Example structure:
- `Free`: basic tracking and simple reports
- `Pro`: unlimited transactions, exports, and richer reporting
- `Pro + AI`: advanced AI summaries and financial insights later

Example pricing range:
- `Pro`: USD 4 to USD 8 per month
- `Pro annual`: USD 39 to USD 69 per year
- `Lifetime early adopter`: USD 79 to USD 129 one-time

## Future SaaS Potential

The architecture should intentionally leave room for:
- debt tracking
- savings goals
- recurring bills
- budget planning
- AI monthly summaries
- overspending alerts
- shared household accounts
- receipt upload and OCR
- multi-currency support
- mobile app packaging or native apps later
- bank import integrations

## Development Roadmap

### Phase 1: Foundation

- initialize Next.js with App Router and Tailwind
- configure Supabase and environment variables
- set up auth, protected routes, and shared layout
- define schema and seed default categories

### Phase 2: Core Transactions

- build add, edit, and delete transaction flows
- build filters for date, category, and type
- build deterministic category suggestions
- compute totals for dashboard summaries

### Phase 3: Dashboard and Reports

- build dashboard summary cards
- show recent transactions
- build monthly report charts with Recharts
- show top spending categories and monthly balance
- add CSV export and print-friendly reporting

### Phase 4: UX Polish

- improve validation, loading, and empty states
- optimize forms and navigation for mobile
- refine settings and profile management

### Phase 5: SaaS Readiness

- strengthen security and row-level protections
- add monitoring and analytics
- prepare billing boundaries for future Pro plans

## Step-by-Step Development Plan

1. Create the Next.js project with Tailwind and configure the App Router structure.
2. Connect Supabase and define required environment variables.
3. Implement authentication and route protection.
4. Create the database schema for profiles, categories, transactions, and category rules.
5. Seed default categories and starter keyword mappings.
6. Build the shared app shell and responsive navigation.
7. Build the transaction creation flow.
8. Add automatic category suggestion behavior.
9. Build transaction list filtering, editing, and deletion.
10. Build dashboard summaries and recent activity.
11. Build the monthly reports page with charts.
12. Add CSV export and print-friendly report output.
13. Polish UX states, validation, and mobile behavior.
14. Add rate limiting, security hardening, and monitoring hooks.
15. Plan follow-up releases for debt tracking, savings goals, and AI insights.

## Open Extension Points

The MVP should be designed so future tables and modules can be added without rewriting the core architecture. Likely future table families:
- `debts`
- `debt_payments`
- `savings_goals`
- `savings_contributions`
- `ai_insights`
- `households`
- `household_members`

These should remain out of scope for implementation until the MVP core is stable.
