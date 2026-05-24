import type { ReactNode } from "react";
import { requireUserId } from "../../lib/auth/session";
import { MobileNav } from "./mobile-nav";
import { Sidebar } from "./sidebar";

type AppShellProps = {
  children: ReactNode;
  currentPath: string;
  title: string;
  description?: string;
};

type ProtectedAppShellProps = Omit<AppShellProps, "children"> & {
  children: ReactNode | ((userId: string) => ReactNode);
};

export function AppShell({
  children,
  currentPath,
  title,
  description
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-6 px-4 py-4 lg:px-6 lg:py-6">
        <Sidebar currentPath={currentPath} />
        <div className="flex min-w-0 flex-1 flex-col pb-24 lg:pb-0">
          <header className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-100">
            <div className="bg-[radial-gradient(circle_at_top_left,_rgba(31,157,122,0.16),_transparent_50%)] px-6 py-6 sm:px-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
                CashNest
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {title}
              </h1>
              {description ? (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  {description}
                </p>
              ) : null}
            </div>
          </header>
          <main className="mt-6 flex-1">{children}</main>
        </div>
      </div>
      <MobileNav currentPath={currentPath} />
    </div>
  );
}

export async function ProtectedAppShell({
  children,
  ...props
}: ProtectedAppShellProps) {
  const userId = await requireUserId();

  return (
    <AppShell {...props}>
      {typeof children === "function" ? children(userId) : children}
    </AppShell>
  );
}
