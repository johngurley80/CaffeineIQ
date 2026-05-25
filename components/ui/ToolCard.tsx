import type { ReactNode } from "react";

type ToolCardProps = {
  title: string;
  badge: string;
  badgeVariant?: "default" | "ok" | "warning" | "danger";
  outputValue: string;
  outputUnit?: string;
  outputTone?: "accent" | "warning" | "danger";
  gauge?: ReactNode;
  caption?: ReactNode;
  belowOutput?: ReactNode;
  children: ReactNode;
};

const badgeClasses = {
  default: "border-border bg-surface-muted text-text-secondary",
  ok: "border-accent/30 bg-accent-dim text-accent",
  warning: "border-warning/30 bg-warning-dim text-warning",
  danger: "border-danger/30 bg-danger-dim text-danger",
};

const toneClasses = {
  accent: "text-accent",
  warning: "text-warning",
  danger: "text-danger",
};

export function ToolCard({ title, badge, badgeVariant = "default", outputValue, outputUnit, outputTone = "accent", gauge, caption, belowOutput, children }: ToolCardProps) {
  return (
    <section className="flex min-h-[460px] flex-col rounded-2xl border border-border bg-surface p-6 shadow-card">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-label font-semibold uppercase tracking-wide text-text-secondary">{title}</h2>
        <span className={`rounded-[999px] border px-2 py-0.5 text-[11px] font-semibold tracking-wide ${badgeClasses[badgeVariant]}`}>{badge}</span>
      </div>
      <div className="mb-5 flex items-end gap-[18px]">
        <div className="min-w-0">
          <div className={`font-mono text-number font-semibold tabular-nums max-[420px]:text-[52px] ${toneClasses[outputTone]}`}>
            {outputValue}
            {outputUnit && <span className="ml-0.5 text-xl font-medium text-text-secondary">{outputUnit}</span>}
          </div>
          {caption && <p className="max-w-[22ch] text-body leading-snug text-text-secondary">{caption}</p>}
        </div>
        {gauge && <div className="ml-auto flex-none">{gauge}</div>}
      </div>
      {belowOutput && <div className="mb-5">{belowOutput}</div>}
      <div className="mt-auto flex flex-col gap-[14px] border-t border-border pt-2">{children}</div>
    </section>
  );
}
