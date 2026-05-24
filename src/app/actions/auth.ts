"use server";

import { redirect } from "next/navigation";
import { AuthApiError } from "@supabase/supabase-js";
import { clearSession, persistSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loginSchema, signUpSchema } from "@/lib/validation/auth";

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

function getAuthErrorMessage(error: unknown) {
  if (error instanceof AuthApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
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

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp(payload.data);

  if (error) {
    redirect(buildAuthRedirect("/signup", "error", getAuthErrorMessage(error)));
  }

  await persistSession(data.session);

  if (data.session) {
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

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword(payload.data);

  if (error) {
    redirect(buildAuthRedirect("/login", "error", getAuthErrorMessage(error)));
  }

  await persistSession(data.session);
  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
  await clearSession();
  redirect("/login");
}
