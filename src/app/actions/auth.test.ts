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

  it("normalizes the login payload before sending it to Supabase", async () => {
    signInWithPasswordMock.mockResolvedValue({
      data: {
        session: {
          access_token: "access-token",
          refresh_token: "refresh-token"
        }
      },
      error: null
    });

    const formData = new FormData();
    formData.set("email", "  USER@Example.COM  ");
    formData.set("password", "cashnest-pass-123");

    const { loginAction } = await import("./auth");

    await expect(loginAction(formData)).rejects.toThrow("REDIRECT:/dashboard");
    expect(signInWithPasswordMock).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "cashnest-pass-123"
    });
  });

  it("redirects login attempts with a friendly message when authentication does not create a session", async () => {
    signInWithPasswordMock.mockResolvedValue({
      data: {
        session: null
      },
      error: null
    });

    const formData = new FormData();
    formData.set("email", "person@example.com");
    formData.set("password", "cashnest-pass-123");

    const { loginAction } = await import("./auth");

    await expect(loginAction(formData)).rejects.toThrow(
      "REDIRECT:/login?error=We+couldn%27t+start+your+session.+Please+try+again."
    );
    expect(persistSessionMock).not.toHaveBeenCalled();
  });

  it("rate limits repeated login attempts before calling Supabase again", async () => {
    signInWithPasswordMock.mockResolvedValue({
      data: {
        session: null
      },
      error: null
    });

    const formData = new FormData();
    formData.set("email", "slow-down@example.com");
    formData.set("password", "cashnest-pass-123");

    const { loginAction } = await import("./auth");

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await expect(loginAction(formData)).rejects.toThrow(
        "REDIRECT:/login?error=We+couldn%27t+start+your+session.+Please+try+again."
      );
    }

    await expect(loginAction(formData)).rejects.toThrow(
      "REDIRECT:/login?error=Too+many+login+attempts.+Please+wait+a+minute+before+trying+again."
    );
    expect(signInWithPasswordMock).toHaveBeenCalledTimes(5);
  });
});
