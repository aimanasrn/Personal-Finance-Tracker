import { prisma } from "../../lib/prisma.js";

function monthRange(month: number, year: number) {
  return {
    gte: new Date(Date.UTC(year, month - 1, 1)),
    lt: new Date(Date.UTC(year, month, 1))
  };
}

export async function getDashboardSummary(workspaceId: string, month: number, year: number) {
  const [budgets, transactions, goals, plannedExpenses] = await Promise.all([
    prisma.monthlyBudget.findMany({
      where: { workspaceId, month, year },
      include: { category: true },
      orderBy: { category: { name: "asc" } }
    }),
    prisma.transaction.findMany({
      where: {
        workspaceId,
        type: "EXPENSE",
        date: monthRange(month, year)
      }
    }),
    prisma.savingsGoal.findMany({
      where: { workspaceId },
      orderBy: { name: "asc" }
    }),
    prisma.plannedExpenseInstance.findMany({
      where: {
        workspaceId,
        scheduledFor: monthRange(month, year)
      },
      include: {
        recurringExpense: true
      },
      orderBy: { scheduledFor: "asc" }
    })
  ]);

  return {
    budgets,
    spentTotal: transactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0),
    goals,
    plannedExpenses
  };
}
