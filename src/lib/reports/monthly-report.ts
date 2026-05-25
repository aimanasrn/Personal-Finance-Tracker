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

export type MonthlyReportMonthScope = {
  monthKey: string;
  currentMonthItems: MonthlyReportTransaction[];
  previousMonthItems?: MonthlyReportTransaction[];
};

type ParsedMonthKey = {
  year: number;
  monthIndex: number;
};

function parseMonthKey(monthKey: string): ParsedMonthKey | null {
  const match = monthKey.match(/^(\d{4})-(\d{2})$/);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;

  if (monthIndex < 0 || monthIndex > 11) {
    return null;
  }

  return { year, monthIndex };
}

function toMonthKey({ year, monthIndex }: ParsedMonthKey) {
  return `${year}-${`${monthIndex + 1}`.padStart(2, "0")}`;
}

function createMonthDate(monthKey: string) {
  const parsedMonthKey = parseMonthKey(monthKey);

  if (!parsedMonthKey) {
    return null;
  }

  return new Date(
    Date.UTC(parsedMonthKey.year, parsedMonthKey.monthIndex, 1, 12)
  );
}

function summarizeMonth(
  items: MonthlyReportTransaction[],
  monthKey: string
): MonthlyComparisonSnapshot & {
  byCategory: Record<string, number>;
} {
  const totals = items.reduce(
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
    monthLabel: formatMonthLabel(monthKey),
    transactionCount: items.length,
    totalIncome: totals.totalIncome,
    totalExpenses: totals.totalExpenses,
    balance: totals.totalIncome - totals.totalExpenses,
    byCategory: totals.byCategory
  };
}

function buildTopCategories(
  categoryTotals: Record<string, number>,
  totalExpenses: number
) {
  return Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name,
      amount,
      share: totalExpenses === 0 ? 0 : amount / totalExpenses
    }))
    .sort((left, right) => {
      if (right.amount !== left.amount) {
        return right.amount - left.amount;
      }

      return left.name.localeCompare(right.name);
    });
}

export function isValidMonthKey(monthKey: string | undefined): monthKey is string {
  return typeof monthKey === "string" && parseMonthKey(monthKey) !== null;
}

export function getCurrentMonthKey(referenceDate = new Date()) {
  return toMonthKey({
    year: referenceDate.getFullYear(),
    monthIndex: referenceDate.getMonth()
  });
}

export function formatMonthLabel(monthKey: string) {
  const monthDate = createMonthDate(monthKey);

  if (!monthDate) {
    return monthKey;
  }

  return new Intl.DateTimeFormat("en-MY", {
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(monthDate);
}

export function shiftMonthKey(monthKey: string, offset: number) {
  const parsedMonthKey = parseMonthKey(monthKey);

  if (!parsedMonthKey) {
    return null;
  }

  const shiftedMonthIndex = parsedMonthKey.monthIndex + offset;
  const shiftedYear =
    parsedMonthKey.year + Math.floor(shiftedMonthIndex / 12);
  const normalizedMonthIndex = ((shiftedMonthIndex % 12) + 12) % 12;

  return toMonthKey({
    year: shiftedYear,
    monthIndex: normalizedMonthIndex
  });
}

export function getPreviousMonthKey(monthKey: string) {
  return shiftMonthKey(monthKey, -1);
}

export function createMonthlyReportScope(
  items: MonthlyReportTransaction[],
  monthKey: string
): MonthlyReportMonthScope {
  const previousMonthKey = getPreviousMonthKey(monthKey);

  return {
    monthKey,
    currentMonthItems: items.filter((item) =>
      item.transactionDate.startsWith(monthKey)
    ),
    previousMonthItems: previousMonthKey
      ? items.filter((item) => item.transactionDate.startsWith(previousMonthKey))
      : []
  };
}

export function buildMonthlyReportFromMonths({
  monthKey,
  currentMonthItems,
  previousMonthItems = []
}: MonthlyReportMonthScope): MonthlyReport {
  const currentMonth = summarizeMonth(currentMonthItems, monthKey);
  const previousMonthKey = getPreviousMonthKey(monthKey);
  const previousMonthSnapshot = previousMonthKey
    ? summarizeMonth(previousMonthItems, previousMonthKey)
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

  return {
    monthKey: currentMonth.monthKey,
    monthLabel: currentMonth.monthLabel,
    transactionCount: currentMonth.transactionCount,
    totalIncome: currentMonth.totalIncome,
    totalExpenses: currentMonth.totalExpenses,
    balance: currentMonth.balance,
    topCategories: buildTopCategories(
      currentMonth.byCategory,
      currentMonth.totalExpenses
    ),
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

export function buildMonthlyReport(
  items: MonthlyReportTransaction[],
  reference:
    | Date
    | {
        monthKey: string;
      } = new Date()
): MonthlyReport {
  const monthKey =
    reference instanceof Date ? getCurrentMonthKey(reference) : reference.monthKey;

  return buildMonthlyReportFromMonths(createMonthlyReportScope(items, monthKey));
}
