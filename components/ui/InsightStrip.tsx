"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { composeInsight } from "@/lib/insights";

type InsightStripProps = {
  debt: number;
  waterDeficit: number;
  caffeineConsumed: number;
  dailyLimit: number;
  cutoffTime: string;
  updatedLive?: boolean;
  variant?: "sleep" | "water" | "default";
};

function clockToMinutes(clock: string) {
  const match = clock.match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/);
  if (!match) return Number.POSITIVE_INFINITY;
  const [, hourRaw, minuteRaw, period] = match;
  const hour = Number(hourRaw) % 12;
  const minutes = Number(minuteRaw);
  return (period === "PM" ? hour + 12 : hour) * 60 + minutes;
}

function getCurrentMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function getInsightType({
  debt,
  waterDeficit,
  caffeineConsumed,
  dailyLimit,
  cutoffPassed,
}: {
  debt: number;
  waterDeficit: number;
  caffeineConsumed: number;
  dailyLimit: number;
  cutoffPassed: boolean;
}) {
  if (cutoffPassed) return "cutoff_passed";
  if (debt > 5) return "sleep_debt";
  if (dailyLimit > 0 && caffeineConsumed >= dailyLimit * 0.8) return "caffeine_limit";
  if (waterDeficit >= 0.8) return "water_deficit";
  if (debt >= 2) return "sleep_debt";
  return "all_clear";
}

export function InsightStrip({
  debt,
  waterDeficit,
  caffeineConsumed,
  dailyLimit,
  cutoffTime,
  updatedLive = true,
}: InsightStripProps) {
  const [currentMinutes, setCurrentMinutes] = useState<number | null>(null);
  const lastTrackedInsight = useRef<string | null>(null);
  const cutoffPassed = currentMinutes !== null && currentMinutes > clockToMinutes(cutoffTime);
  const text = composeInsight({ debt, waterDeficit, caffeineConsumed, dailyLimit, cutoffPassed });
  const insightType = getInsightType({ debt, waterDeficit, caffeineConsumed, dailyLimit, cutoffPassed });
  const showSleepCta =
    !cutoffPassed &&
    (debt > 5 || (debt >= 2 && !(dailyLimit > 0 && caffeineConsumed >= dailyLimit * 0.8) && waterDeficit < 0.8));

  useEffect(() => {
    setCurrentMinutes(getCurrentMinutes());
    const interval = window.setInterval(() => setCurrentMinutes(getCurrentMinutes()), 60000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentMinutes === null || lastTrackedInsight.current === insightType) return;
    lastTrackedInsight.current = insightType;
    trackEvent("insight_viewed", "engagement", insightType);
  }, [currentMinutes, insightType]);

  return (
    <aside className="mt-[22px]">
      <div className="flex flex-col gap-4 rounded-md border-l-[3px] border-l-[#c4622d] bg-accent px-[22px] py-5 shadow-card md:flex-row md:items-center md:justify-between">
        <p className="text-[18px] font-medium leading-snug text-[#faf7f2]">{text}</p>
        {showSleepCta && (
          <a
            href="https://ouraring.com/"
            className="inline-flex flex-none items-center justify-center rounded-xs bg-warning px-[14px] py-2 text-body font-semibold text-white"
          >
            Track your sleep →
          </a>
        )}
      </div>
      {updatedLive && (
        <p className="mt-2 font-mono text-[11px] uppercase tracking-wide text-text-tertiary">
          Updates live as you adjust the cards
        </p>
      )}
    </aside>
  );
}
