# Personal Finance Tracker

Local React + Node.js + MySQL budgeting app with private and shared workspaces, monthly budgets, savings goals, recurring planned expenses, and a responsive animated dashboard.

## Tech stack

- React + Vite + TypeScript
- Tailwind CSS + Framer Motion
- Node.js + Express + Prisma
- MySQL-compatible database

## Local setup

1. Install dependencies:
   `npm install`
2. Ensure a local MySQL-compatible server is running on `127.0.0.1:3306`
3. Create the database:
   `CREATE DATABASE personal_finance_tracker;`
4. Copy `server/.env.example` to `server/.env`
5. Generate Prisma client:
   `npm run prisma:generate --workspace server`
6. Apply migrations:
   `npm run prisma:migrate --workspace server -- --name init`
7. Seed default categories:
   `npm run prisma:seed --workspace server`

## Run locally

- API: `npm run dev:server`
- Client: `npm run dev:client`

## Verification

- Backend tests: `npm run test --workspace server`
- Frontend tests: `npm run test --workspace client`
- Production build: `npm run build`
