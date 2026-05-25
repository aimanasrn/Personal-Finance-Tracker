import type { TransactionListItem } from "@/app/actions/transactions";

type SummaryCardsProps = {
  income: number;
  expenses: number;
  balance: number;
};

type DashboardSnapshot = SummaryCardsProps & {
  recentItems: TransactionListItem[];
};

const currencyFormatter = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR"
});

function formatCurrency(amount: number) {
  return currencyFormatter.format(amount);
}

function getMonthKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

export function buildDashboardSnapshot(
  items: TransactionListItem[],
  referenceDate = new Date()
): DashboardSnapshot {
  const monthKey = getMonthKey(referenceDate);
  const totals = items.reduce(
    (summary, item) => {
      if (!item.transactionDate.startsWith(monthKey)) {
        return summary;
      }

      if (item.type === "income") {
        summary.income += item.amount;
      } else {
        summary.expenses += item.amount;
      }

      return summary;
    },
    { income: 0, expenses: 0 }
  );

  return {
    income: totals.income,
    expenses: totals.expenses,
    balance: totals.income - totals.expenses,
    recentItems: items.slice(0, 5)
  };
}

export function SummaryCards({
  income,
  expenses,
  balance
}: SummaryCardsProps) {
  const items = [
    {
      label: "Money In",
      value: income,
      toneClassName: "text-emerald-600",
      accentClassName: "from-emerald-100 via-emerald-50 to-white"
    },
    {
      label: "Money Out",
      value: expenses,
      toneClassName: "text-orange-600",
      accentClassName: "from-orange-100 via-orange-50 to-white"
    },
    {
      label: "Balance",
      value: balance,
      toneClassName: balance >= 0 ? "text-slate-900" : "text-rose-700",
      accentClassName:
        balance >= 0
          ? "from-brand-100 via-emerald-50 to-white"
          : "from-rose-100 via-rose-50 to-white"
    }
  ];

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {items.map((item, index) => (
        <article
          key={item.label}
          className={`section-reveal overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${item.accentClassName} p-5 shadow-sm ring-1 ring-slate-100 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.08)] sm:p-6 ${index === 1 ? "section-reveal-delay-1" : ""} ${index === 2 ? "section-reveal-delay-2" : ""}`}
        >
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
            {item.label}
          </p>
          <p className={`mt-4 text-3xl font-semibold ${item.toneClassName}`}>
            {formatCurrency(item.value)}
          </p>
        </article>
      ))}
    </section>
  );
}
