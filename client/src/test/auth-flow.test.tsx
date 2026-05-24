import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthPage } from "../features/auth/AuthPage";

describe("AuthPage", () => {
  it("renders sign in controls", () => {
    render(<AuthPage mode="sign-in" />);
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });
});
