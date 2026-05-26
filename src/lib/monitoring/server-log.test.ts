import { afterEach, describe, expect, it, vi } from "vitest";

const errorMock = vi.spyOn(console, "error").mockImplementation(() => {});

describe("logServerError", () => {
  afterEach(() => {
    errorMock.mockClear();
  });

  it("logs a structured server error payload", async () => {
    const { logServerError } = await import("./server-log");

    logServerError("auth.login", new Error("boom"), {
      email: "user@example.com"
    });

    expect(errorMock).toHaveBeenCalledTimes(1);
    expect(errorMock.mock.calls[0]?.[0]).toContain("[server:auth.login]");
  });
});
