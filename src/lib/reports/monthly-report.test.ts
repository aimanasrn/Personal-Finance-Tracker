import { describe, expect, it } from "vitest";
import { buildMonthlyReport } from "./monthly-report";

describe("buildMonthlyReport", () => {
  it("computes totals for the selected month", () => {
    const report = buildMonthlyReport(
      [
        {
          id: "tx-1",
          title: "Salary",
          amount: 4200,
          type: "income",
          categoryName: "Salary",
          transactionDate: "2026-05-02"
        },
        {
          id: "tx-2",
          title: "Groceries",
          amount: 180,
          type: "expense",
          categoryName: "Food",
          transactionDate: "2026-05-03"
        },
        {
          id: "tx-3",
          title: "April rent",
          amount: 900,
          type: "expense",
          categoryName: "Bills",
          transactionDate: "2026-04-29"
        }
      ],
      new Date("2026-05-24T09:00:00.000Z")
    );

    expect(report.monthKey).toBe("2026-05");
    expect(report.totalIncome).toBe(4200);
    expect(report.totalExpenses).toBe(180);
    expect(report.balance).toBe(4020);
    expect(report.transactionCount).toBe(2);
  });

  it("aggregates expense categories in descending order", () => {
    const report = buildMonthlyReport(
      [
        {
          id: "tx-1",
          title: "Brunch",
          amount: 48,
          type: "expense",
          categoryName: "Food",
          transactionDate: "2026-05-08"
        },
        {
          id: "tx-2",
          title: "Bus pass",
          amount: 120,
          type: "expense",
          categoryName: "Transport",
          transactionDate: "2026-05-09"
        },
        {
          id: "tx-3",
          title: "Dinner",
          amount: 36,
          type: "expense",
          categoryName: "Food",
          transactionDate: "2026-05-10"
        },
        {
          id: "tx-4",
          title: "Side project",
          amount: 600,
          type: "income",
          categoryName: "Freelance",
          transactionDate: "2026-05-11"
        }
      ],
      new Date("2026-05-24T09:00:00.000Z")
    );

    expect(report.topCategories).toEqual([
      { name: "Transport", amount: 120, share: 120 / 204 },
      { name: "Food", amount: 84, share: 84 / 204 }
    ]);
  });

  it("returns empty category insights when the month has no expenses", () => {
    const report = buildMonthlyReport(
      [
        {
          id: "tx-1",
          title: "Salary",
          amount: 3000,
          type: "income",
          categoryName: "Salary",
          transactionDate: "2026-05-01"
        }
      ],
      new Date("2026-05-24T09:00:00.000Z")
    );

    expect(report.totalIncome).toBe(3000);
    expect(report.totalExpenses).toBe(0);
    expect(report.topCategories).toEqual([]);
  });

  it("builds the report for an explicit month key instead of always using the current month", () => {
    const report = buildMonthlyReport(
      [
        {
          id: "tx-1",
          title: "May salary",
          amount: 3200,
          type: "income",
          categoryName: "Salary",
          transactionDate: "2026-05-05"
        },
        {
          id: "tx-2",
          title: "April salary",
          amount: 3000,
          type: "income",
          categoryName: "Salary",
          transactionDate: "2026-04-05"
        },
        {
          id: "tx-3",
          title: "April groceries",
          amount: 210,
          type: "expense",
          categoryName: "Food",
          transactionDate: "2026-04-12"
        }
      ],
      { monthKey: "2026-04" }
    );

    expect(report.monthKey).toBe("2026-04");
    expect(report.totalIncome).toBe(3000);
    expect(report.totalExpenses).toBe(210);
    expect(report.balance).toBe(2790);
    expect(report.transactionCount).toBe(2);
  });

  it("includes month-over-month comparisons when prior-month data exists", () => {
    const report = buildMonthlyReport(
      [
        {
          id: "tx-1",
          title: "May salary",
          amount: 4200,
          type: "income",
          categoryName: "Salary",
          transactionDate: "2026-05-01"
        },
        {
          id: "tx-2",
          title: "May rent",
          amount: 1200,
          type: "expense",
          categoryName: "Housing",
          transactionDate: "2026-05-02"
        },
        {
          id: "tx-3",
          title: "May groceries",
          amount: 300,
          type: "expense",
          categoryName: "Food",
          transactionDate: "2026-05-08"
        },
        {
          id: "tx-4",
          title: "April salary",
          amount: 4000,
          type: "income",
          categoryName: "Salary",
          transactionDate: "2026-04-01"
        },
        {
          id: "tx-5",
          title: "April rent",
          amount: 1100,
          type: "expense",
          categoryName: "Housing",
          transactionDate: "2026-04-02"
        }
      ],
      { monthKey: "2026-05" }
    );

    expect(report.previousMonth).toEqual({
      monthKey: "2026-04",
      monthLabel: "April 2026",
      totalIncome: 4000,
      totalExpenses: 1100,
      balance: 2900,
      transactionCount: 2
    });
    expect(report.comparison).toEqual({
      incomeDelta: 200,
      expensesDelta: 400,
      balanceDelta: -200
    });
  });

  it("omits month-over-month comparison when the prior month has no transactions", () => {
    const report = buildMonthlyReport(
      [
        {
          id: "tx-1",
          title: "May salary",
          amount: 4200,
          type: "income",
          categoryName: "Salary",
          transactionDate: "2026-05-01"
        }
      ],
      { monthKey: "2026-05" }
    );

    expect(report.previousMonth).toBeNull();
    expect(report.comparison).toBeNull();
  });
});
