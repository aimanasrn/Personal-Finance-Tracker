import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PlannedExpenseList } from "../features/recurring/PlannedExpenseList";

describe("PlannedExpenseList", () => {
  it("renders paid and skip actions", () => {
    render(
      <PlannedExpenseList
        items={[
          { id: "1", name: "Rent", amount: 800, scheduledFor: "2026-05-01", status: "PENDING" }
        ]}
      />
    );

    expect(screen.getByRole("button", { name: "Mark paid" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Skip" })).toBeInTheDocument();
  });
});
