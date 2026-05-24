type PlannedExpenseItem = {
  id: string;
  name: string;
  amount: number;
  scheduledFor: string;
  status: "PENDING" | "PAID" | "SKIPPED";
};

export function PlannedExpenseList({ items }: { items: PlannedExpenseItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-medium">{item.name}</div>
            <div className="text-sm text-slate-400">
              ${item.amount} scheduled for {item.scheduledFor}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-medium text-slate-950">Mark paid</button>
            <button className="rounded-2xl border border-white/10 px-4 py-2 text-sm">Skip</button>
          </div>
        </div>
      ))}
    </div>
  );
}
