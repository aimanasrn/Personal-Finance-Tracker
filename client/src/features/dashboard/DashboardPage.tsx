import { WorkspaceSwitcher } from "../workspaces/WorkspaceSwitcher";
import { TransactionForm } from "../transactions/TransactionForm";
import { SummaryCard } from "./SummaryCard";

export function DashboardPage() {
  return (
    <div className="space-y-6 p-4 md:p-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Data Pulse</p>
          <h1 className="text-3xl font-semibold">Budget overview</h1>
        </div>
        <WorkspaceSwitcher />
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.4fr,1fr,1fr]">
        <SummaryCard>
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-300/70">This month</p>
            <h2 className="text-xl font-semibold">Budget overview</h2>
            <div className="h-3 overflow-hidden rounded-full bg-slate-900/70">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400" />
            </div>
          </div>
        </SummaryCard>
        <SummaryCard>
          <h2 className="text-xl font-semibold">Savings goals</h2>
          <p className="mt-3 text-sm text-slate-300">Track target progress and next milestones.</p>
        </SummaryCard>
        <SummaryCard>
          <h2 className="text-xl font-semibold">Planned expenses</h2>
          <p className="mt-3 text-sm text-slate-300">Review upcoming expected charges and confirm them.</p>
        </SummaryCard>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-panel backdrop-blur">
        <h2 className="mb-4 text-xl font-semibold">Quick add transaction</h2>
        <TransactionForm />
      </section>
    </div>
  );
}
