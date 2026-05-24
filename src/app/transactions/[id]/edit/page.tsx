import Link from "next/link";
import { notFound } from "next/navigation";
import {
  deleteTransactionAction,
  getTransactionForEdit,
  listTransactionCategories,
  updateTransactionAction
} from "@/app/actions/transactions";
import { AppShell } from "@/components/layout/app-shell";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { requireUserId } from "@/lib/auth/session";

type EditTransactionPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function readSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function EditTransactionPage({
  params,
  searchParams
}: EditTransactionPageProps) {
  const [{ id }, userId, resolvedSearchParams] = await Promise.all([
    params,
    requireUserId(),
    searchParams ? searchParams : Promise.resolve({})
  ]);
  const error = readSearchParam(resolvedSearchParams, "error");
  const message = readSearchParam(resolvedSearchParams, "message");

  const [categories, transaction] = await Promise.all([
    listTransactionCategories(userId),
    getTransactionForEdit(userId, id)
  ]);

  if (!transaction) {
    notFound();
  }

  const updateAction = updateTransactionAction.bind(null, id);
  const removeAction = deleteTransactionAction.bind(null, id);

  return (
    <AppShell
      currentPath={`/transactions/${id}/edit`}
      title="Edit transaction"
      description="Update the details, keep category suggestions in view, or remove the entry if it no longer belongs in the ledger."
    >
      <section className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/transactions"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Back to transactions
        </Link>
        <form action={removeAction}>
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
          >
            Delete transaction
          </button>
        </form>
      </section>

      <TransactionForm
        action={updateAction}
        categories={categories}
        submitLabel="Update transaction"
        initialValues={transaction}
        error={error}
        message={message}
      />
    </AppShell>
  );
}
