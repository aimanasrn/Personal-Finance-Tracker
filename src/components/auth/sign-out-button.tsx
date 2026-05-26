"use client";

import { useFormStatus } from "react-dom";

export function SignOutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="interactive-lift inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Signing out..." : "Sign out"}
    </button>
  );
}
