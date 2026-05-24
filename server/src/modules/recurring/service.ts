import { ApiError } from "../../lib/http.js";
import { prisma } from "../../lib/prisma.js";

type CreateRecurringExpenseInput = {
  categoryId: string;
  name: string;
  amount: number;
  dayOfMonth: number;
  note?: string;
};

export async function createRecurringExpense(workspaceId: string, input: CreateRecurringExpenseInput) {
  const category = await prisma.category.findFirst({
    where: {
      id: input.categoryId,
      workspaceId
    }
  });

  if (!category) {
    throw new ApiError(404, "CATEGORY_NOT_FOUND");
  }

  return prisma.recurringExpense.create({
    data: {
      workspaceId,
      categoryId: input.categoryId,
      name: input.name.trim(),
      amount: input.amount,
      dayOfMonth: input.dayOfMonth,
      note: input.note?.trim() || null
    }
  });
}

export async function generatePlannedInstances(workspaceId: string, month: number, year: number) {
  const recurringExpenses = await prisma.recurringExpense.findMany({
    where: {
      workspaceId,
      active: true
    }
  });

  return Promise.all(
    recurringExpenses.map((expense) =>
      prisma.plannedExpenseInstance.upsert({
        where: {
          recurringExpenseId_scheduledFor: {
            recurringExpenseId: expense.id,
            scheduledFor: new Date(Date.UTC(year, month - 1, expense.dayOfMonth))
          }
        },
        update: {},
        create: {
          workspaceId,
          recurringExpenseId: expense.id,
          scheduledFor: new Date(Date.UTC(year, month - 1, expense.dayOfMonth))
        }
      })
    )
  );
}

export async function markPlannedExpensePaid(workspaceId: string, instanceId: string) {
  const instance = await prisma.plannedExpenseInstance.findFirst({
    where: {
      id: instanceId,
      workspaceId
    },
    include: {
      recurringExpense: true
    }
  });

  if (!instance || instance.status !== "PENDING") {
    throw new ApiError(409, "INVALID_INSTANCE_STATE");
  }

  const transaction = await prisma.transaction.create({
    data: {
      workspaceId,
      categoryId: instance.recurringExpense.categoryId,
      amount: instance.recurringExpense.amount,
      type: "EXPENSE",
      date: instance.scheduledFor,
      note: instance.recurringExpense.note
    }
  });

  return prisma.plannedExpenseInstance.update({
    where: { id: instance.id },
    data: {
      status: "PAID",
      paidTransactionId: transaction.id
    }
  });
}

export async function markPlannedExpenseSkipped(workspaceId: string, instanceId: string) {
  const updated = await prisma.plannedExpenseInstance.updateMany({
    where: {
      id: instanceId,
      workspaceId,
      status: "PENDING"
    },
    data: {
      status: "SKIPPED"
    }
  });

  if (!updated.count) {
    throw new ApiError(409, "INVALID_INSTANCE_STATE");
  }

  return prisma.plannedExpenseInstance.findUnique({
    where: { id: instanceId }
  });
}
