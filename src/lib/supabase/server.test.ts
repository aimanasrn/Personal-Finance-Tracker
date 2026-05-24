import { afterEach, describe, expect, it } from "vitest";

const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const originalAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const originalServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

describe("createServerSupabaseClient", () => {
  afterEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalAnonKey;
    process.env.SUPABASE_SERVICE_ROLE_KEY = originalServiceRoleKey;
  });

  it("requires the anon key instead of falling back to the service role key", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";

    const { createServerSupabaseClient } = await import("./server");

    expect(() => createServerSupabaseClient()).toThrow(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured."
    );
  });
});
