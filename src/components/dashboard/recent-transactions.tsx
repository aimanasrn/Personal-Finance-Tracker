import Link from "next/link";
import {
  listTransactions,
  type TransactionListItem
} from "@/app/actions/transactions";
import type { TransactionType } from "@/lib/db/types";
import { logServerError } from "../../lib/monitoring/server-log";
import { buildDashboardSnapshot, SummaryCards } from "./summary-cards";

type RecentTransactionsProps = {
  items: TransactionListItem[];
};

const currencyFormatter = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR"
});

function formatAmount(amount: number, type: TransactionType) {
  const prefix = type === "income" ? "+" : "-";
  return `${prefix}${currencyFormatter.format(amount)}`;
}

export function RecentTransactions({ items }: RecentTransactionsProps) {
  return (
    <section className="glass-panel section-reveal section-reveal-delay-2 overflow-hidden rounded-[1.75rem]">
      <header className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Recent transactions
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Keep an eye on the latest entries without leaving the dashboard.
          </p>
        </div>
        <Link
          href="/transactions"
          className="interactive-lift inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
        >
          Open ledger
        </Link>
      </header>

      {items.length === 0 ? (
        <div className="px-6 py-8">
          <h3 className="text-lg font-semibold text-slate-900">
            No recent activity yet
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Add your first transaction to populate the dashboard snapshot and
            recent activity feed.
          </p>
          <Link
            href="/transactions/new"
            className="interactive-lift mt-5 inline-flex items-center justify-center rounded-2xl bg-brand-700 px-5 py-3 text-sm font-medium text-white hover:bg-brand-500"
          >
            Add transaction
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 px-6 py-5 transition-colors duration-200 hover:bg-white/75 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-base font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-600">
                    {item.type}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {item.categoryName} · {item.transactionDate}
                </p>
                {item.notes ? (
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.notes}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                <p
                  className={`text-lg font-semibold ${
                    item.type === "income"
                      ? "text-emerald-600"
                      : "text-orange-600"
                  }`}
                >
                  {formatAmount(item.amount, item.type)}
                </p>
                <Link
                  href={`/transactions/${item.id}/edit`}
                  className="interactive-lift inline-flex min-h-10 items-center justify-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

type DashboardOverviewProps = {
  userId: string;
};

export async function DashboardOverview({ userId }: DashboardOverviewProps) {
  let items: TransactionListItem[] = [];
  let loadError: string | null = null;

  try {
    items = await listTransactions(userId);
  } catch (loadFailure) {
    logServerError("dashboard.load-transactions", loadFailure, { userId });
    loadError =
      loadFailure instanceof Error
        ? loadFailure.message
        : "Unable to load dashboard activity right now.";
  }

  const snapshot = buildDashboardSnapshot(items);

  return (
    <>
      {loadError ? (
        <p className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {loadError}
        </p>
      ) : null}

      <SummaryCards
        income={snapshot.income}
        expenses={snapshot.expenses}
        balance={snapshot.balance}
      />

      <div className="mt-6">
        <RecentTransactions items={snapshot.recentItems} />
      </div>
    </>
  );
}
