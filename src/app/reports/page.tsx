import Link from "next/link";
import { listTransactions, type TransactionListItem } from "@/app/actions/transactions";
import { AppShell } from "@/components/layout/app-shell";
import { MonthlyChart } from "@/components/reports/monthly-chart";
import { PrintReportButton } from "@/components/reports/print-report-button";
import { TopCategories } from "@/components/reports/top-categories";
import { requireUserId } from "@/lib/auth/session";
import {
  buildMonthlyReportFromMonths,
  createMonthlyReportScope,
  formatMonthLabel,
  isValidMonthKey,
  shiftMonthKey
} from "@/lib/reports/monthly-report";

const currencyFormatter = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR"
});

function getLocalCurrentMonthKey(referenceDate = new Date()) {
  const year = referenceDate.getFullYear();
  const month = `${referenceDate.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

function formatCurrency(amount: number) {
  return currencyFormatter.format(amount);
}

function readSelectedMonthKey(
  searchParams: Record<string, string | string[] | undefined>
): string {
  const rawMonth = searchParams.month;
  const monthValue = Array.isArray(rawMonth) ? rawMonth[0] : rawMonth;

  if (isValidMonthKey(monthValue)) {
    return monthValue;
  }

  return getLocalCurrentMonthKey();
}

function formatDelta(amount: number) {
  const prefix = amount > 0 ? "+" : "";
  return `${prefix}${formatCurrency(amount)}`;
}

function MetricCard({
  label,
  value,
  accentClassName,
  valueClassName
}: {
  label: string;
  value: number;
  accentClassName: string;
  valueClassName: string;
}) {
  return (
    <article
      className={`overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${accentClassName} p-6 shadow-sm ring-1 ring-slate-100`}
    >
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-4 text-3xl font-semibold ${valueClassName}`}>
        {formatCurrency(value)}
      </p>
    </article>
  );
}

function ComparisonCard({
  label,
  delta
}: {
  label: string;
  delta: number;
}) {
  const toneClassName =
    delta > 0
      ? "text-emerald-600"
      : delta < 0
        ? "text-rose-700"
        : "text-slate-700";

  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className={`mt-3 text-lg font-semibold ${toneClassName}`}>
        {formatDelta(delta)}
      </p>
    </article>
  );
}

function ReportsContent({
  items,
  selectedMonthKey
}: {
  items: TransactionListItem[];
  selectedMonthKey: string;
}) {
  const report = buildMonthlyReportFromMonths(
    createMonthlyReportScope(items, selectedMonthKey)
  );
  const exportHref = `/api/export/monthly?month=${selectedMonthKey}`;
  const previousMonthKey = shiftMonthKey(selectedMonthKey, -1) ?? selectedMonthKey;
  const nextMonthKey = shiftMonthKey(selectedMonthKey, 1) ?? selectedMonthKey;
  const currentMonthKey = getLocalCurrentMonthKey();
  const canGoForward = nextMonthKey <= currentMonthKey;

  return (
    <div
      id="monthly-report-content"
      className="space-y-6 print:space-y-4"
    >
      <section className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 print:rounded-none print:border print:border-slate-200 print:p-4 print:shadow-none print:ring-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Selected month
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Choose which month to analyze, then compare it against the prior
              month when earlier data exists.
            </p>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Month
              <input
                name="month"
                type="month"
                defaultValue={selectedMonthKey}
                max={currentMonthKey}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              View month
            </button>
          </form>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 print:hidden">
          <Link
            href={`/reports?month=${previousMonthKey}`}
            className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Previous month
          </Link>
          <Link
            href={`/reports?month=${currentMonthKey}`}
            className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Current month
          </Link>
          {canGoForward ? (
            <Link
              href={`/reports?month=${nextMonthKey}`}
              className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Next month
            </Link>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 print:hidden">
          <Link
            href={exportHref}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-brand-700 px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Export CSV
          </Link>
          <PrintReportButton />
          <p className="text-sm text-slate-500">
            Export or print the {formatMonthLabel(selectedMonthKey)} report.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3 print:grid-cols-3">
        <MetricCard
          label={`${report.monthLabel} income`}
          value={report.totalIncome}
          accentClassName="from-emerald-100 via-emerald-50 to-white"
          valueClassName="text-emerald-600"
        />
        <MetricCard
          label={`${report.monthLabel} expenses`}
          value={report.totalExpenses}
          accentClassName="from-orange-100 via-orange-50 to-white"
          valueClassName="text-orange-600"
        />
        <MetricCard
          label="Net balance"
          value={report.balance}
          accentClassName={
            report.balance >= 0
              ? "from-brand-100 via-emerald-50 to-white"
              : "from-rose-100 via-rose-50 to-white"
          }
          valueClassName={
            report.balance >= 0 ? "text-slate-900" : "text-rose-700"
          }
        />
      </section>

      <section className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 print:rounded-none print:border print:border-slate-200 print:p-4 print:shadow-none print:ring-0">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {report.monthLabel} overview
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {report.transactionCount} transaction
              {report.transactionCount === 1 ? "" : "s"} contributed to this
              month&apos;s report.
            </p>
          </div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
            Derived live from your ledger
          </p>
        </div>

        {report.previousMonth && report.comparison ? (
          <div className="mt-6">
            <p className="text-sm font-medium text-slate-700">
              Compared with {report.previousMonth.monthLabel}
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <ComparisonCard
                label="Income change"
                delta={report.comparison.incomeDelta}
              />
              <ComparisonCard
                label="Expense change"
                delta={report.comparison.expensesDelta}
              />
              <ComparisonCard
                label="Balance change"
                delta={report.comparison.balanceDelta}
              />
            </div>
          </div>
        ) : (
          <p className="mt-6 text-sm leading-6 text-slate-600">
            No prior-month transactions are available yet for a month-over-month
            comparison.
          </p>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr] print:grid-cols-1">
        <MonthlyChart
          monthLabel={report.monthLabel}
          income={report.totalIncome}
          expenses={report.totalExpenses}
        />
        <TopCategories
          items={report.topCategories.slice(0, 5)}
          monthLabel={report.monthLabel}
        />
      </section>

      {report.transactionCount === 0 ? (
        <section className="rounded-[1.75rem] border border-dashed border-slate-200 bg-stone-50 px-6 py-6 print:rounded-none print:border print:border-slate-200 print:bg-white print:px-4 print:py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            No transactions recorded for this month
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Add income or expense entries dated this month to populate the
            report cards, chart, and category insights.
          </p>
        </section>
      ) : null}
    </div>
  );
}

type ReportsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ReportsPage({
  searchParams
}: ReportsPageProps) {
  const userId = await requireUserId();
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selectedMonthKey = readSelectedMonthKey(resolvedSearchParams);

  let items: TransactionListItem[] = [];
  let loadError: string | null = null;

  try {
    items = await listTransactions(userId);
  } catch (loadFailure) {
    loadError = "Unable to load reporting data right now.";
  }

  return (
    <AppShell
      currentPath="/reports"
      title="Reports"
      description="Track this month's inflow, outflow, and biggest spending categories without leaving the protected workspace."
    >
      {loadError ? (
        <p className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {loadError}
        </p>
      ) : (
        <ReportsContent items={items} selectedMonthKey={selectedMonthKey} />
      )}
    </AppShell>
  );
}
