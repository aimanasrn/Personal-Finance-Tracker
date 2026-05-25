const SUPABASE_REST_PATH = "/rest/v1";

export function normalizeSupabaseUrl(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return trimmedValue;
  }

  if (!trimmedValue.includes(SUPABASE_REST_PATH)) {
    return trimmedValue.replace(/\/+$/, "");
  }

  const [baseUrl] = trimmedValue.split(SUPABASE_REST_PATH);
  return baseUrl.replace(/\/+$/, "");
}
