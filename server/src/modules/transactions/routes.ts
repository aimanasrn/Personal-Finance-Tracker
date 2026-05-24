import { Router } from "express";
import { getErrorResponse } from "../../lib/http.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireWorkspaceMember } from "../../middleware/workspace.js";
import { createTransaction } from "./service.js";

export const transactionRouter = Router({ mergeParams: true });

transactionRouter.use(requireAuth, requireWorkspaceMember);

transactionRouter.post("/", async (req, res) => {
  try {
    const transaction = await createTransaction(req.params.workspaceId!, req.body);
    return res.status(201).json(transaction);
  } catch (error) {
    const response = getErrorResponse(error);
    return res.status(response.statusCode).json(response.body);
  }
});
