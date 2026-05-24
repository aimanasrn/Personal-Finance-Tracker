import { Router } from "express";
import { getErrorResponse } from "../../lib/http.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireWorkspaceMember } from "../../middleware/workspace.js";
import { upsertBudget } from "./service.js";

export const budgetRouter = Router({ mergeParams: true });

budgetRouter.use(requireAuth, requireWorkspaceMember);

budgetRouter.post("/", async (req, res) => {
  try {
    const workspaceId = (req.params as { workspaceId: string }).workspaceId;
    const budget = await upsertBudget(workspaceId, req.body);
    return res.status(201).json(budget);
  } catch (error) {
    const response = getErrorResponse(error);
    return res.status(response.statusCode).json(response.body);
  }
});
