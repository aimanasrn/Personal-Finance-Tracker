import Link from "next/link";

export const navigationItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transactions", label: "Transactions" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" }
] as const;

export function isNavigationItemActive(currentPath: string, href: string) {
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

type SidebarProps = {
  currentPath: string;
};

export function Sidebar({ currentPath }: SidebarProps) {
  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      <div className="sticky top-6 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
          CashNest
        </p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
          Your money, in one calm place.
        </h2>
        <nav aria-label="Primary" className="mt-8 space-y-2">
          {navigationItems.map((item) => {
            const isActive = isNavigationItemActive(currentPath, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-stone-100 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <p className="mt-8 text-sm leading-6 text-slate-500">
          Move between your core money views here on desktop, with matching
          navigation pinned on mobile.
        </p>
      </div>
    </aside>
  );
}
