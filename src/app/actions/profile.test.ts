import { beforeEach, describe, expect, it, vi } from "vitest";

const redirectMock = vi.fn((location: string) => {
  throw new Error(`REDIRECT:${location}`);
});
const requireUserIdMock = vi.fn();
const fromMock = vi.fn();
const revalidatePathMock = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: redirectMock
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock
}));

vi.mock("@/lib/auth/session", () => ({
  requireUserId: requireUserIdMock
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(() => ({
    from: fromMock
  }))
}));

describe("profile actions", () => {
  beforeEach(() => {
    redirectMock.mockClear();
    requireUserIdMock.mockReset();
    fromMock.mockReset();
    revalidatePathMock.mockClear();
    requireUserIdMock.mockResolvedValue("user-123");
  });

  it("updates profile preferences for the authenticated user", async () => {
    const upsertMock = vi.fn().mockResolvedValue({ error: null });
    fromMock.mockImplementation((table: string) => {
      if (table === "profiles") {
        return { upsert: upsertMock };
      }

      throw new Error(`Unexpected table: ${table}`);
    });

    const formData = new FormData();
    formData.set("displayName", "Aiman");
    formData.set("preferredCurrency", "MYR");

    const { updateProfileAction } = await import("./profile");

    await expect(updateProfileAction(formData)).rejects.toThrow(
      "REDIRECT:/settings?message=Preferences+saved."
    );

    expect(upsertMock).toHaveBeenCalledWith(
      {
        user_id: "user-123",
        display_name: "Aiman",
        preferred_currency: "MYR"
      },
      {
        onConflict: "user_id"
      }
    );
    expect(revalidatePathMock).toHaveBeenCalledWith("/settings");
  });

  it("redirects invalid profile submissions back to settings with a friendly message", async () => {
    const formData = new FormData();
    formData.set("displayName", "A");
    formData.set("preferredCurrency", "myr");

    const { updateProfileAction } = await import("./profile");

    await expect(updateProfileAction(formData)).rejects.toThrow(
      /^REDIRECT:\/settings\?error=/
    );

    expect(fromMock).not.toHaveBeenCalled();
  });
});
