import type { ReactNode } from "react";
import { logoutAction } from "@/app/actions/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { CopyrightFooter } from "@/components/layout/copyright-footer";
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
  children: ReactNode | ((userId: string) => ReactNode | Promise<ReactNode>);
};

export function AppShell({
  children,
  currentPath,
  title,
  description
}: AppShellProps) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-[92rem] gap-4 px-3 py-3 sm:px-4 sm:py-4 lg:gap-6 lg:px-6 lg:py-6">
        <Sidebar currentPath={currentPath} />
        <div className="flex min-w-0 flex-1 flex-col pb-28 lg:pb-0">
          <header className="glass-panel section-reveal overflow-hidden rounded-[2rem] sm:rounded-[2.25rem]">
            <div className="mesh-header px-5 py-6 sm:px-7 sm:py-7 lg:px-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
                    CashNest
                  </p>
                  <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.8rem]">
                    {title}
                  </h1>
                  {description ? (
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                      {description}
                    </p>
                  ) : null}
                </div>

                <form action={logoutAction} className="shrink-0">
                  <SignOutButton />
                </form>
              </div>
            </div>
          </header>
          <main className="mt-5 flex-1 sm:mt-6">{children}</main>
          <CopyrightFooter compact />
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
  const resolvedChildren =
    typeof children === "function" ? await children(userId) : children;

  return (
    <AppShell {...props}>{resolvedChildren}</AppShell>
  );
}
