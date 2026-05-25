import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError, z } from "zod";
import { requireUserId } from "@/lib/auth/session";
import type { CategoryRecord, TransactionRecord, TransactionType, UUID } from "@/lib/db/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  transactionSchema,
  type TransactionInput
} from "../../lib/validation/transactions";

const transactionIdSchema = z.uuid();
const transactionNotFoundMessage =
  "We couldn't find that transaction. Refresh the ledger and try again.";

export type TransactionCategoryOption = Pick<
  CategoryRecord,
  "id" | "name" | "type" | "color" | "icon"
> & {
  isDefault: boolean;
};

export type TransactionListItem = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string | null;
  categoryName: string;
  transactionDate: string;
  notes: string | null;
};

export type TransactionFormValues = TransactionInput & {
  id?: string;
};

type JoinedTransactionRow = Pick<
  TransactionRecord,
  "id" | "title" | "amount" | "type" | "transaction_date" | "notes"
> & {
  categories:
    | {
        id?: string | null;
        name?: string | null;
      }
    | Array<{
        id?: string | null;
        name?: string | null;
      }>
    | null;
};

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

function normalizeNotes(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function buildRedirect(pathname: string, key: "message" | "error", value: string) {
  const searchParams = new URLSearchParams({ [key]: value });
  return `${pathname}?${searchParams.toString()}`;
}

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? fallbackMessage;
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    if (
      error.message === "Select a valid category for this transaction." ||
      error.message === transactionNotFoundMessage
    ) {
      return error.message;
    }
  }

  return fallbackMessage;
}

function toDatabasePayload(userId: string, input: TransactionInput) {
  return {
    user_id: userId,
    title: input.title,
    amount: input.amount,
    type: input.type,
    category_id: input.categoryId,
    transaction_date: input.transactionDate,
    notes: input.notes ?? null
  };
}

function toDatabaseUpdate(input: TransactionInput) {
  return {
    title: input.title,
    amount: input.amount,
    type: input.type,
    category_id: input.categoryId,
    transaction_date: input.transactionDate,
    notes: input.notes ?? null
  };
}

function readCategoryName(categories: JoinedTransactionRow["categories"]) {
  if (Array.isArray(categories)) {
    return categories[0]?.name ?? "Uncategorized";
  }

  return categories?.name ?? "Uncategorized";
}

function readCategoryId(categories: JoinedTransactionRow["categories"]) {
  if (Array.isArray(categories)) {
    return categories[0]?.id ?? null;
  }

  return categories?.id ?? null;
}

async function validateTransactionCategory(
  userId: string,
  categoryId: string,
  expectedType: TransactionType
) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, type")
    .eq("id", categoryId)
    // This app-side scope check complements future database-enforced RLS.
    .or(`user_id.is.null,user_id.eq.${userId}`)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.type !== expectedType) {
    throw new Error("Select a valid category for this transaction.");
  }
}

async function ensureOwnedTransaction(userId: string, id: string) {
  const parsedId = transactionIdSchema.safeParse(id);

  if (!parsedId.success) {
    throw new Error(transactionNotFoundMessage);
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("id")
    .eq("id", parsedId.data)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(transactionNotFoundMessage);
  }

  return parsedId.data;
}

export function normalizeTransactionInput(formData: FormData): TransactionInput {
  return transactionSchema.parse({
    title: getFormValue(formData, "title"),
    amount: getFormValue(formData, "amount"),
    type: getFormValue(formData, "type"),
    categoryId: getFormValue(formData, "categoryId"),
    transactionDate: getFormValue(formData, "transactionDate"),
    notes: normalizeNotes(getFormValue(formData, "notes"))
  });
}

export async function createTransactionAction(formData: FormData): Promise<void> {
  "use server";

  const userId = await requireUserId();

  let payload: TransactionInput;

  try {
    payload = normalizeTransactionInput(formData);
  } catch (error) {
    redirect(
      buildRedirect(
        "/transactions/new",
        "error",
        getErrorMessage(
          error,
          "We couldn't save your transaction yet. Please check the form and try again."
        )
      )
    );
  }

  try {
    await validateTransactionCategory(userId, payload.categoryId, payload.type);
  } catch (error) {
    redirect(
      buildRedirect(
        "/transactions/new",
        "error",
        getErrorMessage(
          error,
          "We couldn't save your transaction yet. Please check the form and try again."
        )
      )
    );
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("transactions")
    .insert(toDatabasePayload(userId, payload));

  if (error) {
    redirect(
      buildRedirect(
        "/transactions/new",
        "error",
        getErrorMessage(
          error,
          "We couldn't save your transaction just now. Please try again."
        )
      )
    );
  }

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  redirect(buildRedirect("/transactions", "message", "Transaction created."));
}

export async function updateTransactionAction(
  id: string,
  formData: FormData
): Promise<void> {
  "use server";

  const userId = await requireUserId();
  const editPath = `/transactions/${id}/edit`;

  let payload: TransactionInput;
  let transactionId: string;

  try {
    payload = normalizeTransactionInput(formData);
  } catch (error) {
    redirect(
      buildRedirect(
        editPath,
        "error",
        getErrorMessage(
          error,
          "We couldn't save your transaction yet. Please check the form and try again."
        )
      )
    );
  }

  try {
    transactionId = await ensureOwnedTransaction(userId, id);
  } catch (error) {
    redirect(
      buildRedirect(
        "/transactions",
        "error",
        getErrorMessage(error, transactionNotFoundMessage)
      )
    );
  }

  try {
    await validateTransactionCategory(userId, payload.categoryId, payload.type);
  } catch (error) {
    redirect(
      buildRedirect(
        editPath,
        "error",
        getErrorMessage(
          error,
          "We couldn't save your transaction yet. Please check the form and try again."
        )
      )
    );
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("transactions")
    .update(toDatabaseUpdate(payload))
    .match({
      id: transactionId,
      user_id: userId
    });

  if (error) {
    redirect(
      buildRedirect(
        editPath,
        "error",
        getErrorMessage(
          error,
          "We couldn't update that transaction just now. Please try again."
        )
      )
    );
  }

  revalidatePath("/transactions");
  revalidatePath(editPath);
  revalidatePath("/dashboard");
  redirect(buildRedirect("/transactions", "message", "Transaction updated."));
}

export async function deleteTransactionAction(id: string): Promise<void> {
  "use server";

  const userId = await requireUserId();
  let transactionId: string;

  try {
    transactionId = await ensureOwnedTransaction(userId, id);
  } catch (error) {
    redirect(
      buildRedirect(
        "/transactions",
        "error",
        getErrorMessage(error, transactionNotFoundMessage)
      )
    );
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("transactions")
    .delete()
    .match({
      id: transactionId,
      user_id: userId
    });

  if (error) {
    redirect(
      buildRedirect(
        "/transactions",
        "error",
        getErrorMessage(
          error,
          "We couldn't delete that transaction just now. Please try again."
        )
      )
    );
  }

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  redirect(buildRedirect("/transactions", "message", "Transaction deleted."));
}

export async function listTransactionCategories(
  userId: string
): Promise<TransactionCategoryOption[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, type, color, icon, is_default")
    .or(`user_id.is.null,user_id.eq.${userId}`)
    .order("is_default", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as Array<
    Pick<CategoryRecord, "id" | "name" | "type" | "color" | "icon"> & {
      is_default: boolean;
    }
  >).map((category) => ({
    id: category.id,
    name: category.name,
    type: category.type,
    color: category.color,
    icon: category.icon,
    isDefault: category.is_default
  }));
}

export async function listTransactions(
  userId: string
): Promise<TransactionListItem[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("transactions")
    .select(
      "id, title, amount, type, transaction_date, notes, categories(id, name)"
    )
    .eq("user_id", userId)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as JoinedTransactionRow[]).map((transaction) => ({
    id: transaction.id,
    title: transaction.title,
    amount: Number(transaction.amount),
    type: transaction.type,
    categoryId: readCategoryId(transaction.categories),
    categoryName: readCategoryName(transaction.categories),
    transactionDate: transaction.transaction_date,
    notes: transaction.notes
  }));
}

export async function getTransactionForEdit(
  userId: string,
  id: UUID
): Promise<TransactionFormValues | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("id, title, amount, type, category_id, transaction_date, notes")
    .match({
      id,
      user_id: userId
    })
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const transaction = data as Pick<
    TransactionRecord,
    "id" | "title" | "amount" | "type" | "category_id" | "transaction_date" | "notes"
  >;

  return {
    id: transaction.id,
    title: transaction.title,
    amount: Number(transaction.amount),
    type: transaction.type,
    categoryId: transaction.category_id,
    transactionDate: transaction.transaction_date,
    notes: transaction.notes ?? undefined
  };
}
