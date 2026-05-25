import type { MonthlyCategoryTotal } from "@/lib/reports/monthly-report";

type TopCategoriesProps = {
  items: MonthlyCategoryTotal[];
  monthLabel: string;
};

const currencyFormatter = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR"
});

export function TopCategories({ items, monthLabel }: TopCategoriesProps) {
  return (
    <article className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-xl font-semibold text-slate-900">
        Top spending categories
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        The biggest expense buckets for {monthLabel}, ranked by spend.
      </p>

      {items.length === 0 ? (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-200 bg-stone-50 px-4 py-5">
          <h3 className="text-sm font-semibold text-slate-900">
            No expense categories yet
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Once expense transactions land in this month, category insights will
            show up here automatically.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {items.map((item) => (
            <li key={item.name}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                    {(item.share * 100).toFixed(0)}% of monthly expenses
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {currencyFormatter.format(item.amount)}
                </p>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-700 to-emerald-400"
                  style={{ width: `${Math.max(item.share * 100, 8)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
