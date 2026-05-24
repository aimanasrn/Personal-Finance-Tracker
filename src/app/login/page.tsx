import Link from "next/link";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
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
        <button className="w-full rounded-xl bg-brand-700 px-4 py-3 font-medium text-white">
          Continue
        </button>
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
