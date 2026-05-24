import { ProtectedAppShell } from "@/components/layout/app-shell";

export default async function ReportsPage() {
  return (
    <ProtectedAppShell
      currentPath="/reports"
      title="Reports"
      description="Use this space for monthly trends, category breakdowns, and exports once the reporting layer is wired in."
    >
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <article className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">Monthly summary</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The shell is in place for charts and totals, while the reporting
            task can focus on data computation and visualization.
          </p>
          <div className="mt-6 h-56 rounded-[1.5rem] border border-dashed border-slate-200 bg-stone-50" />
        </article>
        <article className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">
            Top spending categories
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            This panel is reserved for category insights and export actions.
          </p>
        </article>
      </section>
    </ProtectedAppShell>
  );
}
