"use client";

import { useCallback, useState } from "react";
import { composeInsight } from "@/lib/insights";
import { InsightStrip } from "@/components/ui/InsightStrip";
import { CutoffTimeCard } from "@/components/tools/CutoffTimeCard";
import { DailyLimitCard } from "@/components/tools/DailyLimitCard";
import { SleepDebtCard } from "@/components/tools/SleepDebtCard";
import { WaterTargetCard } from "@/components/tools/WaterTargetCard";

export function ToolGrid() {
  const [weight, setWeight] = useState(72);
  const [debt, setDebt] = useState(4);
  const [waterDeficit, setWaterDeficit] = useState(0.9);
  const handleDebt = useCallback((next: number) => setDebt(next), []);
  const handleWater = useCallback((next: number) => setWaterDeficit(next), []);

  return (
    <div id="calculator">
      <div className="grid gap-5 min-[760px]:grid-cols-2">
        <DailyLimitCard weight={weight} setWeight={setWeight} />
        <CutoffTimeCard />
        <SleepDebtCard onDebtChange={handleDebt} />
        <WaterTargetCard weight={weight} onWaterChange={handleWater} />
      </div>
      <InsightStrip text={composeInsight({ debt, waterDeficit })} />
    </div>
  );
}
