/* @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  buildDashboardSnapshot,
  SummaryCards
} from "./summary-cards";

afterEach(() => {
  cleanup();
});

describe("SummaryCards", () => {
  it("shows balance totals", () => {
    render(<SummaryCards income={2500} expenses={800} balance={1700} />);

    expect(screen.getByText("Balance")).toBeTruthy();
    expect(screen.getByText("Money In")).toBeTruthy();
    expect(screen.getByText("Money Out")).toBeTruthy();
    expect(screen.getByText(/1,700\.00/)).toBeTruthy();
  });

  it("derives current-month totals and limits recent items", () => {
    const snapshot = buildDashboardSnapshot(
      [
        {
          id: "tx-1",
          title: "Salary",
          amount: 3500,
          type: "income",
          categoryId: "cat-1",
          categoryName: "Salary",
          transactionDate: "2026-05-21",
          notes: null
        },
        {
          id: "tx-2",
          title: "Groceries",
          amount: 120,
          type: "expense",
          categoryId: "cat-2",
          categoryName: "Food",
          transactionDate: "2026-05-20",
          notes: null
        },
        {
          id: "tx-3",
          title: "Train pass",
          amount: 80,
          type: "expense",
          categoryId: "cat-3",
          categoryName: "Transport",
          transactionDate: "2026-05-19",
          notes: null
        },
        {
          id: "tx-4",
          title: "Cafe",
          amount: 24,
          type: "expense",
          categoryId: "cat-2",
          categoryName: "Food",
          transactionDate: "2026-05-18",
          notes: null
        },
        {
          id: "tx-5",
          title: "Internet",
          amount: 99,
          type: "expense",
          categoryId: "cat-4",
          categoryName: "Bills",
          transactionDate: "2026-05-17",
          notes: null
        },
        {
          id: "tx-6",
          title: "Old month expense",
          amount: 250,
          type: "expense",
          categoryId: "cat-5",
          categoryName: "Shopping",
          transactionDate: "2026-04-30",
          notes: null
        }
      ],
      new Date("2026-05-24T09:00:00.000Z")
    );

    expect(snapshot.income).toBe(3500);
    expect(snapshot.expenses).toBe(323);
    expect(snapshot.balance).toBe(3177);
    expect(snapshot.recentItems).toHaveLength(5);
    expect(snapshot.recentItems.map((item) => item.id)).toEqual([
      "tx-1",
      "tx-2",
      "tx-3",
      "tx-4",
      "tx-5"
    ]);
  });

  it("returns zero totals when only older transactions exist", () => {
    const snapshot = buildDashboardSnapshot(
      [
        {
          id: "tx-9",
          title: "April rent",
          amount: 900,
          type: "expense",
          categoryId: "cat-9",
          categoryName: "Bills",
          transactionDate: "2026-04-01",
          notes: null
        }
      ],
      new Date("2026-05-24T09:00:00.000Z")
    );

    expect(snapshot.income).toBe(0);
    expect(snapshot.expenses).toBe(0);
    expect(snapshot.balance).toBe(0);
    expect(snapshot.recentItems).toHaveLength(1);
  });
});
