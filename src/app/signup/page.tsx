import Link from "next/link";
import { signUpAction } from "@/app/actions/auth";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
        CashNest
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        Create your account
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        Start tracking income and spending with a calm, simple setup.
      </p>
      <form action={signUpAction} className="mt-8 space-y-4 rounded-3xl bg-white p-6 shadow-sm">
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
            autoComplete="new-password"
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
            placeholder="Minimum 8 characters"
          />
        </label>
        <button className="w-full rounded-xl bg-brand-700 px-4 py-3 font-medium text-white">
          Start tracking
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand-700">
          Log in
        </Link>
      </p>
    </main>
  );
}
