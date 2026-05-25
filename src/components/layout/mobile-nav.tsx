import Link from "next/link";
import { isNavigationItemActive, navigationItems } from "./sidebar";

type MobileNavProps = {
  currentPath: string;
};

export function MobileNav({ currentPath }: MobileNavProps) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-20 px-3 pb-3 pt-2 backdrop-blur lg:hidden"
    >
      <ul className="glass-panel mx-auto grid max-w-2xl grid-cols-4 gap-2 rounded-[1.75rem] px-2 py-2 shadow-[0_20px_40px_rgba(15,23,42,0.14)]">
        {navigationItems.map((item) => {
          const isActive = isNavigationItemActive(currentPath, item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`interactive-lift flex min-h-14 items-center justify-center rounded-2xl px-2 text-center text-xs font-medium leading-tight ${
                  isActive
                    ? "bg-brand-50 text-brand-700 shadow-[inset_0_0_0_1px_rgba(15,138,120,0.16)]"
                    : "text-slate-500 hover:bg-white hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
