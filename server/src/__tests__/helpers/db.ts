import { prisma } from "../../lib/prisma.js";

export async function resetDatabase() {
  await prisma.plannedExpenseInstance.deleteMany();
  await prisma.recurringExpense.deleteMany();
  await prisma.monthlyBudget.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.savingsGoal.deleteMany();
  await prisma.category.deleteMany();
  await prisma.workspaceInvite.deleteMany();
  await prisma.workspaceMember.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();
}
