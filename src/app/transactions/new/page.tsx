import Link from "next/link";
import {
  createTransactionAction,
  listTransactionCategories,
  type TransactionCategoryOption
} from "@/app/actions/transactions";
import { AppShell } from "@/components/layout/app-shell";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { requireUserId } from "@/lib/auth/session";
import { logServerError } from "../../../lib/monitoring/server-log";

type NewTransactionPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function readSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const day = `${today.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function NewTransactionPage({
  searchParams
}: NewTransactionPageProps) {
  const userId = await requireUserId();
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const error = readSearchParam(resolvedSearchParams, "error");
  const message = readSearchParam(resolvedSearchParams, "message");

  let categories: TransactionCategoryOption[] = [];
  let loadError: string | null = null;

  try {
    categories = await listTransactionCategories(userId);
  } catch (categoryFailure) {
    logServerError("transactions.load-new-form", categoryFailure, { userId });
    loadError =
      categoryFailure instanceof Error
        ? categoryFailure.message
        : "Unable to load categories right now.";
  }

  return (
    <AppShell
      currentPath="/transactions/new"
      title="New transaction"
      description="Capture a purchase or payment quickly, with category suggestions already watching the title as you type."
    >
      <section className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/transactions"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Back to transactions
        </Link>
      </section>

      {loadError ? (
        <p className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {loadError}
        </p>
      ) : (
        <TransactionForm
          action={createTransactionAction}
          categories={categories}
          submitLabel="Save transaction"
          initialValues={{
            type: "expense",
            transactionDate: getTodayDate()
          }}
          error={error}
          message={message}
        />
      )}
    </AppShell>
  );
}
