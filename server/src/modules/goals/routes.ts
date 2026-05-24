import { Router } from "express";
import { getErrorResponse } from "../../lib/http.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireWorkspaceMember } from "../../middleware/workspace.js";
import { createGoal } from "./service.js";

export const goalRouter = Router({ mergeParams: true });

goalRouter.use(requireAuth, requireWorkspaceMember);

goalRouter.post("/", async (req, res) => {
  try {
    const goal = await createGoal(req.params.workspaceId!, req.body);
    return res.status(201).json(goal);
  } catch (error) {
    const response = getErrorResponse(error);
    return res.status(response.statusCode).json(response.body);
  }
});
