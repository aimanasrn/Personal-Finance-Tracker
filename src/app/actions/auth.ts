"use server";

import { redirect } from "next/navigation";
import { AuthApiError } from "@supabase/supabase-js";
import { clearSession, persistSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loginSchema, signUpSchema } from "@/lib/validation/auth";

const AUTH_RATE_LIMIT_WINDOW_MS = 60_000;
const AUTH_RATE_LIMIT_MAX_ATTEMPTS = 5;
const authAttemptLog = new Map<string, number[]>();

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : undefined;
}

function parseSignUpPayload(formData: FormData) {
  return signUpSchema.safeParse({
    email: getFormValue(formData, "email"),
    password: getFormValue(formData, "password")
  });
}

function parseLoginPayload(formData: FormData) {
  return loginSchema.safeParse({
    email: getFormValue(formData, "email"),
    password: getFormValue(formData, "password")
  });
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeAuthPayload<T extends { email: string; password: string }>(
  payload: T
) {
  return {
    ...payload,
    email: normalizeEmail(payload.email)
  };
}

function buildAuthRateLimitKey(action: "login" | "signup", email: string) {
  return `${action}:${normalizeEmail(email)}`;
}

function consumeAuthAttempt(action: "login" | "signup", email: string) {
  const now = Date.now();
  const key = buildAuthRateLimitKey(action, email);
  const attempts =
    authAttemptLog
      .get(key)
      ?.filter((timestamp) => now - timestamp < AUTH_RATE_LIMIT_WINDOW_MS) ?? [];

  if (attempts.length >= AUTH_RATE_LIMIT_MAX_ATTEMPTS) {
    authAttemptLog.set(key, attempts);
    return false;
  }

  attempts.push(now);
  authAttemptLog.set(key, attempts);
  return true;
}

function clearAuthAttempts(action: "login" | "signup", email: string) {
  authAttemptLog.delete(buildAuthRateLimitKey(action, email));
}

function getAuthErrorMessage(error: unknown) {
  if (error instanceof AuthApiError) {
    const message = error.message.toLowerCase();

    if (message.includes("invalid login credentials")) {
      return "Incorrect email or password.";
    }

    if (
      message.includes("user already registered") ||
      message.includes("already been registered")
    ) {
      return "That email is already registered. Log in instead or use another email.";
    }

    if (message.includes("email not confirmed")) {
      return "Check your email to confirm your account before logging in.";
    }

    return "We couldn't verify your account details right now. Please try again.";
  }

  return "We couldn't complete that authentication step right now. Please try again.";
}

function buildAuthRedirect(pathname: string, key: string, value: string) {
  const searchParams = new URLSearchParams({ [key]: value });
  return `${pathname}?${searchParams.toString()}`;
}

export async function signUpAction(formData: FormData): Promise<void> {
  const payload = parseSignUpPayload(formData);

  if (!payload.success) {
    redirect(
      buildAuthRedirect(
        "/signup",
        "error",
        payload.error.issues[0]?.message ?? "Invalid sign up details."
      )
    );
  }

  const normalizedPayload = normalizeAuthPayload(payload.data);

  if (!consumeAuthAttempt("signup", normalizedPayload.email)) {
    redirect(
      buildAuthRedirect(
        "/signup",
        "error",
        "Too many sign-up attempts. Please wait a minute before trying again."
      )
    );
  }

  let data:
    | Awaited<ReturnType<ReturnType<typeof createServerSupabaseClient>["auth"]["signUp"]>>["data"]
    | null = null;

  try {
    const supabase = createServerSupabaseClient();
    const result = await supabase.auth.signUp(normalizedPayload);

    if (result.error) {
      redirect(
        buildAuthRedirect("/signup", "error", getAuthErrorMessage(result.error))
      );
    }

    data = result.data;
  } catch (error) {
    redirect(
      buildAuthRedirect("/signup", "error", getAuthErrorMessage(error))
    );
  }

  await persistSession(data?.session ?? null);
  clearAuthAttempts("signup", normalizedPayload.email);

  if (data?.session) {
    redirect("/dashboard");
  }

  redirect(
    buildAuthRedirect(
      "/login",
      "message",
      "Check your email to confirm your account before logging in."
    )
  );
}

export async function loginAction(formData: FormData): Promise<void> {
  const payload = parseLoginPayload(formData);

  if (!payload.success) {
    redirect(
      buildAuthRedirect(
        "/login",
        "error",
        payload.error.issues[0]?.message ?? "Invalid login details."
      )
    );
  }

  const normalizedPayload = normalizeAuthPayload(payload.data);

  if (!consumeAuthAttempt("login", normalizedPayload.email)) {
    redirect(
      buildAuthRedirect(
        "/login",
        "error",
        "Too many login attempts. Please wait a minute before trying again."
      )
    );
  }

  let data:
    | Awaited<
        ReturnType<
          ReturnType<typeof createServerSupabaseClient>["auth"]["signInWithPassword"]
        >
      >["data"]
    | null = null;

  try {
    const supabase = createServerSupabaseClient();
    const result = await supabase.auth.signInWithPassword(normalizedPayload);

    if (result.error) {
      redirect(
        buildAuthRedirect("/login", "error", getAuthErrorMessage(result.error))
      );
    }

    data = result.data;
  } catch (error) {
    redirect(buildAuthRedirect("/login", "error", getAuthErrorMessage(error)));
  }

  if (!data?.session) {
    await clearSession();
    redirect(
      buildAuthRedirect(
        "/login",
        "error",
        "We couldn't start your session. Please try again."
      )
    );
  }

  await persistSession(data.session);
  clearAuthAttempts("login", normalizedPayload.email);
  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
  await clearSession();
  redirect("/login");
}
