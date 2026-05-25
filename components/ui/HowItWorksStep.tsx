import type { ReactNode } from "react";

type HowItWorksStepProps = {
  number: string;
  icon: ReactNode;
  title: string;
  body: string;
};

export function HowItWorksStep({ number, icon, title, body }: HowItWorksStepProps) {
  return (
    <article className="relative rounded-xl border border-border bg-surface px-6 py-7 shadow-card">
      <span className="absolute right-6 top-6 font-mono text-[12px] tracking-wider text-text-tertiary">{number}</span>
      <div className="mb-[18px] grid h-[42px] w-[42px] place-items-center rounded-md border border-ink/15 bg-ink-dim text-ink">{icon}</div>
      <h3 className="mb-1.5 text-lg font-semibold text-text-primary">{title}</h3>
      <p className="text-body leading-snug text-text-secondary">{body}</p>
    </article>
  );
}
