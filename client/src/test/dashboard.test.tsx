import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardPage } from "../features/dashboard/DashboardPage";

describe("DashboardPage", () => {
  it("renders budget, goals, and recurring sections", () => {
    render(<DashboardPage />);
    expect(screen.getAllByText("Budget overview").length).toBeGreaterThan(0);
    expect(screen.getByText("Savings goals")).toBeInTheDocument();
    expect(screen.getByText("Planned expenses")).toBeInTheDocument();
  });
});
