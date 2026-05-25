import Link from "next/link";
import { Icon } from "@/components/icons/Icon";

type ToolCTAProps = {
  slot: string;
};

export function ToolCTA({ slot }: ToolCTAProps) {
  return (
    <aside className="my-8 rounded-2xl border border-border bg-surface p-6 shadow-card">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">CaffeineIQ tool</p>
      <h3 className="mt-2 font-display text-[30px] font-normal leading-tight text-text-primary">{slot}</h3>
      <Link href="/#calculator" className="mt-4 inline-flex items-center gap-2 rounded-xs border border-accent bg-accent px-[14px] py-2 text-body font-semibold text-text-on-accent">
        Open the calculator
        <Icon name="arrow" className="h-4 w-4" />
      </Link>
    </aside>
  );
}
