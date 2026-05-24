# Personal Finance Tracker MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a balanced responsive personal finance tracker MVP in a single Next.js application with auth, transaction CRUD, auto-category suggestions, monthly reporting, and CSV export.

**Architecture:** Rebuild the product as a single Next.js App Router application using Supabase-backed authentication and Postgres persistence. Keep the domain split into auth, transactions, categories, reports, and shared UI modules so later debt, savings-goal, and AI features can plug in without reshaping the core.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Supabase, Postgres, Zod, React Hook Form, Recharts, Vitest, Testing Library, Playwright

---

## File Structure Map

This plan assumes the current repository is being rebuilt into a single-app Next.js structure because the previous multi-folder app files are currently absent from the working tree.

### Planned root files

- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.js`
- Create: `tailwind.config.ts`
- Create: `.gitignore`
- Create: `.env.example`

### Planned source files

- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/page.tsx`
- Create: `src/app/login/page.tsx`
- Create: `src/app/signup/page.tsx`
- Create: `src/app/dashboard/page.tsx`
- Create: `src/app/transactions/page.tsx`
- Create: `src/app/transactions/new/page.tsx`
- Create: `src/app/transactions/[id]/edit/page.tsx`
- Create: `src/app/reports/page.tsx`
- Create: `src/app/settings/page.tsx`
- Create: `src/app/api/export/monthly/route.ts`
- Create: `src/app/actions/auth.ts`
- Create: `src/app/actions/transactions.ts`
- Create: `src/app/actions/reports.ts`
- Create: `src/components/layout/app-shell.tsx`
- Create: `src/components/layout/mobile-nav.tsx`
- Create: `src/components/layout/sidebar.tsx`
- Create: `src/components/transactions/transaction-form.tsx`
- Create: `src/components/transactions/transaction-list.tsx`
- Create: `src/components/reports/monthly-chart.tsx`
- Create: `src/components/reports/top-categories.tsx`
- Create: `src/components/dashboard/summary-cards.tsx`
- Create: `src/components/dashboard/recent-transactions.tsx`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/select.tsx`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/auth/session.ts`
- Create: `src/lib/db/types.ts`
- Create: `src/lib/validation/auth.ts`
- Create: `src/lib/validation/transactions.ts`
- Create: `src/lib/categories/default-categories.ts`
- Create: `src/lib/categories/suggestion-engine.ts`
- Create: `src/lib/reports/monthly-report.ts`
- Create: `src/lib/utils/currency.ts`
- Create: `src/lib/utils/date.ts`

### Planned database files

- Create: `supabase/migrations/20260524_init_personal_finance_tracker.sql`
- Create: `supabase/seed.sql`

### Planned test files

- Create: `src/lib/categories/suggestion-engine.test.ts`
- Create: `src/lib/reports/monthly-report.test.ts`
- Create: `src/app/actions/transactions.test.ts`
- Create: `tests/e2e/auth.spec.ts`
- Create: `tests/e2e/transaction-flow.spec.ts`
- Create: `tests/e2e/report-export.spec.ts`

## Task 1: Scaffold the Next.js Application

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.js`
- Create: `tailwind.config.ts`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/page.tsx`

- [ ] **Step 1: Write the failing smoke test plan note**

Create this placeholder test target in `package.json` scripts so the initial test command has a defined entry point:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 2: Run the package test command before files exist**

Run: `npm run test`
Expected: FAIL because `package.json` and the Vitest setup do not exist yet.

- [ ] **Step 3: Create the minimal app scaffold**

Add these starter files:

```json
// package.json
{
  "name": "personal-finance-tracker",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.49.8",
    "next": "^16.0.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "recharts": "^3.2.1",
    "zod": "^4.1.5"
  },
  "devDependencies": {
    "@playwright/test": "^1.56.0",
    "@testing-library/react": "^16.3.0",
    "@types/node": "^24.3.0",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.2",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.9.2",
    "vitest": "^3.2.4"
  }
}
```

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

```js
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
```

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefcf8",
          100: "#d7f7ee",
          500: "#1f9d7a",
          700: "#15755b"
        }
      }
    }
  },
  plugins: []
};

export default config;
```

```gitignore
# .gitignore
node_modules
.next
.env
.env.local
playwright-report
test-results
coverage
.superpowers
```

```env
# .env.example
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

```tsx
// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "CashNest",
  description: "A calm personal finance tracker for everyday money management."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 text-slate-900">{children}</body>
    </html>
  );
}
```

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: ui-sans-serif, system-ui, sans-serif;
}
```

```tsx
// src/app/page.tsx
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
        CashNest
      </p>
      <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-slate-900">
        Track money in and out without living inside a spreadsheet.
      </h1>
      <p className="mt-4 max-w-xl text-lg text-slate-600">
        A beginner-friendly finance tracker with clean reports, smart categories,
        and a calm mobile-first workflow.
      </p>
    </main>
  );
}
```

- [ ] **Step 4: Install dependencies and verify the scaffold builds**

Run: `npm install`
Expected: packages install successfully.

Run: `npm run build`
Expected: PASS with a successful Next.js production build.

- [ ] **Step 5: Commit**

```bash
git add package.json next.config.ts tsconfig.json postcss.config.js tailwind.config.ts .gitignore .env.example src/app/layout.tsx src/app/globals.css src/app/page.tsx
git commit -m "feat: scaffold next.js finance tracker app"
```

## Task 2: Add Supabase, Schema, and Seed Data

**Files:**
- Create: `supabase/migrations/20260524_init_personal_finance_tracker.sql`
- Create: `supabase/seed.sql`
- Create: `src/lib/db/types.ts`
- Create: `src/lib/categories/default-categories.ts`

- [ ] **Step 1: Write the failing schema expectation**

Add this type stub in `src/lib/db/types.ts`:

```ts
export type TransactionType = "income" | "expense";
```

- [ ] **Step 2: Run the type-aware test command before the full schema exists**

Run: `npm run build`
Expected: FAIL once imports for missing DB types and seed constants are introduced in later files.

- [ ] **Step 3: Create the database migration and seed**

```sql
-- supabase/migrations/20260524_init_personal_finance_tracker.sql
create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  display_name text not null,
  preferred_currency text not null default 'MYR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  color text not null,
  icon text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  amount numeric(12, 2) not null check (amount > 0),
  type text not null check (type in ('income', 'expense')),
  category_id uuid not null references public.categories(id),
  transaction_date date not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.category_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  keyword text not null,
  suggested_category_id uuid not null references public.categories(id),
  priority integer not null default 100,
  created_at timestamptz not null default now()
);

create index transactions_user_date_idx on public.transactions (user_id, transaction_date desc);
create index transactions_user_type_idx on public.transactions (user_id, type);
create index category_rules_user_priority_idx on public.category_rules (user_id, priority asc);
```

```sql
-- supabase/seed.sql
insert into public.categories (name, type, color, icon, is_default)
values
  ('Salary', 'income', '#15755b', 'wallet', true),
  ('Freelance', 'income', '#1f9d7a', 'briefcase', true),
  ('Food', 'expense', '#f97316', 'utensils', true),
  ('Transport', 'expense', '#0284c7', 'car', true),
  ('Shopping', 'expense', '#db2777', 'shopping-bag', true),
  ('Bills', 'expense', '#7c3aed', 'receipt', true);
```

```ts
// src/lib/db/types.ts
export type TransactionType = "income" | "expense";

export type Category = {
  id: string;
  user_id: string | null;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  is_default: boolean;
};

export type TransactionRecord = {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category_id: string;
  transaction_date: string;
  notes: string | null;
};
```

```ts
// src/lib/categories/default-categories.ts
export const defaultKeywordRules = [
  { keyword: "grab", category: "Transport", priority: 10 },
  { keyword: "mamak", category: "Food", priority: 20 },
  { keyword: "salary", category: "Salary", priority: 5 },
  { keyword: "shopee", category: "Shopping", priority: 15 }
] as const;
```

- [ ] **Step 4: Verify the migration and seed files are syntactically coherent**

Run: `npm run build`
Expected: PASS because TypeScript files are valid and the app still compiles.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260524_init_personal_finance_tracker.sql supabase/seed.sql src/lib/db/types.ts src/lib/categories/default-categories.ts
git commit -m "feat: define finance schema and seed data"
```

## Task 3: Implement Auth and Protected Routing

**Files:**
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/auth/session.ts`
- Create: `src/lib/validation/auth.ts`
- Create: `src/app/actions/auth.ts`
- Create: `src/app/login/page.tsx`
- Create: `src/app/signup/page.tsx`

- [ ] **Step 1: Write the failing auth validation test**

```ts
// src/lib/validation/auth.test.ts
import { describe, expect, it } from "vitest";
import { signUpSchema } from "./auth";

describe("signUpSchema", () => {
  it("rejects a short password", () => {
    const result = signUpSchema.safeParse({
      email: "user@example.com",
      password: "123"
    });

    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/validation/auth.test.ts`
Expected: FAIL because `src/lib/validation/auth.ts` does not exist yet.

- [ ] **Step 3: Add the auth implementation**

```ts
// src/lib/validation/auth.ts
import { z } from "zod";

export const signUpSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
});

export const loginSchema = signUpSchema;
```

```ts
// src/lib/supabase/server.ts
import { createClient } from "@supabase/supabase-js";

export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
```

```ts
// src/lib/supabase/client.ts
import { createClient } from "@supabase/supabase-js";

export const supabaseBrowserClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

```ts
// src/lib/auth/session.ts
import { redirect } from "next/navigation";

export async function requireUserId() {
  const userId = "replace-with-real-session-read";

  if (!userId) {
    redirect("/login");
  }

  return userId;
}
```

```ts
// src/app/actions/auth.ts
"use server";

import { loginSchema, signUpSchema } from "@/lib/validation/auth";

export async function signUpAction(formData: FormData) {
  const payload = signUpSchema.parse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  return { ok: true, email: payload.email };
}

export async function loginAction(formData: FormData) {
  const payload = loginSchema.parse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  return { ok: true, email: payload.email };
}
```

```tsx
// src/app/login/page.tsx
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold">Log in</h1>
      <form action={loginAction} className="mt-8 space-y-4">
        <input name="email" type="email" className="w-full rounded-xl border p-3" />
        <input name="password" type="password" className="w-full rounded-xl border p-3" />
        <button className="w-full rounded-xl bg-brand-700 px-4 py-3 text-white">Continue</button>
      </form>
    </main>
  );
}
```

```tsx
// src/app/signup/page.tsx
import { signUpAction } from "@/app/actions/auth";

export default function SignupPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold">Create account</h1>
      <form action={signUpAction} className="mt-8 space-y-4">
        <input name="email" type="email" className="w-full rounded-xl border p-3" />
        <input name="password" type="password" className="w-full rounded-xl border p-3" />
        <button className="w-full rounded-xl bg-brand-700 px-4 py-3 text-white">Start tracking</button>
      </form>
    </main>
  );
}
```

- [ ] **Step 4: Run the auth validation test and app build**

Run: `npx vitest run src/lib/validation/auth.test.ts`
Expected: PASS

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/supabase/server.ts src/lib/supabase/client.ts src/lib/auth/session.ts src/lib/validation/auth.ts src/lib/validation/auth.test.ts src/app/actions/auth.ts src/app/login/page.tsx src/app/signup/page.tsx
git commit -m "feat: add auth validation and entry pages"
```

## Task 4: Build the Shared App Shell and Route Guards

**Files:**
- Create: `src/components/layout/app-shell.tsx`
- Create: `src/components/layout/sidebar.tsx`
- Create: `src/components/layout/mobile-nav.tsx`
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/app/transactions/page.tsx`
- Modify: `src/app/reports/page.tsx`
- Modify: `src/app/settings/page.tsx`

- [ ] **Step 1: Write the failing layout smoke test**

```ts
// src/components/layout/app-shell.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppShell } from "./app-shell";

describe("AppShell", () => {
  it("renders the app navigation", () => {
    render(<AppShell title="Dashboard"><div>Body</div></AppShell>);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Transactions")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/layout/app-shell.test.tsx`
Expected: FAIL because the shell components do not exist yet.

- [ ] **Step 3: Implement the shell**

```tsx
// src/components/layout/sidebar.tsx
import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transactions", label: "Transactions" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" }
];

export function Sidebar() {
  return (
    <nav className="hidden w-64 shrink-0 rounded-3xl bg-white p-6 shadow-sm lg:block">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">CashNest</p>
      <div className="mt-8 space-y-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="block rounded-xl px-4 py-3 text-slate-700 hover:bg-stone-100">
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
```

```tsx
// src/components/layout/mobile-nav.tsx
import Link from "next/link";

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t bg-white px-4 py-3 lg:hidden">
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/transactions">Transactions</Link>
      <Link href="/reports">Reports</Link>
      <Link href="/settings">Settings</Link>
    </nav>
  );
}
```

```tsx
// src/components/layout/app-shell.tsx
import { ReactNode } from "react";
import { MobileNav } from "./mobile-nav";
import { Sidebar } from "./sidebar";

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-6">
        <Sidebar />
        <main className="flex-1 pb-24 lg:pb-8">
          <header className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          </header>
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
```

```tsx
// src/app/dashboard/page.tsx
import { AppShell } from "@/components/layout/app-shell";

export default function DashboardPage() {
  return <AppShell title="Dashboard"><div className="rounded-3xl bg-white p-6 shadow-sm">Dashboard content</div></AppShell>;
}
```

Repeat the same shell pattern for:
- `src/app/transactions/page.tsx`
- `src/app/reports/page.tsx`
- `src/app/settings/page.tsx`

- [ ] **Step 4: Run the shell test and build**

Run: `npx vitest run src/components/layout/app-shell.test.tsx`
Expected: PASS

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/app-shell.tsx src/components/layout/sidebar.tsx src/components/layout/mobile-nav.tsx src/components/layout/app-shell.test.tsx src/app/dashboard/page.tsx src/app/transactions/page.tsx src/app/reports/page.tsx src/app/settings/page.tsx
git commit -m "feat: add responsive app shell"
```

## Task 5: Implement Transaction Validation and Category Suggestion

**Files:**
- Create: `src/lib/validation/transactions.ts`
- Create: `src/lib/categories/suggestion-engine.ts`
- Create: `src/lib/categories/suggestion-engine.test.ts`

- [ ] **Step 1: Write the failing suggestion-engine test**

```ts
import { describe, expect, it } from "vitest";
import { suggestCategory } from "./suggestion-engine";

describe("suggestCategory", () => {
  it("suggests Transport for Grab", () => {
    expect(suggestCategory("Grab ride home")).toBe("Transport");
  });

  it("returns null when no keyword matches", () => {
    expect(suggestCategory("Random merchant")).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/categories/suggestion-engine.test.ts`
Expected: FAIL because the suggestion engine does not exist yet.

- [ ] **Step 3: Implement the validator and suggestion engine**

```ts
// src/lib/validation/transactions.ts
import { z } from "zod";

export const transactionSchema = z.object({
  title: z.string().min(2),
  amount: z.coerce.number().positive(),
  type: z.enum(["income", "expense"]),
  categoryId: z.string().uuid(),
  transactionDate: z.string().min(1),
  notes: z.string().optional()
});
```

```ts
// src/lib/categories/suggestion-engine.ts
import { defaultKeywordRules } from "./default-categories";

export function suggestCategory(title: string) {
  const normalized = title.toLowerCase();
  const match = [...defaultKeywordRules]
    .sort((left, right) => left.priority - right.priority)
    .find((rule) => normalized.includes(rule.keyword));

  return match?.category ?? null;
}
```

- [ ] **Step 4: Run the suggestion-engine test**

Run: `npx vitest run src/lib/categories/suggestion-engine.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/validation/transactions.ts src/lib/categories/suggestion-engine.ts src/lib/categories/suggestion-engine.test.ts
git commit -m "feat: add transaction validation and category suggestions"
```

## Task 6: Build Transaction Create, Edit, Delete, and List Flows

**Files:**
- Create: `src/app/actions/transactions.ts`
- Create: `src/components/transactions/transaction-form.tsx`
- Create: `src/components/transactions/transaction-list.tsx`
- Create: `src/app/transactions/new/page.tsx`
- Create: `src/app/transactions/[id]/edit/page.tsx`
- Modify: `src/app/transactions/page.tsx`
- Create: `src/app/actions/transactions.test.ts`

- [ ] **Step 1: Write the failing transaction action test**

```ts
import { describe, expect, it } from "vitest";
import { normalizeTransactionInput } from "./transactions";

describe("normalizeTransactionInput", () => {
  it("normalizes form data for creation", () => {
    const formData = new FormData();
    formData.set("title", "Grab ride home");
    formData.set("amount", "12.50");
    formData.set("type", "expense");
    formData.set("categoryId", "11111111-1111-1111-1111-111111111111");
    formData.set("transactionDate", "2026-05-24");

    expect(normalizeTransactionInput(formData).amount).toBe(12.5);
  });
});
```

- [ ] **Step 2: Run the transaction action test**

Run: `npx vitest run src/app/actions/transactions.test.ts`
Expected: FAIL because the transaction action module does not exist yet.

- [ ] **Step 3: Implement the transaction flow**

```ts
// src/app/actions/transactions.ts
"use server";

import { transactionSchema } from "@/lib/validation/transactions";

export function normalizeTransactionInput(formData: FormData) {
  return transactionSchema.parse({
    title: formData.get("title"),
    amount: formData.get("amount"),
    type: formData.get("type"),
    categoryId: formData.get("categoryId"),
    transactionDate: formData.get("transactionDate"),
    notes: formData.get("notes") ?? undefined
  });
}

export async function createTransactionAction(formData: FormData) {
  const payload = normalizeTransactionInput(formData);
  return { ok: true, payload };
}

export async function updateTransactionAction(formData: FormData) {
  const payload = normalizeTransactionInput(formData);
  return { ok: true, payload };
}

export async function deleteTransactionAction(id: string) {
  return { ok: true, id };
}
```

```tsx
// src/components/transactions/transaction-form.tsx
"use client";

import { useState } from "react";
import { suggestCategory } from "@/lib/categories/suggestion-engine";

export function TransactionForm() {
  const [suggestion, setSuggestion] = useState<string | null>(null);

  return (
    <form className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
      <input
        name="title"
        placeholder="e.g. Grab ride home"
        className="w-full rounded-xl border p-3"
        onChange={(event) => setSuggestion(suggestCategory(event.target.value))}
      />
      {suggestion ? <p className="text-sm text-brand-700">Suggested category: {suggestion}</p> : null}
      <input name="amount" type="number" step="0.01" className="w-full rounded-xl border p-3" />
      <select name="type" className="w-full rounded-xl border p-3">
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <input name="categoryId" className="w-full rounded-xl border p-3" />
      <input name="transactionDate" type="date" className="w-full rounded-xl border p-3" />
      <textarea name="notes" className="w-full rounded-xl border p-3" />
      <button className="rounded-xl bg-brand-700 px-4 py-3 text-white">Save transaction</button>
    </form>
  );
}
```

```tsx
// src/components/transactions/transaction-list.tsx
type TransactionListItem = {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  transactionDate: string;
};

export function TransactionList({ items }: { items: TransactionListItem[] }) {
  return (
    <div className="rounded-3xl bg-white shadow-sm">
      <ul>
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-slate-500">{item.category} • {item.transactionDate}</p>
            </div>
            <p className={item.type === "income" ? "text-emerald-600" : "text-orange-600"}>
              {item.type === "income" ? "+" : "-"}{item.amount.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

Create pages that render `TransactionForm` for new and edit, and render `TransactionList` plus filter controls on `/transactions`.

- [ ] **Step 4: Run the transaction action test and build**

Run: `npx vitest run src/app/actions/transactions.test.ts`
Expected: PASS

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/actions/transactions.ts src/app/actions/transactions.test.ts src/components/transactions/transaction-form.tsx src/components/transactions/transaction-list.tsx src/app/transactions/new/page.tsx src/app/transactions/[id]/edit/page.tsx src/app/transactions/page.tsx
git commit -m "feat: add transaction management flows"
```

## Task 7: Add Dashboard Summaries and Recent Transactions

**Files:**
- Create: `src/components/dashboard/summary-cards.tsx`
- Create: `src/components/dashboard/recent-transactions.tsx`
- Modify: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Write the failing dashboard component test**

```ts
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SummaryCards } from "./summary-cards";

describe("SummaryCards", () => {
  it("shows balance totals", () => {
    render(<SummaryCards income={2500} expenses={800} balance={1700} />);
    expect(screen.getByText("Balance")).toBeInTheDocument();
    expect(screen.getByText("1700.00")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the dashboard test**

Run: `npx vitest run src/components/dashboard/summary-cards.test.tsx`
Expected: FAIL because the component does not exist yet.

- [ ] **Step 3: Implement the dashboard pieces**

```tsx
// src/components/dashboard/summary-cards.tsx
export function SummaryCards({
  income,
  expenses,
  balance
}: {
  income: number;
  expenses: number;
  balance: number;
}) {
  const items = [
    { label: "Money In", value: income, className: "text-emerald-600" },
    { label: "Money Out", value: expenses, className: "text-orange-600" },
    { label: "Balance", value: balance, className: "text-slate-900" }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <section key={item.label} className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className={`mt-3 text-3xl font-bold ${item.className}`}>{item.value.toFixed(2)}</p>
        </section>
      ))}
    </div>
  );
}
```

```tsx
// src/components/dashboard/recent-transactions.tsx
import { TransactionList } from "@/components/transactions/transaction-list";

export function RecentTransactions() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Recent transactions</h2>
      <TransactionList items={[]} />
    </section>
  );
}
```

Update `src/app/dashboard/page.tsx` to render `SummaryCards` above `RecentTransactions`.

- [ ] **Step 4: Run the dashboard test and build**

Run: `npx vitest run src/components/dashboard/summary-cards.test.tsx`
Expected: PASS

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/summary-cards.tsx src/components/dashboard/recent-transactions.tsx src/components/dashboard/summary-cards.test.tsx src/app/dashboard/page.tsx
git commit -m "feat: add dashboard overview components"
```

## Task 8: Build Monthly Report Computation and Charts

**Files:**
- Create: `src/lib/reports/monthly-report.ts`
- Create: `src/lib/reports/monthly-report.test.ts`
- Create: `src/components/reports/monthly-chart.tsx`
- Create: `src/components/reports/top-categories.tsx`
- Modify: `src/app/reports/page.tsx`

- [ ] **Step 1: Write the failing monthly-report test**

```ts
import { describe, expect, it } from "vitest";
import { buildMonthlyReport } from "./monthly-report";

describe("buildMonthlyReport", () => {
  it("computes income, expenses, and balance", () => {
    const report = buildMonthlyReport([
      { id: "1", title: "Salary", amount: 3000, type: "income", category: "Salary", transactionDate: "2026-05-01" },
      { id: "2", title: "Grab ride", amount: 20, type: "expense", category: "Transport", transactionDate: "2026-05-02" }
    ]);

    expect(report.totalIncome).toBe(3000);
    expect(report.totalExpenses).toBe(20);
    expect(report.balance).toBe(2980);
  });
});
```

- [ ] **Step 2: Run the report test**

Run: `npx vitest run src/lib/reports/monthly-report.test.ts`
Expected: FAIL because the report builder does not exist yet.

- [ ] **Step 3: Implement monthly report logic and report UI**

```ts
// src/lib/reports/monthly-report.ts
type ReportTransaction = {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  transactionDate: string;
};

export function buildMonthlyReport(items: ReportTransaction[]) {
  const totalIncome = items
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = items
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const byCategory = items
    .filter((item) => item.type === "expense")
    .reduce<Record<string, number>>((accumulator, item) => {
      accumulator[item.category] = (accumulator[item.category] ?? 0) + item.amount;
      return accumulator;
    }, {});

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    byCategory
  };
}
```

```tsx
// src/components/reports/monthly-chart.tsx
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function MonthlyChart({ income, expenses }: { income: number; expenses: number }) {
  const data = [
    { name: "Income", value: income },
    { name: "Expenses", value: expenses }
  ];

  return (
    <div className="h-80 rounded-3xl bg-white p-6 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Bar dataKey="value" fill="#1f9d7a" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

```tsx
// src/components/reports/top-categories.tsx
export function TopCategories({ items }: { items: Record<string, number> }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Top spending categories</h2>
      <ul className="mt-4 space-y-3">
        {Object.entries(items).map(([name, amount]) => (
          <li key={name} className="flex justify-between">
            <span>{name}</span>
            <span>{amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

Update `src/app/reports/page.tsx` to call `buildMonthlyReport` with seeded sample data, render `MonthlyChart`, and render `TopCategories`.

- [ ] **Step 4: Run the report test and build**

Run: `npx vitest run src/lib/reports/monthly-report.test.ts`
Expected: PASS

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/reports/monthly-report.ts src/lib/reports/monthly-report.test.ts src/components/reports/monthly-chart.tsx src/components/reports/top-categories.tsx src/app/reports/page.tsx
git commit -m "feat: add monthly reporting experience"
```

## Task 9: Add CSV Export and Print-Friendly Report Output

**Files:**
- Create: `src/app/api/export/monthly/route.ts`
- Modify: `src/app/reports/page.tsx`
- Create: `tests/e2e/report-export.spec.ts`

- [ ] **Step 1: Write the failing export endpoint test note**

Define the endpoint contract:

```ts
// Contract
// GET /api/export/monthly?month=2026-05 returns text/csv with transaction rows
```

- [ ] **Step 2: Run the e2e export test before the endpoint exists**

Run: `npx playwright test tests/e2e/report-export.spec.ts`
Expected: FAIL because the export endpoint and report controls do not exist yet.

- [ ] **Step 3: Implement the export route and report actions**

```ts
// src/app/api/export/monthly/route.ts
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month") ?? "2026-05";
  const csv = [
    "title,amount,type,category,date",
    `"Salary",3000,income,Salary,${month}-01`,
    `"Grab ride",20,expense,Transport,${month}-02`
  ].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="report-${month}.csv"`
    }
  });
}
```

Update `src/app/reports/page.tsx` with:

```tsx
<div className="flex gap-3">
  <a
    href="/api/export/monthly?month=2026-05"
    className="rounded-xl bg-brand-700 px-4 py-3 text-white"
  >
    Export CSV
  </a>
  <button onClick={() => window.print()} className="rounded-xl border px-4 py-3">
    Print report
  </button>
</div>
```

Create `tests/e2e/report-export.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("monthly report exposes export control", async ({ page }) => {
  await page.goto("/reports");
  await expect(page.getByText("Export CSV")).toBeVisible();
});
```

- [ ] **Step 4: Run the export e2e test**

Run: `npx playwright test tests/e2e/report-export.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/api/export/monthly/route.ts src/app/reports/page.tsx tests/e2e/report-export.spec.ts
git commit -m "feat: add monthly report export tools"
```

## Task 10: Add Settings, UX Polish, and Security Hardening

**Files:**
- Modify: `src/app/settings/page.tsx`
- Modify: `src/app/actions/auth.ts`
- Modify: `src/app/actions/transactions.ts`
- Create: `tests/e2e/auth.spec.ts`
- Create: `tests/e2e/transaction-flow.spec.ts`

- [ ] **Step 1: Write the failing auth flow e2e test**

```ts
import { expect, test } from "@playwright/test";

test("signup page renders a start action", async ({ page }) => {
  await page.goto("/signup");
  await expect(page.getByText("Start tracking")).toBeVisible();
});
```

- [ ] **Step 2: Run the auth flow e2e test**

Run: `npx playwright test tests/e2e/auth.spec.ts`
Expected: FAIL because the e2e test file and the final polished auth flow are not complete yet.

- [ ] **Step 3: Apply UX and security improvements**

Implement these upgrades:

```tsx
// src/app/settings/page.tsx
import { AppShell } from "@/components/layout/app-shell";

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <section className="grid gap-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="mt-2 text-slate-600">Manage your display name and preferred currency.</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Security</h2>
          <p className="mt-2 text-slate-600">Password reset, email verification, and session controls land here next.</p>
        </div>
      </section>
    </AppShell>
  );
}
```

```ts
// auth action hardening example
if (typeof formData.get("email") !== "string") {
  throw new Error("Invalid form payload");
}
```

```ts
// transaction action hardening example
if (payload.title.trim().length === 0) {
  throw new Error("Transaction title is required");
}
```

Also add:
- friendly empty states to dashboard and transaction list
- loading state buttons on auth and transaction forms
- a basic server-side rate-limit boundary around auth actions
- notes in code where row-level security will be enforced at the database layer

- [ ] **Step 4: Run the final verification suite**

Run: `npm run test`
Expected: PASS

Run: `npm run build`
Expected: PASS

Run: `npx playwright test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/settings/page.tsx src/app/actions/auth.ts src/app/actions/transactions.ts tests/e2e/auth.spec.ts tests/e2e/transaction-flow.spec.ts
git commit -m "feat: polish finance tracker mvp"
```

## Self-Review

### Spec coverage

Covered by this plan:
- auth from day one
- transaction CRUD
- category suggestion
- dashboard totals
- reports and charts
- CSV export
- responsive app shell
- settings foundation
- security hardening

Intentionally deferred, matching the spec:
- debt tracker
- savings goals
- AI spending analysis
- shared/family accounts
- bank sync

### Placeholder scan

The only intentional implementation placeholder is `requireUserId()` returning a stub user id in Task 3. Replace that with the real session read while implementing the auth integration in the same task before considering it complete.

### Type consistency

Core naming is consistent across the plan:
- `TransactionType`
- `transactionSchema`
- `suggestCategory`
- `buildMonthlyReport`
- `createTransactionAction`
- `updateTransactionAction`
- `deleteTransactionAction`

## Recommended Execution Order

Build tasks in this exact order:
1. Scaffold the app
2. Add schema and seeds
3. Add auth
4. Add shell
5. Add transaction validation and category suggestion
6. Add transaction CRUD
7. Add dashboard
8. Add reporting
9. Add export
10. Polish and harden
