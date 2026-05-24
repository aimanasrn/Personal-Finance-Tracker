import { Router } from "express";
import { getErrorResponse } from "../../lib/http.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireWorkspaceMember } from "../../middleware/workspace.js";
import {
  createRecurringExpense,
  generatePlannedInstances,
  markPlannedExpensePaid,
  markPlannedExpenseSkipped
} from "./service.js";

export const recurringRouter = Router({ mergeParams: true });

recurringRouter.use(requireAuth, requireWorkspaceMember);

recurringRouter.post("/", async (req, res) => {
  try {
    const workspaceId = (req.params as { workspaceId: string }).workspaceId;
    const recurringExpense = await createRecurringExpense(workspaceId, req.body);
    return res.status(201).json(recurringExpense);
  } catch (error) {
    const response = getErrorResponse(error);
    return res.status(response.statusCode).json(response.body);
  }
});

recurringRouter.post("/generate", async (req, res) => {
  const workspaceId = (req.params as { workspaceId: string }).workspaceId;
  const instances = await generatePlannedInstances(workspaceId, Number(req.body.month), Number(req.body.year));
  res.status(201).json(instances);
});

recurringRouter.post("/instances/:instanceId/pay", async (req, res) => {
  try {
    const workspaceId = (req.params as { workspaceId: string; instanceId: string }).workspaceId;
    const instanceId = (req.params as { workspaceId: string; instanceId: string }).instanceId;
    const instance = await markPlannedExpensePaid(workspaceId, instanceId);
    return res.status(200).json(instance);
  } catch (error) {
    const response = getErrorResponse(error);
    return res.status(response.statusCode).json(response.body);
  }
});

recurringRouter.post("/instances/:instanceId/skip", async (req, res) => {
  try {
    const workspaceId = (req.params as { workspaceId: string; instanceId: string }).workspaceId;
    const instanceId = (req.params as { workspaceId: string; instanceId: string }).instanceId;
    const instance = await markPlannedExpenseSkipped(workspaceId, instanceId);
    return res.status(200).json(instance);
  } catch (error) {
    const response = getErrorResponse(error);
    return res.status(response.statusCode).json(response.body);
  }
});
