# Personal Finance Tracker Design

Date: 2026-05-24

## Overview

This project is a local, self-hosted personal finance tracker built as a responsive web application using React, Node.js, MySQL, and Tailwind CSS.

The product is budgeting-first rather than accounting-first. The main goal of the first release is to help users plan and manage spending through monthly budgets, savings goals, and recurring planned expenses. The application must support both personal finance and shared household collaboration from the first version.

## Product Goals

- Support multiple users from day one
- Support both private personal workspaces and shared household workspaces
- Keep the first version focused on budgeting and planning, not deep analytics
- Run locally with a simple development setup
- Deliver a responsive experience that feels intentional on both desktop and mobile
- Use motion and transitions to make the dashboard feel active and modern without adding noise

## Non-Goals

- Bank sync in v1
- CSV import in v1
- Deep analytics and advanced reporting in v1
- Highly granular permissions beyond a minimal household role model
- Native mobile applications in v1

## Technical Stack

- Frontend: React SPA
- Styling: Tailwind CSS
- Backend: Node.js REST API
- Database: MySQL
- Authentication: email/password

This should be implemented as a single local web stack, not microservices.

## Core Product Model

The primary boundary in the system is the workspace.

- Every user has a private personal workspace
- Users can also create or join shared household workspaces
- All finance data belongs to a workspace, not directly to a user

This rule keeps data ownership, access control, and reporting logic consistent across personal and household use cases.

## User Roles

V1 role model:

- `owner`
- `member`

Expected behavior:

- Owners can manage workspace settings, invite members, and manage shared budgeting data
- Members can participate in the workspace and use shared budgeting features

V1 should keep permissions minimal and explicit. More detailed role controls can be added later if needed.

## Core Features

### 1. Authentication

- Sign up with email and password
- Sign in with email and password
- Passwords must be stored securely using hashing

### 2. Workspaces

- Create a private personal workspace automatically for each new user
- Create shared household workspaces
- Invite other users into a household workspace
- Switch between personal and household workspaces in the UI

### 3. Transactions

Manual entry only in v1.

Each transaction should include:

- amount
- type (`income` or `expense`)
- category
- date
- optional note

Transactions are used to drive budget tracking and goal progress. They do not need advanced accounting behavior in v1.

### 4. Monthly Budgets

- Budgets are monthly
- Budgets are category-based
- Users can set planned amounts per category for a workspace
- Budget reporting compares planned vs actual spending

### 5. Savings Goals

Each goal should support:

- name
- target amount
- current progress
- optional target date

Goals should appear clearly on the dashboard and show visible progress.

### 6. Recurring Planned Expenses

Recurring expenses are planning items, not automatic ledger entries.

Expected behavior:

- Users define recurring planned expenses for a workspace
- The system generates planned expense instances for the relevant month
- Users can mark each planned instance as `paid` or `skipped`
- Marking an item as `paid` creates a real transaction
- Marking an item as `skipped` preserves planning history but does not affect actual spending

This preserves the distinction between planned activity and actual recorded spending.

### 7. Reporting

Reporting remains intentionally basic in v1:

- monthly budget vs actual
- savings goal progress
- monthly/category spending summaries

The first version should not attempt deep analytics or large reporting surfaces.

## Data Model

Main entities:

- `User`
- `Workspace`
- `WorkspaceMember`
- `Category`
- `Transaction`
- `MonthlyBudget`
- `SavingsGoal`
- `RecurringExpense`
- `PlannedExpenseInstance`

### Model Notes

- `Workspace` represents either a personal or household finance space
- `WorkspaceMember` links users to workspaces and stores the user role
- `Category` is scoped to a workspace
- `MonthlyBudget` is scoped by workspace, category, month, and year
- `Transaction` belongs to a workspace and category
- `SavingsGoal` belongs to a workspace
- `RecurringExpense` stores the recurring rule and planning metadata
- `PlannedExpenseInstance` represents a generated occurrence for user review and status tracking

## API and Backend Responsibilities

The Node.js backend is responsible for:

- authentication
- workspace membership and authorization checks
- transaction CRUD
- monthly budget CRUD
- savings goal CRUD
- recurring expense CRUD
- planned expense instance generation and status changes
- reporting endpoints for dashboard summaries

Access control must be enforced on every finance endpoint based on workspace membership.

## Frontend Responsibilities

The React frontend is responsible for:

- sign-in and sign-up flows
- workspace switching
- transaction entry forms
- budget management UI
- savings goal management UI
- recurring planned expense management UI
- dashboard views for budget health, goal progress, and upcoming planned expenses

The UI should be responsive from the start and support both desktop and mobile without treating mobile as an afterthought.

## UI Direction

The approved UI direction is a sharper, more kinetic dashboard style based on the selected `C` concept.

### Visual Characteristics

- layered dashboard panels
- stronger contrast and clearer data emphasis
- bold progress states
- modern, data-heavy presentation without looking cluttered

### Motion Characteristics

Motion should be purposeful and tied to user understanding:

- animated progress bars for budgets and goals
- staggered section reveals on dashboard load
- subtle count-up or transition effects for key totals
- smooth workspace and route transitions
- stronger hover and press feedback on interactive cards and controls
- visible but controlled status transitions when planned expenses are marked paid or skipped

Animations should improve clarity and feel, not distract from data entry or budget review.

## Primary User Flows

### New User Flow

1. User signs up with email/password
2. System creates a personal workspace
3. User lands on the main dashboard
4. User creates budgets, goals, and recurring planned expenses
5. User records transactions manually

### Household Flow

1. User creates a household workspace
2. User invites another member
3. Members switch into the shared workspace
4. Members collaborate on shared budgets, goals, recurring expenses, and transactions

### Planned Expense Flow

1. User creates a recurring planned expense
2. System generates planned instances for the month
3. User reviews upcoming items
4. User marks an item paid or skipped
5. Paid items convert into actual transactions

## Error Handling

The implementation should explicitly handle:

- invalid login attempts
- duplicate or invalid invites
- access to workspaces a user does not belong to
- invalid monetary values or dates
- invalid category references outside the active workspace
- accidental double-processing of planned expense instances

The system should fail safely and preserve data integrity around all budget and planned-expense actions.

## Testing Strategy

Priority test coverage:

- authentication flows
- password hashing and validation behavior
- workspace access control
- separation between private and shared workspace data
- monthly budget calculations
- goal progress calculations
- recurring expense instance generation
- planned instance mark-paid behavior
- planned instance skip behavior
- dashboard summary correctness

## Scope Control

This design is intentionally focused enough for a single implementation plan:

- one frontend app
- one backend API
- one MySQL database
- one clear product slice centered on budgeting, goals, and recurring planned expenses

Features outside that slice should be deferred instead of partially implemented.

## Success Criteria

The first version is successful if a user can:

- create an account
- manage a private workspace
- create and use a household workspace
- enter transactions manually
- create monthly category budgets
- track savings goals
- manage recurring planned expenses through paid/skip decisions
- understand current budget health and goal progress from the dashboard

## Open Decisions Deferred

These are intentionally deferred, not unresolved:

- social login
- CSV import
- bank connectivity
- deeper permissions
- advanced reporting
- production deployment hardening
