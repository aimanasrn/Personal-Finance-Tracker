import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { authRouter } from "./modules/auth/routes.js";
import { workspaceRouter } from "./modules/workspaces/routes.js";
import { categoryRouter } from "./modules/categories/routes.js";
import { transactionRouter } from "./modules/transactions/routes.js";
import { budgetRouter } from "./modules/budgets/routes.js";
import { goalRouter } from "./modules/goals/routes.js";
import { recurringRouter } from "./modules/recurring/routes.js";
import { dashboardRouter } from "./modules/dashboard/routes.js";

export const app = express();

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: false
  })
);
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/workspaces", workspaceRouter);
app.use("/api/workspaces/:workspaceId/categories", categoryRouter);
app.use("/api/workspaces/:workspaceId/transactions", transactionRouter);
app.use("/api/workspaces/:workspaceId/budgets", budgetRouter);
app.use("/api/workspaces/:workspaceId/goals", goalRouter);
app.use("/api/workspaces/:workspaceId/recurring-expenses", recurringRouter);
app.use("/api/workspaces/:workspaceId/dashboard", dashboardRouter);

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true });
});
