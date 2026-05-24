import Link from "next/link";
import { isNavigationItemActive, navigationItems } from "./sidebar";

type MobileNavProps = {
  currentPath: string;
};

export function MobileNav({ currentPath }: MobileNavProps) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-2 py-3 backdrop-blur lg:hidden"
    >
      <ul className="grid grid-cols-4 gap-2">
        {navigationItems.map((item) => {
          const isActive = isNavigationItemActive(currentPath, item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-14 items-center justify-center rounded-2xl px-2 text-center text-xs font-medium leading-tight ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-500 hover:bg-stone-100 hover:text-slate-900"
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
