import Link from "next/link";
import {
  listTransactionCategories,
  listTransactions,
  type TransactionCategoryOption,
  type TransactionListItem
} from "@/app/actions/transactions";
import { AppShell } from "@/components/layout/app-shell";
import { TransactionList } from "@/components/transactions/transaction-list";
import { requireUserId } from "@/lib/auth/session";

type TransactionsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function readSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function matchesFilter(
  item: TransactionListItem,
  query: string,
  type: string,
  categoryId: string,
  fromDate: string,
  toDate: string
) {
  const normalizedQuery = query.trim().toLowerCase();
  const queryMatches =
    normalizedQuery.length === 0 ||
    item.title.toLowerCase().includes(normalizedQuery) ||
    item.categoryName.toLowerCase().includes(normalizedQuery) ||
    item.notes?.toLowerCase().includes(normalizedQuery);

  const typeMatches = type === "all" || item.type === type;
  const categoryMatches =
    categoryId.length === 0 || item.categoryId === categoryId;
  const fromDateMatches =
    fromDate.length === 0 || item.transactionDate >= fromDate;
  const toDateMatches = toDate.length === 0 || item.transactionDate <= toDate;

  return (
    queryMatches &&
    typeMatches &&
    categoryMatches &&
    fromDateMatches &&
    toDateMatches
  );
}

export default async function TransactionsPage({
  searchParams
}: TransactionsPageProps) {
  const userId = await requireUserId();
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const query = readSearchParam(resolvedSearchParams, "q") ?? "";
  const typeFilter = readSearchParam(resolvedSearchParams, "type") ?? "all";
  const categoryFilter = readSearchParam(resolvedSearchParams, "categoryId") ?? "";
  const fromDateFilter = readSearchParam(resolvedSearchParams, "from") ?? "";
  const toDateFilter = readSearchParam(resolvedSearchParams, "to") ?? "";
  const message = readSearchParam(resolvedSearchParams, "message");
  const error = readSearchParam(resolvedSearchParams, "error");

  let items: TransactionListItem[] = [];
  let categories: TransactionCategoryOption[] = [];
  let loadError: string | null = null;

  try {
    [items, categories] = await Promise.all([
      listTransactions(userId),
      listTransactionCategories(userId)
    ]);
  } catch (loadFailure) {
    loadError =
      loadFailure instanceof Error
        ? loadFailure.message
        : "Unable to load transactions right now.";
  }

  const filteredItems = items.filter((item) =>
    matchesFilter(
      item,
      query,
      typeFilter,
      categoryFilter,
      fromDateFilter,
      toDateFilter
    )
  );

  return (
    <AppShell
      currentPath="/transactions"
      title="Transactions"
      description="Review the full ledger, filter what matters, and keep the everyday bookkeeping flow close at hand."
    >
      <section className="flex flex-col gap-4 rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Everyday money movement, all in one place
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Filter by date range, category, and type, then jump into edit and
            delete flows without leaving the protected transaction area.
          </p>
        </div>
        <Link
          href="/transactions/new"
          className="inline-flex items-center justify-center rounded-2xl bg-brand-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-500"
        >
          Add transaction
        </Link>
      </section>

      {message ? (
        <p className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}

      {error || loadError ? (
        <p className="mt-6 rounded-[1.5rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error ?? loadError}
        </p>
      ) : null}

      <section className="mt-6 rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <form className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_220px_220px_180px_180px_auto]">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Search
            <input
              name="q"
              defaultValue={query}
              placeholder="Search title, category, or notes"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Category
            <select
              name="categoryId"
              defaultValue={categoryFilter}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Type
            <select
              name="type"
              defaultValue={typeFilter}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              <option value="all">All transactions</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            From
            <input
              name="from"
              type="date"
              defaultValue={fromDateFilter}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            To
            <input
              name="to"
              type="date"
              defaultValue={toDateFilter}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </label>
          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Apply filters
            </button>
            <Link
              href="/transactions"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Reset
            </Link>
          </div>
        </form>
        <p className="mt-4 text-xs leading-5 text-slate-500">
          Filters currently apply on the page after loading your ledger, which
          keeps the surface complete while the app is still in its MVP data
          wiring stage.
        </p>
      </section>

      <section className="mt-6">
        <TransactionList items={filteredItems} />
      </section>
    </AppShell>
  );
}
