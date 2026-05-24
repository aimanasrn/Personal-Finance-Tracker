import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import type { AuthedRequest } from "./auth.js";

export async function requireWorkspaceMember(req: Request, res: Response, next: NextFunction) {
  const { workspaceId } = req.params;
  const userId = (req as AuthedRequest).userId;

  if (!workspaceId) {
    return res.status(400).json({ error: "WORKSPACE_REQUIRED" });
  }

  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId
      }
    }
  });

  if (!membership) {
    return res.status(403).json({ error: "FORBIDDEN" });
  }

  return next();
}
