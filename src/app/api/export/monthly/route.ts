import { listTransactions } from "@/app/actions/transactions";
import { requireUserId } from "@/lib/auth/session";
import {
  createMonthlyReportScope,
  isValidMonthKey
} from "@/lib/reports/monthly-report";

function escapeCsvValue(value: string | number | null) {
  if (value === null) {
    return "";
  }

  let stringValue = String(value);

  // Guard against spreadsheet formula injection when CSV is opened in Excel/Sheets.
  if (/^[=+\-@]/.test(stringValue) || /^[\t\r]/.test(stringValue)) {
    stringValue = `'${stringValue}`;
  }

  if (/[",\r\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, "\"\"")}"`;
  }

  return stringValue;
}

export async function GET(request: Request) {
  const userId = await requireUserId();
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  if (!month || !isValidMonthKey(month)) {
    return new Response("A valid month query parameter is required.", {
      status: 400
    });
  }

  const monthKey = month;

  const items = await listTransactions(userId);
  const rows = createMonthlyReportScope(items, monthKey).currentMonthItems;
  const csv = [
    "title,amount,type,category,date",
    ...rows.map((item) =>
      [
        item.title,
        item.amount.toFixed(2),
        item.type,
        item.categoryName,
        item.transactionDate
      ]
        .map(escapeCsvValue)
        .join(",")
    )
  ].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="report-${monthKey}.csv"`,
      "Cache-Control": "no-store"
    }
  });
}
