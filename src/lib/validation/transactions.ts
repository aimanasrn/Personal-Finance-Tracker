import { z } from "zod";

const transactionDatePattern = /^\d{4}-\d{2}-\d{2}$/;

function isValidTransactionDate(value: string) {
  if (!transactionDatePattern.test(value)) {
    return false;
  }

  const [yearText, monthText, dayText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return false;
  }

  const candidate = new Date(Date.UTC(year, month - 1, day));

  return (
    candidate.getUTCFullYear() === year &&
    candidate.getUTCMonth() === month - 1 &&
    candidate.getUTCDate() === day
  );
}

export const transactionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Transaction title must be at least 2 characters long."),
  amount: z.coerce
    .number()
    .positive("Transaction amount must be greater than 0."),
  type: z.enum(["income", "expense"]),
  categoryId: z.uuid("Category is required."),
  transactionDate: z
    .string()
    .trim()
    .refine(
      isValidTransactionDate,
      "Transaction date must be a real calendar date in YYYY-MM-DD format.",
    ),
  notes: z
    .string()
    .trim()
    .max(500, "Notes must be 500 characters or fewer.")
    .optional()
});

export type TransactionInput = z.infer<typeof transactionSchema>;
