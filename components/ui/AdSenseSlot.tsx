"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSenseSlotProps = {
  slot: "home-mid" | "blog-top" | "blog-inline" | "blog-bottom";
};

const slots: Record<AdSenseSlotProps["slot"], string> = {
  "home-mid": "1000000001",
  "blog-top": "1000000002",
  "blog-inline": "1000000003",
  "blog-bottom": "1000000004",
};

export function AdSenseSlot({ slot }: AdSenseSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const isProduction = process.env.NODE_ENV === "production" && Boolean(client);

  useEffect(() => {
    if (!isProduction) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ad blockers can throw; the reserved slot prevents layout shift.
    }
  }, [isProduction, slot]);

  return (
    <div className="relative my-8 grid min-h-[180px] place-items-center rounded-xl border border-dashed border-border bg-surface-muted/60 text-[11px] uppercase tracking-widest text-text-tertiary">
      {!isProduction ? (
        <span>Ad</span>
      ) : (
        <ins className="adsbygoogle block h-full w-full" data-ad-client={client} data-ad-slot={slots[slot]} data-ad-format="auto" data-full-width-responsive="true" />
      )}
    </div>
  );
}
