import { ProtectedAppShell } from "@/components/layout/app-shell";

export default async function SettingsPage() {
  return (
    <ProtectedAppShell
      currentPath="/settings"
      title="Settings"
      description="Keep account preferences, profile details, and future session controls in one predictable place."
    >
      <section className="grid gap-6">
        <article className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">Profile</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Manage your display name and preferred currency once profile fields
            are connected to stored user settings.
          </p>
        </article>
        <article className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">Security</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Password reset, email verification, and session controls can build
            on top of this protected shell later in the MVP.
          </p>
        </article>
      </section>
    </ProtectedAppShell>
  );
}
