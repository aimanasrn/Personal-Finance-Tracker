import Link from "next/link";
import { deleteTransactionAction } from "@/app/actions/transactions";
import type { TransactionType } from "@/lib/db/types";

type TransactionListItem = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryName: string;
  transactionDate: string;
  notes: string | null;
};

type TransactionListProps = {
  items: TransactionListItem[];
};

function formatAmount(amount: number, type: TransactionType) {
  const formatter = new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR"
  });

  const prefix = type === "income" ? "+" : "-";
  return `${prefix}${formatter.format(amount)}`;
}

export function TransactionList({ items }: TransactionListProps) {
  if (items.length === 0) {
    return (
      <section className="glass-panel section-reveal section-reveal-delay-3 rounded-[1.75rem] p-8">
        <h2 className="text-xl font-semibold text-slate-900">
          No transactions match this view yet
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Add your first transaction or adjust the filters to bring entries back
          into view.
        </p>
      </section>
    );
  }

  return (
    <section className="glass-panel section-reveal section-reveal-delay-3 overflow-hidden rounded-[1.75rem]">
      <header className="flex flex-col gap-2 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Ledger</h2>
          <p className="mt-1 text-sm text-slate-600">
            {items.length} transaction{items.length === 1 ? "" : "s"} in this
            view
          </p>
        </div>
        <Link
          href="/transactions/new"
          className="interactive-lift inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
        >
          Add another
        </Link>
      </header>

      <ul className="divide-y divide-slate-100">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-4 px-5 py-5 transition-colors duration-200 hover:bg-white/80 sm:px-6 lg:flex-row lg:items-start lg:justify-between"
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

            <div className="flex flex-col items-start gap-3 lg:items-end">
              <p
                className={`text-lg font-semibold ${
                  item.type === "income" ? "text-emerald-600" : "text-orange-600"
                }`}
              >
                {formatAmount(item.amount, item.type)}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/transactions/${item.id}/edit`}
                  className="interactive-lift inline-flex min-h-10 items-center justify-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  Edit
                </Link>
                <form action={deleteTransactionAction.bind(null, item.id)}>
                  <button
                    type="submit"
                    className="interactive-lift inline-flex min-h-10 items-center justify-center rounded-2xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
