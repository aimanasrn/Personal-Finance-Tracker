import { PlannedExpenseList } from "./PlannedExpenseList";

export function RecurringExpensesPage() {
  return (
    <div className="space-y-6 p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Recurring expenses</h1>
      <PlannedExpenseList
        items={[
          { id: "1", name: "Rent", amount: 800, scheduledFor: "2026-05-01", status: "PENDING" }
        ]}
      />
    </div>
  );
}
