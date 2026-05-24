import type { TransactionType } from "@/lib/db/types";

export type MonthlyReportTransaction = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryName: string;
  transactionDate: string;
};

export type MonthlyCategoryTotal = {
  name: string;
  amount: number;
  share: number;
};

export type MonthlyComparisonSnapshot = {
  monthKey: string;
  monthLabel: string;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
};

export type MonthlyReport = {
  monthKey: string;
  monthLabel: string;
  transactionCount: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  topCategories: MonthlyCategoryTotal[];
  previousMonth: MonthlyComparisonSnapshot | null;
  comparison:
    | {
        incomeDelta: number;
        expensesDelta: number;
        balanceDelta: number;
      }
    | null;
};

function getMonthKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

function parseMonthKey(monthKey: string) {
  const match = monthKey.match(/^(\d{4})-(\d{2})$/);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;

  if (monthIndex < 0 || monthIndex > 11) {
    return null;
  }

  return new Date(Date.UTC(year, monthIndex, 1));
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-MY", {
    month: "long",
    year: "numeric"
  }).format(date);
}

function getPreviousMonthKey(monthKey: string) {
  const monthDate = parseMonthKey(monthKey);

  if (!monthDate) {
    return null;
  }

  monthDate.setUTCMonth(monthDate.getUTCMonth() - 1);
  return getMonthKey(monthDate);
}

function buildMonthSnapshot(
  items: MonthlyReportTransaction[],
  monthKey: string
): MonthlyComparisonSnapshot & {
  byCategory: Record<string, number>;
} {
  const monthDate = parseMonthKey(monthKey) ?? new Date(`${monthKey}-01T00:00:00.000Z`);
  const monthItems = items.filter((item) => item.transactionDate.startsWith(monthKey));
  const totals = monthItems.reduce(
    (summary, item) => {
      if (item.type === "income") {
        summary.totalIncome += item.amount;
      } else {
        summary.totalExpenses += item.amount;
        summary.byCategory[item.categoryName] =
          (summary.byCategory[item.categoryName] ?? 0) + item.amount;
      }

      return summary;
    },
    {
      totalIncome: 0,
      totalExpenses: 0,
      byCategory: {} as Record<string, number>
    }
  );

  return {
    monthKey,
    monthLabel: formatMonthLabel(monthDate),
    transactionCount: monthItems.length,
    totalIncome: totals.totalIncome,
    totalExpenses: totals.totalExpenses,
    balance: totals.totalIncome - totals.totalExpenses,
    byCategory: totals.byCategory
  };
}

export function buildMonthlyReport(
  items: MonthlyReportTransaction[],
  reference:
    | Date
    | {
        monthKey: string;
      } = new Date()
): MonthlyReport {
  const monthKey =
    reference instanceof Date ? getMonthKey(reference) : reference.monthKey;
  const currentMonth = buildMonthSnapshot(items, monthKey);
  const previousMonthKey = getPreviousMonthKey(monthKey);
  const previousMonthSnapshot = previousMonthKey
    ? buildMonthSnapshot(items, previousMonthKey)
    : null;
  const previousMonth =
    previousMonthSnapshot && previousMonthSnapshot.transactionCount > 0
      ? {
          monthKey: previousMonthSnapshot.monthKey,
          monthLabel: previousMonthSnapshot.monthLabel,
          totalIncome: previousMonthSnapshot.totalIncome,
          totalExpenses: previousMonthSnapshot.totalExpenses,
          balance: previousMonthSnapshot.balance,
          transactionCount: previousMonthSnapshot.transactionCount
        }
      : null;

  const topCategories = Object.entries(currentMonth.byCategory)
    .map(([name, amount]) => ({
      name,
      amount,
      share: currentMonth.totalExpenses === 0 ? 0 : amount / currentMonth.totalExpenses
    }))
    .sort((left, right) => {
      if (right.amount !== left.amount) {
        return right.amount - left.amount;
      }

      return left.name.localeCompare(right.name);
    });

  return {
    monthKey: currentMonth.monthKey,
    monthLabel: currentMonth.monthLabel,
    transactionCount: currentMonth.transactionCount,
    totalIncome: currentMonth.totalIncome,
    totalExpenses: currentMonth.totalExpenses,
    balance: currentMonth.balance,
    topCategories,
    previousMonth,
    comparison: previousMonth
      ? {
          incomeDelta: currentMonth.totalIncome - previousMonth.totalIncome,
          expensesDelta:
            currentMonth.totalExpenses - previousMonth.totalExpenses,
          balanceDelta: currentMonth.balance - previousMonth.balance
        }
      : null
  };
}
