import { describe, expect, it } from "vitest";
import { normalizeSupabaseUrl } from "./url";

describe("normalizeSupabaseUrl", () => {
  it("keeps a project base URL unchanged", () => {
    expect(normalizeSupabaseUrl("https://example.supabase.co")).toBe(
      "https://example.supabase.co"
    );
  });

  it("strips the REST path from a Supabase REST endpoint URL", () => {
    expect(
      normalizeSupabaseUrl("https://example.supabase.co/rest/v1/")
    ).toBe("https://example.supabase.co");
  });
});
