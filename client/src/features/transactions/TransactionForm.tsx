export function TransactionForm() {
  return (
    <form className="grid gap-3 rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-4">
      <input className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3" placeholder="Amount" />
      <input className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3" placeholder="Date" />
      <button className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-300">Save transaction</button>
    </form>
  );
}
