import Link from "next/link";
import { BrandLogo } from "@/components/branding/brand-logo";

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
      <div className="glass-panel sticky top-6 overflow-hidden rounded-[2rem] p-6">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent" />
        <BrandLogo href="/" size="sm" />
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">
          Your money, in one calm place.
        </h2>
        <nav aria-label="Primary" className="mt-8 space-y-2.5">
          {navigationItems.map((item) => {
            const isActive = isNavigationItemActive(currentPath, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`interactive-lift block rounded-2xl px-4 py-3 text-sm font-medium ${
                  isActive
                    ? "bg-brand-50 text-brand-700 shadow-[inset_0_0_0_1px_rgba(15,138,120,0.16)]"
                    : "text-slate-600 hover:bg-white/80 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 rounded-[1.5rem] bg-slate-900 px-4 py-4 text-sm leading-6 text-slate-200">
          Move between your core money views here on desktop, with matching
          navigation pinned on mobile.
        </div>
      </div>
    </aside>
  );
}
