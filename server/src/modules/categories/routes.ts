import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { requireWorkspaceMember } from "../../middleware/workspace.js";
import { listCategories } from "./service.js";

export const categoryRouter = Router({ mergeParams: true });

categoryRouter.use(requireAuth, requireWorkspaceMember);

categoryRouter.get("/", async (req, res) => {
  const categories = await listCategories(req.params.workspaceId!);
  res.status(200).json(categories);
});
