import { prisma } from "../../lib/prisma.js";

export function defaultCategoryData(workspaceId: string) {
  return [
    { workspaceId, name: "Housing" },
    { workspaceId, name: "Food" },
    { workspaceId, name: "Transport" },
    { workspaceId, name: "Savings" }
  ];
}

export function listCategories(workspaceId: string) {
  return prisma.category.findMany({
    where: { workspaceId },
    orderBy: { name: "asc" }
  });
}
