import type { ReactNode } from "react";

type StatStripProps = {
  headline: ReactNode;
};

export function StatStrip({ headline }: StatStripProps) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-8 text-center shadow-card">
      <div className="mx-auto max-w-[820px]">
        <p className="text-base font-medium leading-snug text-text-primary">{headline}</p>
        <p className="mt-3 text-body leading-snug text-text-secondary">
          Personalised to your weight · No account needed · Stays on your device
        </p>
      </div>
    </section>
  );
}
