import { ApiError } from "../../lib/http.js";
import { prisma } from "../../lib/prisma.js";

type UpsertBudgetInput = {
  categoryId: string;
  month: number;
  year: number;
  amount: number;
};

export async function upsertBudget(workspaceId: string, input: UpsertBudgetInput) {
  const category = await prisma.category.findFirst({
    where: {
      id: input.categoryId,
      workspaceId
    }
  });

  if (!category) {
    throw new ApiError(404, "CATEGORY_NOT_FOUND");
  }

  return prisma.monthlyBudget.upsert({
    where: {
      workspaceId_categoryId_month_year: {
        workspaceId,
        categoryId: input.categoryId,
        month: input.month,
        year: input.year
      }
    },
    update: {
      amount: input.amount
    },
    create: {
      workspaceId,
      categoryId: input.categoryId,
      month: input.month,
      year: input.year,
      amount: input.amount
    }
  });
}
