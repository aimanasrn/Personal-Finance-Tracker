import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { requireWorkspaceMember } from "../../middleware/workspace.js";
import { getDashboardSummary } from "./service.js";

export const dashboardRouter = Router({ mergeParams: true });

dashboardRouter.use(requireAuth, requireWorkspaceMember);

dashboardRouter.get("/", async (req, res) => {
  const workspaceId = (req.params as { workspaceId: string }).workspaceId;
  const month = Number(req.query.month);
  const year = Number(req.query.year);
  const summary = await getDashboardSummary(workspaceId, month, year);
  res.status(200).json(summary);
});
