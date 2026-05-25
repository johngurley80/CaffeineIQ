import type { ReactNode } from "react";

type HeroBadgeProps = {
  children: ReactNode;
  pulse?: boolean;
};

export function HeroBadge({ children, pulse = true }: HeroBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-[999px] border border-border bg-surface px-3 py-1.5 text-label font-medium text-text-secondary shadow-pill">
      {pulse && <span className="h-1.5 w-1.5 rounded-full bg-accent ring-4 ring-accent-dim" />}
      {children}
    </span>
  );
}
