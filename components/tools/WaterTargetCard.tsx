"use client";

import { useEffect, useState } from "react";
import { getWaterDeficit, getWaterTarget } from "@/lib/hydration";
import { CircularGauge } from "@/components/ui/CircularGauge";
import { ToolCard } from "@/components/ui/ToolCard";
import { Slider } from "@/components/ui/form/Slider";
import { Stepper } from "@/components/ui/form/Stepper";

type WaterTargetCardProps = {
  weight: number;
  onWaterChange: (deficit: number) => void;
};

export function WaterTargetCard({ weight, onWaterChange }: WaterTargetCardProps) {
  const [drinks, setDrinks] = useState(2);
  const [consumed, setConsumed] = useState(1.4);
  const target = getWaterTarget(weight, drinks);
  const deficit = getWaterDeficit(consumed, target);
  const progress = Math.min(consumed, target);

  useEffect(() => {
    onWaterChange(deficit);
  }, [deficit, onWaterChange]);

  return (
    <ToolCard
      title="Your water target"
      badge={deficit > 0.8 ? "Catch up" : "On track"}
      badgeVariant={deficit > 0.8 ? "warning" : "ok"}
      outputValue={target.toFixed(1)}
      outputUnit="L"
      gauge={<CircularGauge value={progress} max={target} label={`${Math.round((progress / target) * 100)}%`} sublabel="done" />}
      caption={`${deficit.toFixed(1)}L left after your caffeine adjustment.`}
    >
      <Stepper label="Caffeinated drinks today" value={drinks} onChange={setDrinks} />
      <Slider label="Water consumed" value={consumed} min={0} max={5} step={0.1} unit="L" onChange={setConsumed} />
    </ToolCard>
  );
}
