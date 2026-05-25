"use client";

import { useState } from "react";
import type { AgeRange } from "@/lib/caffeine";
import { getDailyLimit } from "@/lib/caffeine";
import { CircularGauge } from "@/components/ui/CircularGauge";
import { ToolCard } from "@/components/ui/ToolCard";
import { Select } from "@/components/ui/form/Select";
import { Slider } from "@/components/ui/form/Slider";
import { Toggle } from "@/components/ui/form/Toggle";

type DailyLimitCardProps = {
  weight: number;
  setWeight: (weight: number) => void;
};

const ageOptions: { label: string; value: AgeRange }[] = [
  { label: "18-24", value: "18-24" },
  { label: "25-34", value: "25-34" },
  { label: "35-44", value: "35-44" },
  { label: "45-54", value: "45-54" },
  { label: "55+", value: "55+" },
];

export function DailyLimitCard({ weight, setWeight }: DailyLimitCardProps) {
  const [ageBand, setAgeBand] = useState<AgeRange>("25-34");
  const [pregnant, setPregnant] = useState(false);
  const limit = getDailyLimit(weight, ageBand, pregnant);

  return (
    <ToolCard
      title="Your daily limit"
      badge={pregnant ? "200mg cap" : "FDA-aligned"}
      badgeVariant={pregnant ? "warning" : "ok"}
      outputValue={String(limit)}
      outputUnit="mg"
      gauge={<CircularGauge value={limit} max={400} label={`${Math.round((limit / 400) * 100)}%`} sublabel="of cap" />}
      caption="A personalised ceiling based on bodyweight, age band, and pregnancy status."
    >
      <Slider label="Bodyweight" value={weight} min={40} max={130} unit="kg" onChange={setWeight} />
      <Select label="Age band" value={ageBand} options={ageOptions} onChange={(value) => setAgeBand(value as AgeRange)} />
      <Toggle label="Pregnant or breastfeeding" checked={pregnant} onChange={setPregnant} />
    </ToolCard>
  );
}
