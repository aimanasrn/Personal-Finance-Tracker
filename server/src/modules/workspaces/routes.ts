import { Router } from "express";
import { getErrorResponse } from "../../lib/http.js";
import type { AuthedRequest } from "../../middleware/auth.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireWorkspaceMember } from "../../middleware/workspace.js";
import { createHouseholdWorkspace, createInvite, listUserWorkspaces } from "./service.js";

export const workspaceRouter = Router();

workspaceRouter.use(requireAuth);

workspaceRouter.get("/", async (req, res) => {
  const workspaces = await listUserWorkspaces((req as AuthedRequest).userId);
  res.status(200).json(workspaces);
});

workspaceRouter.post("/", async (req, res) => {
  try {
    const workspace = await createHouseholdWorkspace((req as AuthedRequest).userId, req.body.name ?? "");
    return res.status(201).json(workspace);
  } catch (error) {
    const response = getErrorResponse(error);
    return res.status(response.statusCode).json(response.body);
  }
});

workspaceRouter.post("/:workspaceId/invites", requireWorkspaceMember, async (req, res) => {
  try {
    const invite = await createInvite(req.params.workspaceId!, (req as AuthedRequest).userId, req.body.email ?? "");
    return res.status(201).json(invite);
  } catch (error) {
    const response = getErrorResponse(error);
    return res.status(response.statusCode).json(response.body);
  }
});
