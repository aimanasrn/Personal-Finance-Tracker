import type { Session, User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const ACCESS_TOKEN_COOKIE = "cashnest-access-token";
const REFRESH_TOKEN_COOKIE = "cashnest-refresh-token";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function readTokenCookie(rawValue: string, objectKey: string) {
  const directToken = extractString(rawValue);

  if (directToken) {
    return directToken;
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;

    if (Array.isArray(parsed)) {
      const [token] = parsed;
      return extractString(token);
    }

    if (isRecord(parsed)) {
      return extractString(parsed[objectKey]) ?? extractString(parsed[0]);
    }
  } catch {
    return null;
  }

  return null;
}

function readAccessTokenCookie(rawValue: string) {
  return readTokenCookie(rawValue, "access_token");
}

function readRefreshTokenCookie(rawValue: string) {
  return readTokenCookie(rawValue, "refresh_token");
}

export async function getSessionAccessToken() {
  const cookieStore = await cookies();

  return readAccessTokenCookie(
    cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? ""
  );
}

export async function persistSession(session: Session | null) {
  const cookieStore = await cookies();

  if (!session) {
    cookieStore.delete(ACCESS_TOKEN_COOKIE);
    cookieStore.delete(REFRESH_TOKEN_COOKIE);
    return;
  }

  const maxAge = session.expires_in ?? 60 * 60;

  cookieStore.set(ACCESS_TOKEN_COOKIE, session.access_token, {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, session.refresh_token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

export async function clearSession() {
  await persistSession(null);
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const accessToken = await getSessionAccessToken();
  const refreshToken = readRefreshTokenCookie(
    cookieStore.get(REFRESH_TOKEN_COOKIE)?.value ?? ""
  );

  const supabase = createServerSupabaseClient(
    accessToken ? { accessToken } : undefined
  );

  if (!accessToken && !refreshToken) {
    return null;
  }

  if (accessToken) {
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (!error && data.user) {
      return data.user;
    }
  }

  if (!refreshToken) {
    await clearSession();
    return null;
  }

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken
  });

  if (error || !data.session || !data.user) {
    await clearSession();
    return null;
  }

  await persistSession(data.session);
  return data.user;
}

export async function requireUserId() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user.id;
}
