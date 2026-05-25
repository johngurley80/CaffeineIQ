import type { ReactNode } from "react";
import { Icon } from "@/components/icons/Icon";

type AffiliateCardProps = {
  category: string;
  title: string;
  body: string;
  ctaText: string;
  ctaHref: string;
  imageSlot: ReactNode;
  disclosure?: string;
};

export function AffiliateCard({ category, title, body, ctaText, ctaHref, imageSlot, disclosure = "Affiliate link - independently reviewed" }: AffiliateCardProps) {
  return (
    <article className="flex flex-col items-stretch gap-[22px] rounded-2xl border border-border bg-surface p-6 shadow-card sm:flex-row">
      <div className="grid min-h-[160px] w-full flex-none place-items-center rounded-lg border border-border bg-surface-muted p-3 text-center font-mono text-[11px] tracking-wide text-text-secondary sm:w-[140px]">{imageSlot}</div>
      <div className="flex flex-col gap-2 py-1">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">{category}</span>
        <h3 className="font-display text-[28px] font-normal leading-tight text-text-primary">{title}</h3>
        <p className="text-body leading-snug text-text-secondary">{body}</p>
        <a href={ctaHref} className="mt-auto inline-flex self-start items-center gap-2 py-2 text-body font-semibold text-accent transition-[gap] hover:gap-3">
          {ctaText}
          <Icon name="arrow" className="h-4 w-4" />
        </a>
        <p className="mt-0.5 text-[11px] text-text-tertiary">{disclosure}</p>
      </div>
    </article>
  );
}
