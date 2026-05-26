import { getProfile, updateProfileAction } from "@/app/actions/profile";
import { ProtectedAppShell } from "@/components/layout/app-shell";
import { logServerError } from "@/lib/monitoring/server-log";

type SettingsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function readSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const message = readSearchParam(resolvedSearchParams, "message");
  const error = readSearchParam(resolvedSearchParams, "error");

  return (
    <ProtectedAppShell
      currentPath="/settings"
      title="Settings"
      description="Keep account preferences, profile details, and future session controls in one predictable place."
    >
      {async (userId) => {
        let profile = null;
        let loadError: string | null = null;

        try {
          profile = await getProfile(userId);
        } catch (profileError) {
          logServerError("settings.load-profile", profileError, { userId });
          loadError = "Unable to load saved profile preferences right now.";
        }

        const displayName = profile?.display_name ?? "";
        const preferredCurrency = profile?.preferred_currency ?? "MYR";

        return (
          <section className="grid gap-6">
            {message ? (
              <p className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </p>
            ) : null}

            {error || loadError ? (
              <p className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error ?? loadError}
              </p>
            ) : null}

            <article className="glass-panel section-reveal overflow-hidden rounded-[1.75rem]">
              <div className="mesh-header px-6 py-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
                  Account snapshot
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                  Personalize how CashNest feels each time you return
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Save your display name and preferred currency now that profile
                  persistence is wired into the MVP.
                </p>
              </div>
              <dl className="grid gap-4 border-t border-slate-100 px-6 py-6 md:grid-cols-3">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                    Signed-in identity
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-slate-900">
                    {userId.slice(0, 8)}...
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                    Display name
                  </dt>
                  <dd className="mt-2 text-sm text-slate-700">
                    {displayName || "Not saved yet"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                    Preferred currency
                  </dt>
                  <dd className="mt-2 text-sm text-slate-700">
                    {preferredCurrency}
                  </dd>
                </div>
              </dl>
            </article>

            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <article className="glass-panel section-reveal section-reveal-delay-1 rounded-[1.75rem] p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Profile</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      These settings shape the identity and money context shown in your workspace.
                    </p>
                  </div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                    Saved to Supabase
                  </p>
                </div>

                <form
                  action={updateProfileAction}
                  className="mt-6 grid gap-5 md:grid-cols-2"
                >
                  <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                    Display name
                    <input
                      required
                      name="displayName"
                      defaultValue={displayName}
                      placeholder="Aiman"
                      className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Preferred currency
                    <select
                      name="preferredCurrency"
                      defaultValue={preferredCurrency}
                      className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    >
                      <option value="MYR">MYR</option>
                      <option value="USD">USD</option>
                      <option value="SGD">SGD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </label>

                  <div className="rounded-[1.25rem] border border-brand-100 bg-brand-50/70 px-4 py-4">
                    <p className="text-sm font-medium text-brand-700">Workspace note</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Currency formatting can expand later into a full global preference system.
                    </p>
                  </div>

                  <div className="md:col-span-2 flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="submit"
                      className="interactive-lift inline-flex min-h-12 items-center justify-center rounded-2xl bg-brand-700 px-5 py-3 text-sm font-medium text-white hover:bg-brand-500"
                    >
                      Save preferences
                    </button>
                    <p className="text-sm text-slate-500">
                      Updates apply to future dashboard and report views.
                    </p>
                  </div>
                </form>
              </article>

              <article className="glass-panel section-reveal section-reveal-delay-2 rounded-[1.75rem] p-6">
                <h2 className="text-xl font-semibold text-slate-900">Security</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Production hardening now focuses on safer auth fallbacks, structured server logs,
                  and protected-route session reads that avoid production-only crashes.
                </p>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                  <li>Server actions normalize credentials and convert unexpected failures into friendly redirects.</li>
                  <li>Protected data queries now use the signed-in access token so RLS works correctly.</li>
                  <li>Structured server logging is ready to leave clearer breadcrumbs in Vercel logs.</li>
                </ul>
              </article>
            </section>
          </section>
        );
      }}
    </ProtectedAppShell>
  );
}
