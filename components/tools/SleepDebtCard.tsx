"use client";

import { useEffect } from "react";
import { useDebouncedTrackEvent } from "@/hooks/useDebouncedTrackEvent";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { classifyDebt, getSleepDebt } from "@/lib/sleep";
import { CircularGauge } from "@/components/ui/CircularGauge";
import { ToolCard } from "@/components/ui/ToolCard";
import { Slider } from "@/components/ui/form/Slider";

type SleepDebtCardProps = {
  onDebtChange: (debt: number) => void;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  singleColumnMode: boolean;
};

const days = ["M", "T", "W", "T", "F", "S", "S"];

export function SleepDebtCard({ onDebtChange, expanded, onExpandedChange, singleColumnMode }: SleepDebtCardProps) {
  const [target, setTarget] = useLocalStorage("ciq_sleep_target", 8);
  const [hours, setHours] = useLocalStorage("ciq_sleep_hours", [7, 7.5, 6.5, 7, 6, 8, 8]);
  const debt = getSleepDebt(hours, target);
  const tone = classifyDebt(debt);
  const hoursKey = hours.join("|");

  useEffect(() => {
    onDebtChange(debt);
  }, [debt, onDebtChange]);

  useDebouncedTrackEvent([target, hoursKey], "calculate_sleep_debt", "tool", "sleep_debt");

  return (
    <ToolCard
      title="Your sleep debt"
      badge={tone === "ok" ? "Stable" : "Tolerance hit"}
      badgeVariant={tone}
      outputValue={debt.toFixed(debt % 1 ? 1 : 0)}
      outputUnit="h"
      outputTone={tone === "ok" ? "accent" : tone}
      outputClassName={debt > 5 ? "text-[#b91c1c]" : debt >= 2 ? "text-warning" : "text-accent"}
      gauge={<CircularGauge value={Math.min(debt, 10)} max={10} label={tone} sublabel="risk" color={debt > 5 ? "#b91c1c" : tone === "ok" ? "#3d1f0d" : "#c4622d"} />}
      caption="Seven-day shortage versus your target sleep duration."
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      singleColumnMode={singleColumnMode}
    >
      <Slider label="Sleep target" value={target} min={6} max={9} step={0.5} unit="h" onChange={setTarget} />
      <div className="grid grid-cols-7 gap-1.5">
        {hours.map((hour, index) => (
          <label key={`${days[index]}-${index}`} className="flex flex-col items-center gap-1">
            <span className="text-[10px] tracking-wider text-text-tertiary">{days[index]}</span>
            <input
              value={hour}
              type="number"
              min={0}
              max={12}
              step={0.5}
              onChange={(event) => {
                const next = [...hours];
                next[index] = Number(event.target.value);
                setHours(next);
              }}
              className="w-full rounded-xs border border-border bg-surface-muted px-1 py-2 text-center font-mono text-body tabular-nums focus:border-ink/45 focus:outline-none"
            />
          </label>
        ))}
      </div>
    </ToolCard>
  );
}
