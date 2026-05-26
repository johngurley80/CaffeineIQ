"use client";

import { useEffect } from "react";
import { useDebouncedTrackEvent } from "@/hooks/useDebouncedTrackEvent";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getWaterDeficit, getWaterTarget } from "@/lib/hydration";
import { CircularGauge } from "@/components/ui/CircularGauge";
import { ToolCard } from "@/components/ui/ToolCard";
import { Slider } from "@/components/ui/form/Slider";
import { Stepper } from "@/components/ui/form/Stepper";

type WaterTargetCardProps = {
  weight: number;
  drinks: number;
  setDrinks: (drinks: number) => void;
  onWaterChange: (deficit: number) => void;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  singleColumnMode: boolean;
};

export function WaterTargetCard({ weight, drinks, setDrinks, onWaterChange, expanded, onExpandedChange, singleColumnMode }: WaterTargetCardProps) {
  // Keep ciq_water_consumed: it backs the visible "Water consumed" slider.
  const [consumed, setConsumed] = useLocalStorage("ciq_water_consumed", 1.4);
  const target = getWaterTarget(weight, drinks);
  const deficit = getWaterDeficit(consumed, target);
  const progress = Math.min(consumed, target);

  useEffect(() => {
    onWaterChange(deficit);
  }, [deficit, onWaterChange]);

  useDebouncedTrackEvent([weight, drinks], "calculate_water", "tool", "water_target");

  return (
    <ToolCard
      title="Your water target"
      badge={deficit > 0.8 ? "Catch up" : "On track"}
      badgeVariant={deficit > 0.8 ? "warning" : "ok"}
      outputValue={target.toFixed(1)}
      outputUnit="L"
      outputSize="large"
      outputClassName="text-[#1c1917]"
      gauge={<CircularGauge value={progress} max={target} label={`${Math.round((progress / target) * 100)}%`} sublabel="done" />}
      caption={`${deficit.toFixed(1)}L left after your caffeine adjustment.`}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      singleColumnMode={singleColumnMode}
    >
      <Stepper label="Caffeinated drinks today" value={drinks} onChange={setDrinks} />
      <Slider label="Water consumed" value={consumed} min={0} max={5} step={0.1} unit="L" onChange={setConsumed} />
    </ToolCard>
  );
}
