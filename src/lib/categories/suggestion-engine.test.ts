import { describe, expect, it } from "vitest";
import { transactionSchema } from "../validation/transactions";
import { suggestCategory } from "./suggestion-engine";

describe("suggestCategory", () => {
  it("suggests Transport for Grab", () => {
    expect(suggestCategory("Grab ride home")).toEqual({
      lookupKey: {
        isDefault: true,
        name: "Transport",
        type: "expense"
      },
      matchedKeyword: "grab",
      priority: 10
    });
  });

  it("prefers the highest-priority keyword match", () => {
    expect(suggestCategory("Salary from freelance client")).toEqual({
      lookupKey: {
        isDefault: true,
        name: "Salary",
        type: "income"
      },
      matchedKeyword: "salary",
      priority: 5
    });
  });

  it("returns null when no keyword matches", () => {
    expect(suggestCategory("Random merchant")).toBeNull();
  });
});

describe("transactionSchema", () => {
  it("rejects impossible calendar dates", () => {
    const result = transactionSchema.safeParse({
      title: "Grab ride home",
      amount: "12.50",
      type: "expense",
      categoryId: "550e8400-e29b-41d4-a716-446655440000",
      transactionDate: "2026-13-40"
    });

    expect(result.success).toBe(false);
  });
});
