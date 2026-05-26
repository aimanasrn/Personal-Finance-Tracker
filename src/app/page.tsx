import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[92rem] items-center px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid w-full gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="section-reveal glass-panel mesh-header overflow-hidden rounded-[2.25rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
            Personal finance tracker
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
            CashNest
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Track money in and out without living inside a spreadsheet.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            A calm finance workspace for everyday budgeting, transaction logging,
            and monthly reviews with smart categories and clear reports.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="interactive-lift inline-flex min-h-12 items-center justify-center rounded-2xl bg-brand-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-500"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="interactive-lift inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white/85 px-6 py-3 text-sm font-semibold text-slate-700"
            >
              Log in
            </Link>
          </div>
        </div>

        <div className="section-reveal section-reveal-delay-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <article className="glass-panel interactive-lift rounded-[1.9rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Fast capture
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">
              Add income and expenses in seconds
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Beginner-friendly forms, category suggestions, and mobile-ready
              flows help you log money without friction.
            </p>
          </article>

          <article className="glass-panel interactive-lift rounded-[1.9rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Clear review
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">
              Monthly reports that stay readable
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Compare inflow and outflow, export a CSV, and surface the spending
              categories that deserve attention.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
