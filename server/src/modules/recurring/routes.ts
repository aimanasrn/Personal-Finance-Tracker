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
    const recurringExpense = await createRecurringExpense(req.params.workspaceId!, req.body);
    return res.status(201).json(recurringExpense);
  } catch (error) {
    const response = getErrorResponse(error);
    return res.status(response.statusCode).json(response.body);
  }
});

recurringRouter.post("/generate", async (req, res) => {
  const instances = await generatePlannedInstances(req.params.workspaceId!, Number(req.body.month), Number(req.body.year));
  res.status(201).json(instances);
});

recurringRouter.post("/instances/:instanceId/pay", async (req, res) => {
  try {
    const instance = await markPlannedExpensePaid(req.params.workspaceId!, req.params.instanceId!);
    return res.status(200).json(instance);
  } catch (error) {
    const response = getErrorResponse(error);
    return res.status(response.statusCode).json(response.body);
  }
});

recurringRouter.post("/instances/:instanceId/skip", async (req, res) => {
  try {
    const instance = await markPlannedExpenseSkipped(req.params.workspaceId!, req.params.instanceId!);
    return res.status(200).json(instance);
  } catch (error) {
    const response = getErrorResponse(error);
    return res.status(response.statusCode).json(response.body);
  }
});
