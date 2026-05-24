import { ProtectedAppShell } from "@/components/layout/app-shell";

export default async function DashboardPage() {
  return (
    <ProtectedAppShell
      currentPath="/dashboard"
      title="Dashboard"
      description="Start with a quick snapshot of your month, then drill into the details that need attention."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">Money In</p>
          <p className="mt-4 text-3xl font-semibold text-emerald-600">0.00</p>
        </article>
        <article className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">Money Out</p>
          <p className="mt-4 text-3xl font-semibold text-orange-600">0.00</p>
        </article>
        <article className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">Balance</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">0.00</p>
        </article>
      </section>
      <section className="mt-6 rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-xl font-semibold text-slate-900">
          Recent activity will land here
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Once transactions are connected, this page can surface recent spending,
          income, and quick next actions without changing the shared shell.
        </p>
      </section>
    </ProtectedAppShell>
  );
}
