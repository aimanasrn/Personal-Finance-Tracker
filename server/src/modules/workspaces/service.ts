import crypto from "node:crypto";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../lib/http.js";
import { defaultCategoryData } from "../categories/service.js";

export async function listUserWorkspaces(userId: string) {
  const memberships = await prisma.workspaceMember.findMany({
    where: { userId },
    include: { workspace: true },
    orderBy: { workspace: { createdAt: "asc" } }
  });

  return memberships.map((membership) => membership.workspace);
}

export async function createHouseholdWorkspace(userId: string, name: string) {
  if (!name.trim()) {
    throw new ApiError(400, "INVALID_INPUT");
  }

  const workspace = await prisma.workspace.create({
    data: {
      name: name.trim(),
      type: "HOUSEHOLD",
      members: {
        create: {
          userId,
          role: "OWNER"
        }
      }
    }
  });

  await prisma.category.createMany({
    data: defaultCategoryData(workspace.id),
    skipDuplicates: true
  });

  return workspace;
}

export async function createInvite(workspaceId: string, invitedById: string, email: string) {
  if (!email.trim()) {
    throw new ApiError(400, "INVALID_INPUT");
  }

  const duplicate = await prisma.workspaceInvite.findFirst({
    where: {
      workspaceId,
      email,
      acceptedById: null
    }
  });

  if (duplicate) {
    throw new ApiError(409, "INVITE_ALREADY_EXISTS");
  }

  return prisma.workspaceInvite.create({
    data: {
      workspaceId,
      invitedById,
      email: email.trim(),
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });
}
