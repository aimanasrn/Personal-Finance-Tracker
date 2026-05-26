import Link from "next/link";
import { signUpAction } from "@/app/actions/auth";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { CopyrightFooter } from "@/components/layout/copyright-footer";

type SignupPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function readSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const error = readSearchParam(resolvedSearchParams, "error");
  const message = readSearchParam(resolvedSearchParams, "message");

  return (
    <main className="mx-auto flex min-h-screen max-w-[92rem] items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full">
        <section className="grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="section-reveal max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
            CashNest
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Build a calmer money routine from day one.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Create an account to start logging income, reviewing spending, and
            keeping monthly financial progress in one focused workspace.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="glass-panel rounded-[1.5rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Smart defaults
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Starter categories and keyword rules help new accounts feel useful immediately.
              </p>
            </div>
            <div className="glass-panel rounded-[1.5rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Mobile ready
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Sign up once, then track everyday expenses comfortably across phone and desktop.
              </p>
            </div>
          </div>
          </div>

          <div className="section-reveal section-reveal-delay-1">
            <form
              action={signUpAction}
              className="glass-panel mx-auto max-w-md space-y-4 rounded-[2rem] p-6 sm:p-7"
            >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
                Start fresh
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                Create your account
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Start tracking income and spending with a calm, simple setup.
              </p>
            </div>

            {message ? (
              <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </p>
            ) : null}
            {error ? (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </p>
            ) : null}
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                required
                name="email"
                type="email"
                autoComplete="email"
                className="w-full rounded-2xl border border-slate-200 bg-white/85 px-4 py-3"
                placeholder="you@example.com"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                required
                minLength={8}
                name="password"
                type="password"
                autoComplete="new-password"
                className="w-full rounded-2xl border border-slate-200 bg-white/85 px-4 py-3"
                placeholder="Minimum 8 characters"
              />
            </label>
            <AuthSubmitButton
              idleLabel="Start tracking"
              pendingLabel="Creating account..."
            />
            <p className="pt-2 text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-brand-700">
                Log in
              </Link>
            </p>
            </form>
          </div>
        </section>

        <CopyrightFooter />
      </div>
    </main>
  );
}
