type AuthPageProps = {
  mode: "sign-in" | "sign-up";
};

export function AuthPage({ mode }: AuthPageProps) {
  const isSignIn = mode === "sign-in";

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-10">
      <form className="w-full space-y-5 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-panel backdrop-blur">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Personal Finance Tracker</p>
          <h1 className="text-3xl font-semibold text-white">{isSignIn ? "Sign in" : "Create account"}</h1>
        </div>
        <input className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3" placeholder="Email" />
        <input className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3" placeholder="Password" type="password" />
        <button className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-300">
          {isSignIn ? "Sign in" : "Sign up"}
        </button>
      </form>
    </div>
  );
}
