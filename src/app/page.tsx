export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
        CashNest
      </p>
      <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-slate-900">
        Track money in and out without living inside a spreadsheet.
      </h1>
      <p className="mt-4 max-w-xl text-lg text-slate-600">
        A beginner-friendly finance tracker with clean reports, smart categories,
        and a calm mobile-first workflow.
      </p>
    </main>
  );
}
