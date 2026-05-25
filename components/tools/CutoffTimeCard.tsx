"use client";

import { useState } from "react";
import { getCutoffTime } from "@/lib/caffeine";
import { DecayCurveChart } from "@/components/ui/DecayCurveChart";
import { ToolCard } from "@/components/ui/ToolCard";
import { Slider } from "@/components/ui/form/Slider";
import { TimeInput } from "@/components/ui/form/TimeInput";

export function CutoffTimeCard() {
  const [lastCoffeeTime, setLastCoffeeTime] = useState("14:00");
  const [mgConsumed, setMgConsumed] = useState(180);
  const [bedtime, setBedtime] = useState("23:00");
  const cutoff = getCutoffTime(lastCoffeeTime, mgConsumed, bedtime);

  return (
    <ToolCard
      title="Your cut-off time"
      badge="5h half-life"
      outputValue={cutoff}
      outputTone="accent"
      caption="Stop by this time to fall below the 50mg sleep-quality threshold."
      belowOutput={<DecayCurveChart lastCoffeeTime={lastCoffeeTime} mgConsumed={mgConsumed} bedtime={bedtime} />}
    >
      <TimeInput label="Last drink time" value={lastCoffeeTime} onChange={setLastCoffeeTime} />
      <Slider label="Caffeine in drink" value={mgConsumed} min={40} max={320} step={10} unit="mg" onChange={setMgConsumed} />
      <TimeInput label="Target bedtime" value={bedtime} onChange={setBedtime} />
    </ToolCard>
  );
}
