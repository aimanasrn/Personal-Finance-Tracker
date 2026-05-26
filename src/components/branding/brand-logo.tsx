import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  priority?: boolean;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
};

const sizeMap = {
  sm: {
    icon: "h-9 w-9",
    wordmark: "text-lg"
  },
  md: {
    icon: "h-11 w-11",
    wordmark: "text-xl"
  },
  lg: {
    icon: "h-14 w-14",
    wordmark: "text-2xl"
  }
} as const;

function BrandLogoInner({
  priority = false,
  size = "md",
  showWordmark = true
}: Omit<BrandLogoProps, "href">) {
  const tokens = sizeMap[size];

  return (
    <span className="inline-flex items-center gap-3">
      <span
        className={`relative overflow-hidden rounded-2xl border border-white/70 bg-white/85 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ${tokens.icon}`}
      >
        <Image
          src="/branding/logo.png"
          alt="CashNest logo"
          fill
          priority={priority}
          className="object-cover"
          sizes="(max-width: 768px) 56px, 64px"
        />
      </span>
      {showWordmark ? (
        <span className="flex flex-col">
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-brand-700">
            CashNest
          </span>
          <span className={`font-semibold tracking-tight text-slate-900 ${tokens.wordmark}`}>
            Personal Finance Tracker
          </span>
        </span>
      ) : null}
    </span>
  );
}

export function BrandLogo(props: BrandLogoProps) {
  if (!props.href) {
    return (
      <BrandLogoInner
        priority={props.priority}
        size={props.size}
        showWordmark={props.showWordmark}
      />
    );
  }

  return (
    <Link href={props.href} className="inline-flex">
      <BrandLogoInner
        priority={props.priority}
        size={props.size}
        showWordmark={props.showWordmark}
      />
    </Link>
  );
}
