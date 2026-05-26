import { Icon } from "@/components/icons/Icon";

type AffiliateCardProps = {
  category: string;
  title: string;
  body: string;
  ctaText: string;
  ctaHref: string;
  disclosure?: string;
};

export function AffiliateCard({ category, title, body, ctaText, ctaHref, disclosure = "Affiliate link - independently reviewed" }: AffiliateCardProps) {
  return (
    <article className="flex h-full flex-col gap-2 rounded-2xl border border-border border-l-[3px] border-l-border bg-surface p-6 shadow-card">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">{category}</span>
      <h3 className="font-display text-[28px] font-normal leading-tight text-text-primary">{title}</h3>
      <p className="text-body leading-snug text-text-secondary">{body}</p>
      <a href={ctaHref} className="mt-auto inline-flex self-start items-center gap-2 py-2 text-body font-semibold text-accent transition-[gap] hover:gap-3">
        {ctaText}
        <Icon name="arrow" className="h-4 w-4" />
      </a>
      <p className="mt-0.5 text-[11px] text-text-tertiary">{disclosure}</p>
    </article>
  );
}
