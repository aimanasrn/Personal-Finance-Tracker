import { ProtectedAppShell } from "@/components/layout/app-shell";

export default async function SettingsPage() {
  return (
    <ProtectedAppShell
      currentPath="/settings"
      title="Settings"
      description="Keep account preferences, profile details, and future session controls in one predictable place."
    >
      {(userId) => (
        <section className="grid gap-6">
          <article className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-slate-100">
            <div className="bg-[radial-gradient(circle_at_top_left,_rgba(21,117,91,0.12),_transparent_55%)] px-6 py-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
                Account snapshot
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                No profile preferences saved yet
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                This MVP already protects the route and session, but display
                name and preferred currency still need their first persisted
                settings form.
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
                  Preferences status
                </dt>
                <dd className="mt-2 text-sm text-slate-700">
                  Waiting on profile persistence
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                  Session posture
                </dt>
                <dd className="mt-2 text-sm text-slate-700">
                  Cookie-backed server session active
                </dd>
              </div>
            </dl>
          </article>

          <section className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-xl font-semibold text-slate-900">Profile</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Display name, preferred currency, and category preferences will
                land here once the MVP starts persisting personal settings.
              </p>
              <div className="mt-5 rounded-[1.25rem] border border-dashed border-slate-200 bg-stone-50 px-4 py-4">
                <p className="text-sm font-medium text-slate-900">
                  Empty state: no editable profile fields yet
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The safest current behavior is to keep this area read-only
                  until the app can save and validate profile changes end to
                  end.
                </p>
              </div>
            </article>

            <article className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-xl font-semibold text-slate-900">Security</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Authentication actions now normalize credentials, soften user-
                facing failure messages, and add lightweight burst-attempt
                throttling while the app is still in MVP mode.
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                <li>Server actions apply basic in-process throttling for repeated login and sign-up attempts.</li>
                <li>Transaction updates and deletes now verify owned records before mutating them.</li>
                <li>Report printing can avoid inline script execution in the browser.</li>
              </ul>
            </article>
          </section>
        </section>
      )}
    </ProtectedAppShell>
  );
}
