"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { suggestCategory } from "@/lib/categories/suggestion-engine";
import type { TransactionType } from "@/lib/db/types";

type TransactionCategoryOption = {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  isDefault: boolean;
};

type TransactionFormValues = {
  title: string;
  amount: number | string;
  type: TransactionType;
  categoryId: string;
  transactionDate: string;
  notes?: string;
};

type TransactionFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  categories: TransactionCategoryOption[];
  submitLabel: string;
  initialValues?: Partial<TransactionFormValues>;
  error?: string;
  message?: string;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-brand-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

function findSuggestedCategoryId(
  title: string,
  type: TransactionType,
  categories: TransactionCategoryOption[]
) {
  const suggestion = suggestCategory(title);

  if (!suggestion || suggestion.lookupKey.type !== type) {
    return null;
  }

  return (
    categories.find(
      (category) =>
        category.type === suggestion.lookupKey.type &&
        category.name === suggestion.lookupKey.name
    )?.id ?? null
  );
}

export function TransactionForm({
  action,
  categories,
  submitLabel,
  initialValues,
  error,
  message
}: TransactionFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [type, setType] = useState<TransactionType>(
    initialValues?.type ?? "expense"
  );
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId ?? "");

  const availableCategories = useMemo(
    () => categories.filter((category) => category.type === type),
    [categories, type]
  );
  const suggestion = useMemo(() => suggestCategory(title), [title]);

  function handleTitleChange(titleValue: string) {
    setTitle(titleValue);

    const suggestedCategoryId = findSuggestedCategoryId(
      titleValue,
      type,
      categories
    );

    if (suggestedCategoryId) {
      setCategoryId(suggestedCategoryId);
    }
  }

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType);

    const currentCategoryStillValid = categories.some(
      (category) => category.id === categoryId && category.type === nextType
    );

    if (currentCategoryStillValid) {
      return;
    }

    const suggestedCategoryId = findSuggestedCategoryId(
      title,
      nextType,
      categories
    );

    setCategoryId(suggestedCategoryId ?? "");
  }

  return (
    <form
      action={action}
      className="space-y-6 rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-100"
    >
      {message ? (
        <p className="rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
          Title
          <input
            required
            name="title"
            value={title}
            onChange={(event) => handleTitleChange(event.target.value)}
            placeholder="e.g. Grab ride home"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>

        <div className="rounded-[1.25rem] border border-brand-100 bg-brand-50/60 px-4 py-3 md:col-span-2">
          <p className="text-sm font-medium text-brand-700">
            {suggestion
              ? `Suggested category: ${suggestion.lookupKey.name}`
              : "Category suggestions will appear as you type familiar merchants."}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            {suggestion
              ? `Matched keyword "${suggestion.matchedKeyword}" with priority ${suggestion.priority}.`
              : "Grab, salary, mamak, and Shopee-style matches already have suggestion rules behind them."}
          </p>
        </div>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Amount
          <input
            required
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            defaultValue={initialValues?.amount ?? ""}
            placeholder="0.00"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Date
          <input
            required
            name="transactionDate"
            type="date"
            defaultValue={initialValues?.transactionDate ?? ""}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Type
          <select
            name="type"
            value={type}
            onChange={(event) =>
              handleTypeChange(event.target.value as TransactionType)
            }
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Category
          <select
            required
            name="categoryId"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          >
            <option value="">Select a category</option>
            {availableCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
                {category.isDefault ? " default" : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
          Notes
          <textarea
            name="notes"
            rows={5}
            defaultValue={initialValues?.notes ?? ""}
            placeholder="Add context for later, like who you paid or why it mattered."
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
