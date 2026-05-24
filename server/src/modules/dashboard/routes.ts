import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { requireWorkspaceMember } from "../../middleware/workspace.js";
import { getDashboardSummary } from "./service.js";

export const dashboardRouter = Router({ mergeParams: true });

dashboardRouter.use(requireAuth, requireWorkspaceMember);

dashboardRouter.get("/", async (req, res) => {
  const month = Number(req.query.month);
  const year = Number(req.query.year);
  const summary = await getDashboardSummary(req.params.workspaceId!, month, year);
  res.status(200).json(summary);
});
