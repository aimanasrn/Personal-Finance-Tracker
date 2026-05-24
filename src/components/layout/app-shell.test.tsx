/* @vitest-environment jsdom */

import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { requireUserIdMock } = vi.hoisted(() => ({
  requireUserIdMock: vi.fn()
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}));

vi.mock("../../lib/auth/session", () => ({
  requireUserId: requireUserIdMock
}));

import { AppShell, ProtectedAppShell } from "./app-shell";

afterEach(() => {
  cleanup();
});

describe("AppShell", () => {
  it("renders the shared navigation contract for desktop and mobile", () => {
    render(
      <AppShell currentPath="/dashboard" title="Dashboard">
        <div>Body</div>
      </AppShell>
    );

    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeTruthy();
    expect(screen.getByText("Body")).toBeTruthy();

    const navs = screen.getAllByRole("navigation", { name: "Primary" });

    expect(navs).toHaveLength(2);

    for (const nav of navs) {
      expect(
        within(nav).getByRole("link", { name: "Dashboard" })
      ).toBeTruthy();
      expect(
        within(nav).getByRole("link", { name: "Transactions" })
      ).toBeTruthy();
      expect(within(nav).getByRole("link", { name: "Reports" })).toBeTruthy();
      expect(
        within(nav).getByRole("link", { name: "Settings" })
      ).toBeTruthy();
    }
  });

  it("marks the parent section active for nested routes", () => {
    render(
      <AppShell currentPath="/transactions/new" title="New transaction">
        <div>Body</div>
      </AppShell>
    );

    const transactionLinks = screen.getAllByRole("link", {
      name: "Transactions"
    });
    const dashboardLinks = screen.getAllByRole("link", { name: "Dashboard" });

    expect(transactionLinks).toHaveLength(2);

    for (const link of transactionLinks) {
      expect(link.getAttribute("aria-current")).toBe("page");
    }

    for (const link of dashboardLinks) {
      expect(link.getAttribute("aria-current")).toBeNull();
    }
  });

  it("provides the authenticated user id to function children", async () => {
    requireUserIdMock.mockResolvedValueOnce("user-123");

    render(
      await ProtectedAppShell({
        currentPath: "/dashboard",
        title: "Dashboard",
        children: (userId) => <div>User: {userId}</div>
      })
    );

    expect(requireUserIdMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText("User: user-123")).toBeTruthy();
  });
});
