import { prisma } from "../../lib/prisma.js";

type CreateGoalInput = {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  targetDate?: string;
};

export async function createGoal(workspaceId: string, input: CreateGoalInput) {
  return prisma.savingsGoal.create({
    data: {
      workspaceId,
      name: input.name.trim(),
      targetAmount: input.targetAmount,
      currentAmount: input.currentAmount ?? 0,
      targetDate: input.targetDate ? new Date(input.targetDate) : null
    }
  });
}
