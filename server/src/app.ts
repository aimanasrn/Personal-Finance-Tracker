import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { authRouter } from "./modules/auth/routes.js";
import { workspaceRouter } from "./modules/workspaces/routes.js";
import { categoryRouter } from "./modules/categories/routes.js";

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

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true });
});
