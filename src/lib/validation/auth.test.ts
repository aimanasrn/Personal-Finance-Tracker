import { describe, expect, it } from "vitest";
import { loginSchema, signUpSchema } from "./auth";

describe("signUpSchema", () => {
  it("rejects a short password", () => {
    const result = signUpSchema.safeParse({
      email: "user@example.com",
      password: "123"
    });

    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts a valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "12345678"
    });

    expect(result.success).toBe(true);
  });
});
