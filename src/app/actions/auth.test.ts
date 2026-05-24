import { beforeEach, describe, expect, it, vi } from "vitest";

const clearSessionMock = vi.fn();
const persistSessionMock = vi.fn();
const signInWithPasswordMock = vi.fn();
const signOutMock = vi.fn();
const signUpMock = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: vi.fn((location: string) => {
    throw new Error(`REDIRECT:${location}`);
  })
}));

vi.mock("@/lib/auth/session", () => ({
  clearSession: clearSessionMock,
  persistSession: persistSessionMock
}));

vi.mock("@/lib/validation/auth", async () => {
  const actual = await import("../../lib/validation/auth");
  return actual;
});

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(() => ({
    auth: {
      signInWithPassword: signInWithPasswordMock,
      signOut: signOutMock,
      signUp: signUpMock
    }
  }))
}));

describe("auth actions", () => {
  beforeEach(() => {
    clearSessionMock.mockReset();
    persistSessionMock.mockReset();
    signInWithPasswordMock.mockReset();
    signOutMock.mockReset();
    signUpMock.mockReset();
  });

  it("redirects malformed signup form data back to signup instead of throwing a server error", async () => {
    const formData = new FormData();
    formData.set("password", "12345678");

    const { signUpAction } = await import("./auth");

    await expect(signUpAction(formData)).rejects.toThrow(
      /^REDIRECT:\/signup\?error=/
    );
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it("signs out from Supabase before clearing the local session", async () => {
    signOutMock.mockResolvedValue({ error: null });

    const { logoutAction } = await import("./auth");

    await expect(logoutAction()).rejects.toThrow("REDIRECT:/login");
    expect(signOutMock).toHaveBeenCalledTimes(1);
    expect(clearSessionMock).toHaveBeenCalledTimes(1);
    expect(signOutMock.mock.invocationCallOrder[0]).toBeLessThan(
      clearSessionMock.mock.invocationCallOrder[0]
    );
  });
});
