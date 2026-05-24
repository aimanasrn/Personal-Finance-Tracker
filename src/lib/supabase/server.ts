import { createClient } from "@supabase/supabase-js";

type ServerSupabaseOptions = {
  accessToken?: string;
};

function getSupabaseUrl() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!value) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
  }

  return value;
}

function getServerSupabaseKey() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!value) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured.");
  }

  return value;
}

export function createServerSupabaseClient(
  options: ServerSupabaseOptions = {}
) {
  const accessToken = options.accessToken?.trim();

  return createClient(getSupabaseUrl(), getServerSupabaseKey(), {
    global: accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      : undefined,
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
