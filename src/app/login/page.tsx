import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function readSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const error = readSearchParam(resolvedSearchParams, "error");
  const message = readSearchParam(resolvedSearchParams, "message");

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
        CashNest
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        Log in to your account
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        Pick up where you left off and keep your budget in view.
      </p>
      <form action={loginAction} className="mt-8 space-y-4 rounded-3xl bg-white p-6 shadow-sm">
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
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
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
            autoComplete="current-password"
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
            placeholder="Minimum 8 characters"
          />
        </label>
        <AuthSubmitButton
          idleLabel="Continue"
          pendingLabel="Logging in..."
        />
      </form>
      <p className="mt-6 text-sm text-slate-600">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-brand-700">
          Create an account
        </Link>
      </p>
    </main>
  );
}
