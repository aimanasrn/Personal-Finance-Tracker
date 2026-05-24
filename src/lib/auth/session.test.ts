import { beforeEach, describe, expect, it, vi } from "vitest";

const cookieStore = {
  delete: vi.fn(),
  get: vi.fn(),
  set: vi.fn()
};

const getUserMock = vi.fn();
const refreshSessionMock = vi.fn();

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => cookieStore)
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(() => ({
    auth: {
      getUser: getUserMock,
      refreshSession: refreshSessionMock
    }
  }))
}));

describe("getCurrentUser", () => {
  beforeEach(() => {
    cookieStore.delete.mockReset();
    cookieStore.get.mockReset();
    cookieStore.set.mockReset();
    getUserMock.mockReset();
    refreshSessionMock.mockReset();
  });

  it("refreshes an expired access token by using the stored refresh token", async () => {
    cookieStore.get.mockImplementation((name: string) => {
      if (name === "cashnest-access-token") {
        return { value: "expired-access-token" };
      }

      if (name === "cashnest-refresh-token") {
        return { value: "refresh-token" };
      }

      return undefined;
    });

    getUserMock.mockResolvedValue({
      data: { user: null },
      error: { message: "JWT expired" }
    });
    refreshSessionMock.mockResolvedValue({
      data: {
        session: {
          access_token: "fresh-access-token",
          expires_in: 3600,
          refresh_token: "fresh-refresh-token",
          token_type: "bearer",
          user: { id: "user-123" }
        },
        user: { id: "user-123" }
      },
      error: null
    });

    const { getCurrentUser } = await import("./session");
    const user = await getCurrentUser();

    expect(refreshSessionMock).toHaveBeenCalledWith({
      refresh_token: "refresh-token"
    });
    expect(cookieStore.set).toHaveBeenCalledTimes(2);
    expect(user).toEqual({ id: "user-123" });
  });
});
