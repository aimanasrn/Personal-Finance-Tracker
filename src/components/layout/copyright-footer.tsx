type CopyrightFooterProps = {
  compact?: boolean;
};

export function CopyrightFooter({
  compact = false
}: CopyrightFooterProps) {
  return (
    <footer
      className={`text-center ${
        compact ? "px-2 py-3" : "mt-6 py-4"
      }`}
    >
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-slate-200" />
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
          Copyright © Aimanasrn
        </p>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-300 to-slate-200" />
      </div>
    </footer>
  );
}
