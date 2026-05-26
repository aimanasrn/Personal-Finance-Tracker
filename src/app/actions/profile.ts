"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { getSessionAccessToken, requireUserId } from "@/lib/auth/session";
import { ProfileRecord } from "@/lib/db/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { logServerError } from "../../lib/monitoring/server-log";
import { profileSchema } from "../../lib/validation/profile";

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

function buildRedirect(pathname: string, key: "message" | "error", value: string) {
  const searchParams = new URLSearchParams({ [key]: value });
  return `${pathname}?${searchParams.toString()}`;
}

function getProfileErrorMessage(error: unknown) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Unable to save profile preferences.";
  }

  return "Unable to save profile preferences right now. Please try again.";
}

export async function getProfile(userId: string) {
  const accessToken = await getSessionAccessToken();
  const supabase = createServerSupabaseClient(
    accessToken ? { accessToken } : undefined
  );
  const { data, error } = await supabase
    .from("profiles")
    .select("display_name, preferred_currency")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as Pick<
    ProfileRecord,
    "display_name" | "preferred_currency"
  > | null) ?? null;
}

export async function updateProfileAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const accessToken = await getSessionAccessToken();

  let payload: ReturnType<typeof profileSchema.parse>;

  try {
    payload = profileSchema.parse({
      displayName: getFormValue(formData, "displayName"),
      preferredCurrency: getFormValue(formData, "preferredCurrency")
    });
  } catch (error) {
    redirect(
      buildRedirect("/settings", "error", getProfileErrorMessage(error))
    );
  }

  try {
    const supabase = createServerSupabaseClient(
      accessToken ? { accessToken } : undefined
    );
    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: userId,
        display_name: payload.displayName,
        preferred_currency: payload.preferredCurrency
      },
      {
        onConflict: "user_id"
      }
    );

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    logServerError("settings.update-profile", error, { userId });
    redirect(
      buildRedirect("/settings", "error", getProfileErrorMessage(error))
    );
  }

  revalidatePath("/settings");
  redirect(buildRedirect("/settings", "message", "Preferences saved."));
}
