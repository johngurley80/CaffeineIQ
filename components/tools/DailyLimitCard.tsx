"use client";

import { useEffect } from "react";
import { useDebouncedTrackEvent } from "@/hooks/useDebouncedTrackEvent";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getDailyLimit } from "@/lib/caffeine";
import { CircularGauge } from "@/components/ui/CircularGauge";
import { ToolCard } from "@/components/ui/ToolCard";
import { Slider } from "@/components/ui/form/Slider";
import { Toggle } from "@/components/ui/form/Toggle";

type DailyLimitCardProps = {
  weight: number;
  setWeight: (weight: number) => void;
  weightKg: number;
  weightUnit: "kg" | "lbs";
  setWeightUnit: (unit: "kg" | "lbs") => void;
  caffeineConsumed: number;
  onLimitChange: (limit: number) => void;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  singleColumnMode: boolean;
};

const conditionOptions = [
  {
    label: "High blood pressure",
    value: "hypertension",
    warning: "With high blood pressure, most cardiologists recommend staying under 200mg/day.",
  },
  {
    label: "Anxiety disorder",
    value: "anxiety",
    warning: "Caffeine can amplify anxiety symptoms. A lower limit is recommended.",
  },
  {
    label: "Kidney disease",
    value: "kidney_disease",
    warning: "Your kidneys process caffeine more slowly. A 150mg daily limit is advised.",
  },
];

export function DailyLimitCard({
  weight,
  setWeight,
  weightKg,
  weightUnit,
  setWeightUnit,
  caffeineConsumed,
  onLimitChange,
  expanded,
  onExpandedChange,
  singleColumnMode,
}: DailyLimitCardProps) {
  const [pregnant, setPregnant] = useLocalStorage("ciq_pregnant", false);
  const [healthConditions, setHealthConditions] = useLocalStorage<string[]>("ciq_health_conditions", []);
  const limit = getDailyLimit(weightKg, pregnant, healthConditions);
  const remaining = Math.max(0, limit - caffeineConsumed);
  const activeWarnings = conditionOptions.filter((condition) => healthConditions.includes(condition.value));
  const weightRange = weightUnit === "kg" ? { min: 40, max: 200 } : { min: 88, max: 440 };
  const healthConditionKey = healthConditions.join("|");

  useEffect(() => {
    onLimitChange(limit);
  }, [limit, onLimitChange]);

  useDebouncedTrackEvent(
    [weight, weightUnit, pregnant, healthConditionKey],
    "calculate_limit",
    "tool",
    "daily_limit",
  );

  const toggleCondition = (value: string) => {
    setHealthConditions(
      healthConditions.includes(value)
        ? healthConditions.filter((condition) => condition !== value)
        : [...healthConditions, value],
    );
  };

  return (
    <ToolCard
      title="Your daily limit"
      badge={remaining === 0 ? "limit hit" : pregnant ? "200mg cap" : healthConditions.length > 0 ? "caution" : "FDA-aligned"}
      badgeVariant={remaining === 0 || pregnant || healthConditions.length > 0 ? "warning" : "ok"}
      outputValue={String(remaining)}
      outputUnit="mg"
      outputTone={remaining === 0 ? "warning" : "accent"}
      outputSize="daily"
      outputClassName={remaining === 0 ? "text-warning" : "text-[#1c1917]"}
      gauge={<CircularGauge value={remaining} max={limit} label={`${Math.round((remaining / limit) * 100)}%`} sublabel="left" />}
      caption={`${limit}mg daily limit · ${caffeineConsumed}mg logged today`}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      singleColumnMode={singleColumnMode}
      belowOutput={
        activeWarnings.length > 0 && (
          <div className="rounded-sm border border-warning/30 bg-warning-dim px-3 py-2 text-[12px] leading-snug text-warning">
            {activeWarnings.map((condition) => (
              <p key={condition.value}>{condition.warning}</p>
            ))}
          </div>
        )
      }
    >
      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-body font-medium text-text-secondary">Bodyweight</span>
          <div className="flex rounded-xs border border-border bg-surface-muted p-1">
            {(["kg", "lbs"] as const).map((unit) => (
              <button
                key={unit}
                type="button"
                className={`rounded-xs px-3 py-1 text-[12px] font-semibold ${weightUnit === unit ? "bg-accent text-text-on-accent" : "text-text-secondary"}`}
                onClick={() => setWeightUnit(unit)}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>
        <Slider label={`Weight (${weightUnit})`} value={weight} min={weightRange.min} max={weightRange.max} unit={weightUnit} onChange={setWeight} />
      </div>
      <Toggle label="Pregnant or breastfeeding" checked={pregnant} onChange={setPregnant} />
      <div className="grid gap-2">
        <p className="text-body font-medium text-text-secondary">Health conditions</p>
        {conditionOptions.map((condition) => (
          <Toggle
            key={condition.value}
            label={condition.label}
            checked={healthConditions.includes(condition.value)}
            onChange={() => toggleCondition(condition.value)}
          />
        ))}
      </div>
    </ToolCard>
  );
}
