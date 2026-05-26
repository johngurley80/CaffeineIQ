"use client";

import type { ReactNode } from "react";

type ToolCardProps = {
  title: string;
  badge: string;
  badgeTooltip?: string;
  badgeVariant?: "default" | "ok" | "warning" | "danger";
  outputValue: string;
  outputUnit?: string;
  outputTone?: "accent" | "warning" | "danger";
  outputSize?: "standard" | "daily" | "large";
  outputClassName?: string;
  gauge?: ReactNode;
  caption?: ReactNode;
  underMetric?: ReactNode;
  belowOutput?: ReactNode;
  accentBorder?: boolean;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  singleColumnMode: boolean;
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

const outputSizeClasses = {
  standard: "text-[72px]",
  daily: "text-[80px]",
  large: "text-[72px]",
};

export function ToolCard({
  title,
  badge,
  badgeTooltip,
  badgeVariant = "default",
  outputValue,
  outputUnit,
  outputTone = "accent",
  outputSize = "standard",
  outputClassName,
  gauge,
  caption,
  underMetric,
  belowOutput,
  accentBorder = false,
  expanded,
  onExpandedChange,
  singleColumnMode,
  children,
}: ToolCardProps) {
  const metricBlock = (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">{title}</h2>
        <span className={`relative inline-flex items-center gap-1 rounded-[999px] border px-2 py-0.5 text-[11px] font-semibold tracking-wide ${badgeClasses[badgeVariant]}`}>
          {badge}
          {badgeTooltip && (
            <span className="group relative cursor-help text-text-tertiary" aria-label={badgeTooltip}>
              ⓘ
              <span className="pointer-events-none absolute right-0 top-full z-50 mt-2 hidden w-[280px] rounded-sm border border-border bg-surface px-3 py-2 text-left text-[12px] font-normal leading-snug text-text-secondary shadow-card group-hover:block">
                {badgeTooltip}
              </span>
            </span>
          )}
        </span>
      </div>
      <div className="flex items-end gap-[18px]">
        <div className="min-w-0">
          <div
            className={`font-mono ${outputSizeClasses[outputSize]} font-[300] leading-[0.9] tabular-nums max-[420px]:text-[52px] ${
              outputClassName ?? toneClasses[outputTone]
            }`}
          >
            {outputValue}
            {outputUnit && <span className="ml-1 align-super text-[24px] font-[300] leading-none text-text-secondary">{outputUnit}</span>}
          </div>
          {underMetric && <p className="mt-2 text-[13px] leading-snug text-text-tertiary">{underMetric}</p>}
          {caption && <p className="mt-1 max-w-[30ch] text-[13px] leading-snug text-text-secondary">{caption}</p>}
        </div>
        {gauge && <div className="ml-auto flex-none">{gauge}</div>}
      </div>
      {belowOutput && <div className="mt-5">{belowOutput}</div>}
    </>
  );

  if (singleColumnMode && expanded) {
    return (
      <section
        className={`rounded-2xl border border-border bg-surface p-6 shadow-card transition-all duration-200 ease-in-out ${
          accentBorder ? "border-l-[3px] border-l-warning" : ""
        }`}
      >
        <div className="grid gap-6 min-[760px]:grid-cols-[minmax(0,40%)_minmax(0,60%)]">
          <div>{metricBlock}</div>
          <div className="flex flex-col gap-[14px] border-t border-border pt-5 min-[760px]:border-l min-[760px]:border-t-0 min-[760px]:pl-6 min-[760px]:pt-0">
            {children}
            <button
              type="button"
              className="mt-1 self-end rounded-[999px] border border-border bg-surface-muted px-3 py-0.5 text-[11px] font-semibold text-text-tertiary hover:bg-border"
              onClick={() => onExpandedChange(false)}
              aria-expanded={expanded}
            >
              Hide ↑
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-card transition-all duration-200 ease-in-out ${
        accentBorder ? "border-l-[3px] border-l-warning" : ""
      }`}
    >
      <div className="mb-5">{metricBlock}</div>
      <div className="relative mt-1 border-t border-border">
        <button
          type="button"
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-border bg-surface-muted px-3 py-0.5 text-[11px] font-semibold text-text-tertiary hover:bg-border"
          onClick={() => onExpandedChange(!expanded)}
          aria-expanded={expanded}
        >
          {expanded ? "Hide ↑" : "Adjust ↓"}
        </button>
      </div>
      <div className={`overflow-hidden transition-[max-height] duration-300 ${expanded ? "max-h-[900px]" : "max-h-0"}`}>
        <div className="flex flex-col gap-[14px] pt-5">{children}</div>
      </div>
    </section>
  );
}
