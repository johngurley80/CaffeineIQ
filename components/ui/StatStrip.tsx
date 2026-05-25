import type { ReactNode } from "react";

type StatStripProps = {
  headline: ReactNode;
  stats: { value: string; label: string }[];
};

export function StatStrip({ headline, stats }: StatStripProps) {
  return (
    <section className="grid items-center gap-7 rounded-3xl border border-border bg-surface p-8 shadow-card md:grid-cols-[1.2fr_repeat(3,1fr)]">
      <div className="text-base font-medium text-text-primary">{headline}</div>
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1 border-l border-border pl-[22px]">
          <span className="font-mono text-[26px] font-semibold tabular-nums text-text-primary">{stat.value}</span>
          <span className="text-label uppercase tracking-wide text-text-secondary">{stat.label}</span>
        </div>
      ))}
    </section>
  );
}
