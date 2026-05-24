# Personal Finance Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local React + Node.js + MySQL personal finance tracker with private and household workspaces, manual transactions, monthly budgets, savings goals, recurring planned expenses, and a responsive animated dashboard.

**Architecture:** Use an npm workspace monorepo with a React + Vite + TypeScript client and an Express + Prisma + TypeScript server. The API uses JWT bearer tokens, all finance records are scoped to a workspace, and MySQL is managed through Prisma migrations and seed data.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router, Zustand, Express, Prisma, MySQL, Vitest, React Testing Library, Supertest

---

## File Structure

- `package.json`: root workspaces and shared scripts
- `.gitignore`: local-only paths, dependency output, and env files
- `README.md`: local setup, runbook, and verification commands
- `client/package.json`: frontend scripts and dependencies
- `client/tsconfig.json`: frontend TypeScript config
- `client/vite.config.ts`: Vite config and Vitest environment
- `client/index.html`: Vite entry point
- `client/src/main.tsx`: React bootstrap
- `client/src/App.tsx`: top-level router host
- `client/src/app/router.tsx`: app routes
- `client/src/app/api.ts`: API wrapper with bearer auth
- `client/src/app/auth-store.ts`: session and active workspace state
- `client/src/styles/index.css`: Tailwind imports and theme styling
- `client/tailwind.config.ts`: Tailwind theme
- `client/src/features/auth/AuthPage.tsx`: sign-in/sign-up screen
- `client/src/features/workspaces/WorkspaceSwitcher.tsx`: workspace selector
- `client/src/features/dashboard/*`: animated dashboard UI
- `client/src/features/transactions/TransactionForm.tsx`: quick-add transaction form
- `client/src/features/budgets/BudgetPage.tsx`: budget screen
- `client/src/features/goals/GoalsPage.tsx`: goals screen
- `client/src/features/recurring/*`: recurring expense and planned-instance views
- `client/src/test/*.test.tsx`: frontend smoke and feature tests
- `server/package.json`: backend scripts and dependencies
- `server/tsconfig.json`: backend TypeScript config
- `server/src/index.ts`: API server bootstrap
- `server/src/app.ts`: Express app wiring
- `server/src/config/env.ts`: environment parsing
- `server/src/lib/prisma.ts`: Prisma singleton
- `server/src/lib/auth.ts`: password hashing and JWT helpers
- `server/src/lib/http.ts`: API error helpers
- `server/src/middleware/auth.ts`: bearer-token auth guard
- `server/src/middleware/workspace.ts`: workspace membership guard
- `server/src/modules/*`: auth, workspaces, categories, transactions, budgets, goals, recurring, dashboard
- `server/prisma/schema.prisma`: MySQL schema
- `server/prisma/seed.ts`: default category seeding
- `server/src/__tests__/*.test.ts`: backend integration tests

## Task 1: Scaffold the Monorepo and Install Dependencies

**Files:**
- Create: `package.json`
- Create: `README.md`
- Modify: `.gitignore`
- Create: `client/package.json`
- Create: `server/package.json`

- [ ] **Step 1: Verify the current repo shape**

Run: `Get-ChildItem -Force`

Expected: repo contains only `.git`, `.gitignore`, and `docs` in this worktree checkout.

- [ ] **Step 2: Add the workspace scaffold**

Create `package.json`:

```json
{
  "name": "personal-finance-tracker",
  "private": true,
  "workspaces": [
    "client",
    "server"
  ],
  "scripts": {
    "dev": "npm run dev:server",
    "dev:client": "npm run dev --workspace client",
    "dev:server": "npm run dev --workspace server",
    "build": "npm run build --workspace server && npm run build --workspace client",
    "test": "npm run test --workspace server && npm run test --workspace client"
  }
}
```

Update `.gitignore`:

```gitignore
.worktrees/
.superpowers/
node_modules/
dist/
coverage/
.env
.env.*
client/node_modules/
server/node_modules/
server/generated/
```

Create `client/package.json`:

```json
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "vitest run"
  },
  "dependencies": {
    "framer-motion": "^11.3.19",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "zustand": "^5.0.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.15",
    "typescript": "^5.6.3",
    "vite": "^5.4.11",
    "vitest": "^2.1.5"
  }
}
```

Create `server/package.json`:

```json
{
  "name": "server",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json",
    "test": "vitest run",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.1",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/node": "^22.9.0",
    "prisma": "^5.22.0",
    "supertest": "^7.0.0",
    "tsx": "^4.19.2",
    "typescript": "^5.6.3",
    "vitest": "^2.1.5"
  }
}
```

Create `README.md`:

```md
# Personal Finance Tracker

Local React + Node.js + MySQL budgeting app.
```

- [ ] **Step 3: Install dependencies**

Run: `npm install`

Expected: root lockfile plus installed client/server workspace dependencies.

- [ ] **Step 4: Commit**

```bash
git add package.json .gitignore README.md client/package.json server/package.json package-lock.json
git commit -m "chore: scaffold monorepo and dependencies"
```

## Task 2: Create TypeScript, Vite, Tailwind, and Server Base Config

**Files:**
- Create: `client/tsconfig.json`
- Create: `client/vite.config.ts`
- Create: `client/index.html`
- Create: `client/tailwind.config.ts`
- Create: `client/postcss.config.js`
- Create: `server/tsconfig.json`
- Create: `server/.env.example`
- Create: `server/src/config/env.ts`

- [ ] **Step 1: Add frontend config**

Create `client/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src", "vite.config.ts", "tailwind.config.ts"]
}
```

Create `client/vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts"
  }
});
```

Create `client/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Personal Finance Tracker</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `client/tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          400: "#38bdf8",
          500: "#22d3ee",
          600: "#818cf8"
        }
      },
      boxShadow: {
        panel: "0 24px 60px rgba(0, 0, 0, 0.28)"
      }
    }
  },
  plugins: []
} satisfies Config;
```

Create `client/postcss.config.js`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
```

- [ ] **Step 2: Add backend config**

Create `server/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["src", "prisma/seed.ts"]
}
```

Create `server/.env.example`:

```env
PORT=4000
DATABASE_URL=mysql://root:password@127.0.0.1:3306/personal_finance_tracker
JWT_SECRET=dev-secret
CLIENT_ORIGIN=http://127.0.0.1:5173
```

Create `server/src/config/env.ts`:

```ts
import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  CLIENT_ORIGIN: z.string().default("http://127.0.0.1:5173")
});

export const env = envSchema.parse(process.env);
```

- [ ] **Step 3: Commit**

```bash
git add client/tsconfig.json client/vite.config.ts client/index.html client/tailwind.config.ts client/postcss.config.js server/tsconfig.json server/.env.example server/src/config/env.ts
git commit -m "chore: add frontend and backend base config"
```

## Task 3: Build Server App, Prisma Schema, and Health Test

**Files:**
- Create: `server/src/app.ts`
- Create: `server/src/index.ts`
- Create: `server/src/lib/prisma.ts`
- Create: `server/src/lib/http.ts`
- Create: `server/prisma/schema.prisma`
- Create: `server/prisma/seed.ts`
- Create: `server/src/__tests__/app.test.ts`

- [ ] **Step 1: Write the failing health test**

Create `server/src/__tests__/app.test.ts`:

```ts
import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app";

describe("GET /api/health", () => {
  it("returns ok", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });
});
```

- [ ] **Step 2: Run the failing test**

Run: `npm run test --workspace server -- app.test.ts`

Expected: FAIL because `app.ts` does not exist yet.

- [ ] **Step 3: Add Express base app**

Create `server/src/app.ts`:

```ts
import cors from "cors";
import express from "express";
import { env } from "./config/env";

export const app = express();

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: false
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true });
});
```

Create `server/src/index.ts`:

```ts
import { app } from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.log(`server listening on ${env.PORT}`);
});
```

Create `server/src/lib/prisma.ts`:

```ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```

Create `server/src/lib/http.ts`:

```ts
export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, code: string, message?: string) {
    super(message ?? code);
    this.statusCode = statusCode;
    this.code = code;
  }
}
```

- [ ] **Step 4: Add the Prisma schema with execution-safe indexes**

Create `server/prisma/schema.prisma` with complete relations and indexes:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

enum WorkspaceType {
  PERSONAL
  HOUSEHOLD
}

enum WorkspaceRole {
  OWNER
  MEMBER
}

enum TransactionType {
  INCOME
  EXPENSE
}

enum PlannedExpenseStatus {
  PENDING
  PAID
  SKIPPED
}

model User {
  id                  String            @id @default(cuid())
  email               String            @unique
  passwordHash        String
  createdAt           DateTime          @default(now())
  memberships         WorkspaceMember[]
  sentInvites         WorkspaceInvite[] @relation("SentInvites")
  acceptedInvites     WorkspaceInvite[] @relation("AcceptedInvites")
}

model Workspace {
  id                       String                   @id @default(cuid())
  name                     String
  type                     WorkspaceType
  createdAt                DateTime                 @default(now())
  members                  WorkspaceMember[]
  invites                  WorkspaceInvite[]
  categories               Category[]
  budgets                  MonthlyBudget[]
  goals                    SavingsGoal[]
  transactions             Transaction[]
  recurringExpenses        RecurringExpense[]
  plannedExpenseInstances  PlannedExpenseInstance[]
}

model WorkspaceMember {
  id          String        @id @default(cuid())
  workspaceId String
  userId      String
  role        WorkspaceRole
  workspace   Workspace     @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, userId])
}

model WorkspaceInvite {
  id           String     @id @default(cuid())
  workspaceId  String
  email        String
  token        String     @unique
  invitedById  String
  acceptedById String?
  expiresAt    DateTime
  createdAt    DateTime   @default(now())
  workspace    Workspace  @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  invitedBy    User       @relation("SentInvites", fields: [invitedById], references: [id], onDelete: Cascade)
  acceptedBy   User?      @relation("AcceptedInvites", fields: [acceptedById], references: [id], onDelete: SetNull)
}

model Category {
  id                 String          @id @default(cuid())
  workspaceId        String
  name               String
  workspace          Workspace       @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  budgets            MonthlyBudget[]
  transactions       Transaction[]
  recurringExpenses  RecurringExpense[]

  @@unique([workspaceId, name])
}

model Transaction {
  id                    String                  @id @default(cuid())
  workspaceId           String
  categoryId            String
  amount                Decimal                 @db.Decimal(12, 2)
  type                  TransactionType
  date                  DateTime
  note                  String?
  createdAt             DateTime                @default(now())
  workspace             Workspace               @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  category              Category                @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  plannedExpenseSource  PlannedExpenseInstance? @relation("PaidTransaction")
}

model MonthlyBudget {
  id          String    @id @default(cuid())
  workspaceId String
  categoryId  String
  month       Int
  year        Int
  amount      Decimal   @db.Decimal(12, 2)
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  category    Category  @relation(fields: [categoryId], references: [id], onDelete: Restrict)

  @@unique([workspaceId, categoryId, month, year])
}

model SavingsGoal {
  id            String    @id @default(cuid())
  workspaceId   String
  name          String
  targetAmount  Decimal   @db.Decimal(12, 2)
  currentAmount Decimal   @default(0) @db.Decimal(12, 2)
  targetDate    DateTime?
  workspace     Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
}

model RecurringExpense {
  id          String                  @id @default(cuid())
  workspaceId String
  categoryId  String
  name        String
  amount      Decimal                 @db.Decimal(12, 2)
  dayOfMonth  Int
  note        String?
  active      Boolean                 @default(true)
  workspace   Workspace               @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  category    Category                @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  instances   PlannedExpenseInstance[]
}

model PlannedExpenseInstance {
  id                 String               @id @default(cuid())
  workspaceId        String
  recurringExpenseId String
  scheduledFor       DateTime
  status             PlannedExpenseStatus @default(PENDING)
  paidTransactionId  String?              @unique
  workspace          Workspace            @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  recurringExpense   RecurringExpense     @relation(fields: [recurringExpenseId], references: [id], onDelete: Cascade)
  paidTransaction    Transaction?         @relation("PaidTransaction", fields: [paidTransactionId], references: [id], onDelete: SetNull)

  @@unique([recurringExpenseId, scheduledFor])
}
```

Create `server/prisma/seed.ts`:

```ts
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("seed ready");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 5: Run the health test**

Run: `npm run test --workspace server -- app.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add server/src/app.ts server/src/index.ts server/src/lib/prisma.ts server/src/lib/http.ts server/prisma/schema.prisma server/prisma/seed.ts server/src/__tests__/app.test.ts
git commit -m "feat: add server base app and schema"
```

## Task 4: Add Auth, Workspace Access, and Categories

**Files:**
- Create: `server/src/lib/auth.ts`
- Create: `server/src/middleware/auth.ts`
- Create: `server/src/middleware/workspace.ts`
- Create: `server/src/modules/auth/routes.ts`
- Create: `server/src/modules/auth/service.ts`
- Create: `server/src/modules/workspaces/routes.ts`
- Create: `server/src/modules/workspaces/service.ts`
- Create: `server/src/modules/categories/routes.ts`
- Create: `server/src/modules/categories/service.ts`
- Modify: `server/src/app.ts`
- Create: `server/src/__tests__/auth.integration.test.ts`
- Create: `server/src/__tests__/workspaces.integration.test.ts`

- [ ] **Step 1: Add the failing auth test**

Create `server/src/__tests__/auth.integration.test.ts` that signs up a user and expects one personal workspace in the response.

- [ ] **Step 2: Add the failing workspace-access test**

Create `server/src/__tests__/workspaces.integration.test.ts` that expects `401` for `GET /api/workspaces` without a bearer token.

- [ ] **Step 3: Implement auth and workspace modules**

Use bearer tokens consistently. `signUp()` must create the user, create a personal workspace membership as `OWNER`, and return `{ token, user, workspaces }`. `requireAuth` reads the `Authorization: Bearer <token>` header. `requireWorkspaceMember` checks `workspaceId_userId`.

- [ ] **Step 4: Add category listing**

Add `GET /api/workspaces/:workspaceId/categories` guarded by `requireAuth` and `requireWorkspaceMember`.

- [ ] **Step 5: Run focused tests**

Run:
- `npm run test --workspace server -- auth.integration.test.ts`
- `npm run test --workspace server -- workspaces.integration.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add server/src/lib/auth.ts server/src/middleware/auth.ts server/src/middleware/workspace.ts server/src/modules/auth server/src/modules/workspaces server/src/modules/categories server/src/app.ts server/src/__tests__/auth.integration.test.ts server/src/__tests__/workspaces.integration.test.ts
git commit -m "feat: add auth workspace access and categories"
```

## Task 5: Add Transactions, Budgets, Goals, Recurring Expenses, and Dashboard API

**Files:**
- Create: `server/src/modules/transactions/routes.ts`
- Create: `server/src/modules/transactions/service.ts`
- Create: `server/src/modules/budgets/routes.ts`
- Create: `server/src/modules/budgets/service.ts`
- Create: `server/src/modules/goals/routes.ts`
- Create: `server/src/modules/goals/service.ts`
- Create: `server/src/modules/recurring/routes.ts`
- Create: `server/src/modules/recurring/service.ts`
- Create: `server/src/modules/dashboard/routes.ts`
- Create: `server/src/modules/dashboard/service.ts`
- Modify: `server/src/app.ts`
- Modify: `server/prisma/seed.ts`
- Create: `server/src/__tests__/transactions.integration.test.ts`
- Create: `server/src/__tests__/dashboard.integration.test.ts`
- Create: `server/src/__tests__/recurring.integration.test.ts`

- [ ] **Step 1: Add the failing transaction, dashboard, and recurring tests**

Create tests that first verify unauthenticated access is rejected:
- `POST /api/workspaces/:workspaceId/transactions` returns `401`
- `GET /api/workspaces/:workspaceId/dashboard` returns `401`
- `POST /api/workspaces/:workspaceId/recurring-expenses` returns `401`

- [ ] **Step 2: Implement the finance modules**

Requirements:
- transaction creation validates category ownership in the same workspace
- budgets are upserted by `(workspaceId, categoryId, month, year)`
- goals support `name`, `targetAmount`, `currentAmount`, and optional `targetDate`
- recurring-expense generation uses `(recurringExpenseId, scheduledFor)` uniqueness
- marking a planned item as paid creates one transaction and stores `paidTransactionId`
- marking a planned item as skipped updates only `PENDING` instances
- dashboard returns budget records, spent total, goals, and pending planned items for the month

- [ ] **Step 3: Seed default categories**

Update `server/prisma/seed.ts` to create `Housing`, `Food`, `Transport`, and `Savings` for every existing workspace with `skipDuplicates: true`.

- [ ] **Step 4: Run focused tests**

Run:
- `npm run test --workspace server -- transactions.integration.test.ts`
- `npm run test --workspace server -- dashboard.integration.test.ts`
- `npm run test --workspace server -- recurring.integration.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add server/src/modules/transactions server/src/modules/budgets server/src/modules/goals server/src/modules/recurring server/src/modules/dashboard server/src/app.ts server/prisma/seed.ts server/src/__tests__/transactions.integration.test.ts server/src/__tests__/dashboard.integration.test.ts server/src/__tests__/recurring.integration.test.ts
git commit -m "feat: add finance management and dashboard api"
```

## Task 6: Scaffold the React App and Test Harness

**Files:**
- Create: `client/src/main.tsx`
- Create: `client/src/App.tsx`
- Create: `client/src/app/router.tsx`
- Create: `client/src/styles/index.css`
- Create: `client/src/test/setup.ts`
- Create: `client/src/test/app.test.tsx`

- [ ] **Step 1: Write the failing frontend smoke test**

Create `client/src/test/app.test.tsx` that renders `App` and expects `Loading route...` on the root placeholder route.

- [ ] **Step 2: Run the failing smoke test**

Run: `npm run test --workspace client -- app.test.tsx`

Expected: FAIL because app files do not exist yet.

- [ ] **Step 3: Add the React scaffold**

Requirements:
- `main.tsx` boots `App`
- `App.tsx` renders `RouterProvider`
- `router.tsx` defines `/`, `/sign-in`, and `/sign-up` placeholder routes
- `index.css` imports Tailwind and sets the dark animated base theme
- `setup.ts` imports `@testing-library/jest-dom`

- [ ] **Step 4: Run the smoke test**

Run: `npm run test --workspace client -- app.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add client/src/main.tsx client/src/App.tsx client/src/app/router.tsx client/src/styles/index.css client/src/test/setup.ts client/src/test/app.test.tsx
git commit -m "feat: scaffold react app and test harness"
```

## Task 7: Build Auth UI, Workspace Switching, and Animated Dashboard Shell

**Files:**
- Create: `client/src/app/api.ts`
- Create: `client/src/app/auth-store.ts`
- Create: `client/src/features/auth/AuthPage.tsx`
- Create: `client/src/features/workspaces/WorkspaceSwitcher.tsx`
- Create: `client/src/features/dashboard/SummaryCard.tsx`
- Create: `client/src/features/dashboard/DashboardPage.tsx`
- Modify: `client/src/app/router.tsx`
- Create: `client/src/test/dashboard.test.tsx`
- Create: `client/src/test/auth-flow.test.tsx`

- [ ] **Step 1: Write failing dashboard and auth UI tests**

Create:
- `client/src/test/dashboard.test.tsx` expecting `Budget overview`, `Savings goals`, and `Planned expenses`
- `client/src/test/auth-flow.test.tsx` expecting a visible `Sign in` button on `AuthPage`

- [ ] **Step 2: Run the failing tests**

Run:
- `npm run test --workspace client -- dashboard.test.tsx`
- `npm run test --workspace client -- auth-flow.test.tsx`

Expected: FAIL.

- [ ] **Step 3: Build the UI shell**

Requirements:
- `api.ts` attaches bearer tokens from Zustand store
- `auth-store.ts` holds `token`, `workspaces`, and `activeWorkspaceId`
- `AuthPage` renders sign-in/sign-up mode
- `WorkspaceSwitcher` allows current workspace selection
- `SummaryCard` uses `framer-motion`
- `DashboardPage` renders animated summary sections
- router uses `DashboardPage` at `/` and `AuthPage` at `/sign-in` and `/sign-up`

- [ ] **Step 4: Run the focused tests**

Run:
- `npm run test --workspace client -- dashboard.test.tsx`
- `npm run test --workspace client -- auth-flow.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add client/src/app/api.ts client/src/app/auth-store.ts client/src/features/auth/AuthPage.tsx client/src/features/workspaces/WorkspaceSwitcher.tsx client/src/features/dashboard client/src/app/router.tsx client/src/test/dashboard.test.tsx client/src/test/auth-flow.test.tsx
git commit -m "feat: add auth ui workspace switcher and dashboard shell"
```

## Task 8: Add Transaction, Budget, Goal, and Recurring Screens

**Files:**
- Create: `client/src/features/transactions/TransactionForm.tsx`
- Create: `client/src/features/budgets/BudgetPage.tsx`
- Create: `client/src/features/goals/GoalsPage.tsx`
- Create: `client/src/features/recurring/PlannedExpenseList.tsx`
- Create: `client/src/features/recurring/RecurringExpensesPage.tsx`
- Modify: `client/src/features/dashboard/DashboardPage.tsx`
- Modify: `client/src/app/router.tsx`
- Create: `client/src/test/planned-expenses.test.tsx`

- [ ] **Step 1: Write the failing planned-expense UI test**

Create `client/src/test/planned-expenses.test.tsx` that renders one pending item and expects `Mark paid` and `Skip` buttons.

- [ ] **Step 2: Run the failing test**

Run: `npm run test --workspace client -- planned-expenses.test.tsx`

Expected: FAIL.

- [ ] **Step 3: Build the feature pages**

Requirements:
- `TransactionForm` renders amount/date inputs and submit button
- `BudgetPage` and `GoalsPage` render responsive placeholder shells
- `PlannedExpenseList` renders paid/skip actions
- `RecurringExpensesPage` hosts planned items
- `DashboardPage` adds a quick-add transaction section and stronger panel layout
- router adds `/budgets`, `/goals`, and `/recurring`

- [ ] **Step 4: Run the planned-expense test**

Run: `npm run test --workspace client -- planned-expenses.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add client/src/features/transactions/TransactionForm.tsx client/src/features/budgets/BudgetPage.tsx client/src/features/goals/GoalsPage.tsx client/src/features/recurring client/src/features/dashboard/DashboardPage.tsx client/src/app/router.tsx client/src/test/planned-expenses.test.tsx
git commit -m "feat: add finance feature screens"
```

## Task 9: Final Local Runbook and Verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Document exact local setup**

Update `README.md` with:
- `npm install`
- create MySQL database `personal_finance_tracker`
- copy `server/.env.example` to `server/.env`
- `npm run prisma:generate --workspace server`
- `npm run prisma:migrate --workspace server`
- `npm run prisma:seed --workspace server`
- `npm run dev:server`
- `npm run dev:client`

- [ ] **Step 2: Run backend tests**

Run: `npm run test --workspace server`

Expected: PASS.

- [ ] **Step 3: Run frontend tests**

Run: `npm run test --workspace client`

Expected: PASS.

- [ ] **Step 4: Run the production build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "chore: finalize local setup and verification"
```
