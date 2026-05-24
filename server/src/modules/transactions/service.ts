import { ApiError } from "../../lib/http.js";
import { prisma } from "../../lib/prisma.js";

type CreateTransactionInput = {
  categoryId: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: string;
  note?: string;
};

export async function createTransaction(workspaceId: string, input: CreateTransactionInput) {
  const category = await prisma.category.findFirst({
    where: {
      id: input.categoryId,
      workspaceId
    }
  });

  if (!category) {
    throw new ApiError(404, "CATEGORY_NOT_FOUND");
  }

  return prisma.transaction.create({
    data: {
      workspaceId,
      categoryId: input.categoryId,
      amount: input.amount,
      type: input.type,
      date: new Date(input.date),
      note: input.note?.trim() || null
    }
  });
}
