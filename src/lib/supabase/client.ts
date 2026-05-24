import { createClient } from "@supabase/supabase-js";

let browserSupabaseClient:
  | ReturnType<typeof createClient>
  | undefined;

function getSupabaseUrl() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!value) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
  }

  return value;
}

function getSupabaseAnonKey() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!value) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured.");
  }

  return value;
}

export function createBrowserSupabaseClient() {
  if (!browserSupabaseClient) {
    browserSupabaseClient = createClient(
      getSupabaseUrl(),
      getSupabaseAnonKey()
    );
  }

  return browserSupabaseClient;
}
