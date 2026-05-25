import { Icon } from "@/components/icons/Icon";

type InsightStripProps = {
  text: string;
  updatedLive?: boolean;
  variant?: "sleep" | "water" | "default";
};

export function InsightStrip({ text, updatedLive = true }: InsightStripProps) {
  return (
    <aside className="mt-[22px] flex items-center gap-4 rounded-md border border-l-thick border-border border-l-ink bg-surface px-[22px] py-[18px] shadow-card">
      <span className="grid h-9 w-9 flex-none place-items-center rounded-sm bg-ink-dim text-ink">
        <Icon name="spark" className="h-4 w-4" />
      </span>
      <p className="font-display text-[19px] italic leading-snug text-text-primary">
        {text}
        {updatedLive && <span className="mt-1 block font-ui text-[12px] font-normal uppercase tracking-wide text-text-secondary not-italic">Updates live as you adjust the cards</span>}
      </p>
    </aside>
  );
}
