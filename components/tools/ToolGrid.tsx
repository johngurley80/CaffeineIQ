"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { trackEvent } from "@/lib/analytics";
import { poundsToKg } from "@/lib/caffeine";
import { InsightStrip } from "@/components/ui/InsightStrip";
import { Icon } from "@/components/icons/Icon";
import { CutoffTimeCard } from "@/components/tools/CutoffTimeCard";
import { CaffeineLookupCard } from "@/components/tools/CaffeineLookupCard";
import { DailyLimitCard } from "@/components/tools/DailyLimitCard";
import { SleepDebtCard } from "@/components/tools/SleepDebtCard";
import { WaterTargetCard } from "@/components/tools/WaterTargetCard";

export function ToolGrid() {
  const [expandedCards, setExpandedCards] = useState([false, false, false, false]);
  useEffect(() => {
    const hasStoredData = Object.keys(window.localStorage).some((key) => key.startsWith("ciq_"));
    setExpandedCards(hasStoredData ? [false, false, false, false] : [true, true, true, true]);
  }, []);
  const [weightRaw, setWeightRaw] = useLocalStorage("ciq_weight_raw", 72);
  const [weightUnit, setWeightUnit] = useLocalStorage<"kg" | "lbs">("ciq_weight_unit", "kg");
  const weightKg = weightUnit === "lbs" ? poundsToKg(weightRaw) : weightRaw;
  const [caffeineConsumed, setCaffeineConsumed] = useLocalStorage("ciq_consumed_today", 0);
  const [drinksCount, setDrinksCount] = useLocalStorage("ciq_drinks_count", 2);
  const [dailyLimit, setDailyLimit] = useState(400);
  const [cutoffTime, setCutoffTime] = useState("1:00 PM");
  const [debt, setDebt] = useState(4);
  const [waterDeficit, setWaterDeficit] = useState(0.9);
  const handleLimit = useCallback((next: number) => setDailyLimit(next), []);
  const handleCutoff = useCallback((next: string) => setCutoffTime(next), []);
  const handleDebt = useCallback((next: number) => setDebt(next), []);
  const handleWater = useCallback((next: number) => setWaterDeficit(next), []);
  const anyExpanded = expandedCards.some(Boolean);
  const setCardExpanded = useCallback((index: number, expanded: boolean) => {
    setExpandedCards((current) => current.map((value, currentIndex) => (currentIndex === index ? expanded : value)));
  }, []);
  const handleCardExpanded = useCallback(
    (index: number, label: string, expanded: boolean) => {
      if (expanded) trackEvent("expand_card", "engagement", label);
      setCardExpanded(index, expanded);
    },
    [setCardExpanded],
  );
  const handleAiLookupAdd = useCallback(
    (drink: { name: string; caffeineMg: number; servingSize: string }) => {
      setCaffeineConsumed(caffeineConsumed + drink.caffeineMg);
      setDrinksCount(drinksCount + 1);

      try {
        const currentLog = JSON.parse(window.localStorage.getItem("ciq_drink_log") || "[]");
        window.localStorage.setItem(
          "ciq_drink_log",
          JSON.stringify([
            {
              id: Date.now(),
              name: drink.name,
              servingMl: 0,
              caffeineMg: drink.caffeineMg,
              time: new Date().toTimeString().slice(0, 5),
            },
            ...currentLog,
          ].slice(0, 8)),
        );
      } catch {
        // If localStorage is unavailable, the total counters still update.
      }
    },
    [caffeineConsumed, drinksCount, setCaffeineConsumed, setDrinksCount],
  );

  return (
    <div id="calculator">
      {/* TODO: mobile layout — stack cards vertically, collapse inputs
      by default, sticky insight strip at bottom */}
      <div className={anyExpanded ? "flex flex-col gap-5 transition-all duration-200 ease-in-out" : "grid items-start gap-5 transition-all duration-200 ease-in-out min-[760px]:grid-cols-2"}>
        {anyExpanded ? (
          <>
            <DailyLimitCard
              weight={weightRaw}
              setWeight={setWeightRaw}
              weightKg={weightKg}
              weightUnit={weightUnit}
              setWeightUnit={setWeightUnit}
              caffeineConsumed={caffeineConsumed}
              onLimitChange={handleLimit}
              expanded={expandedCards[0]}
              onExpandedChange={(expanded) => handleCardExpanded(0, "daily_limit", expanded)}
              singleColumnMode={anyExpanded}
            />
            <CaffeineLookupCard dailyLimit={dailyLimit} caffeineConsumed={caffeineConsumed} onAddDrink={handleAiLookupAdd} />
            <CutoffTimeCard
              caffeineConsumed={caffeineConsumed}
              setCaffeineConsumed={setCaffeineConsumed}
              drinksCount={drinksCount}
              setDrinksCount={setDrinksCount}
              onCutoffChange={handleCutoff}
              expanded={expandedCards[1]}
              onExpandedChange={(expanded) => handleCardExpanded(1, "cutoff_time", expanded)}
              singleColumnMode={anyExpanded}
            />
            <SleepDebtCard
              onDebtChange={handleDebt}
              expanded={expandedCards[2]}
              onExpandedChange={(expanded) => handleCardExpanded(2, "sleep_debt", expanded)}
              singleColumnMode={anyExpanded}
            />
            <WaterTargetCard
              weight={weightKg}
              drinks={drinksCount}
              setDrinks={setDrinksCount}
              onWaterChange={handleWater}
              expanded={expandedCards[3]}
              onExpandedChange={(expanded) => handleCardExpanded(3, "water_target", expanded)}
              singleColumnMode={anyExpanded}
            />
          </>
        ) : (
          <>
            <div className="grid gap-5">
              <DailyLimitCard
                weight={weightRaw}
                setWeight={setWeightRaw}
                weightKg={weightKg}
                weightUnit={weightUnit}
                setWeightUnit={setWeightUnit}
                caffeineConsumed={caffeineConsumed}
                onLimitChange={handleLimit}
                expanded={expandedCards[0]}
                onExpandedChange={(expanded) => handleCardExpanded(0, "daily_limit", expanded)}
                singleColumnMode={anyExpanded}
              />
              <CaffeineLookupCard dailyLimit={dailyLimit} caffeineConsumed={caffeineConsumed} onAddDrink={handleAiLookupAdd} />
              <SleepDebtCard
                onDebtChange={handleDebt}
                expanded={expandedCards[2]}
                onExpandedChange={(expanded) => handleCardExpanded(2, "sleep_debt", expanded)}
                singleColumnMode={anyExpanded}
              />
            </div>
            <div className="grid gap-5">
              <CutoffTimeCard
                caffeineConsumed={caffeineConsumed}
                setCaffeineConsumed={setCaffeineConsumed}
                drinksCount={drinksCount}
                setDrinksCount={setDrinksCount}
                onCutoffChange={handleCutoff}
                expanded={expandedCards[1]}
                onExpandedChange={(expanded) => handleCardExpanded(1, "cutoff_time", expanded)}
                singleColumnMode={anyExpanded}
              />
              <WaterTargetCard
                weight={weightKg}
                drinks={drinksCount}
                setDrinks={setDrinksCount}
                onWaterChange={handleWater}
                expanded={expandedCards[3]}
                onExpandedChange={(expanded) => handleCardExpanded(3, "water_target", expanded)}
                singleColumnMode={anyExpanded}
              />
            </div>
          </>
        )}
      </div>
      <p className="mt-3 flex items-center gap-2 text-left text-[12px] leading-snug text-text-tertiary">
        <Icon name="lock" className="h-3.5 w-3.5" />
        No personal data is stored on our servers
      </p>
      <div className="mt-4 flex flex-col gap-3 rounded-md border border-border bg-surface px-4 py-3 text-body text-text-secondary shadow-pill sm:flex-row sm:items-center sm:justify-between">
        <p>Your calculator inputs are saved only in this browser. CaffeineIQ does not send or store them on a server.</p>
        <button
          type="button"
          className="self-start rounded-xs border border-border bg-surface-muted px-3 py-2 font-semibold text-text-primary hover:bg-accent-dim sm:self-auto"
          onClick={() => {
            trackEvent("reset_inputs", "engagement", "reset");
            [
              "ciq_weight_raw",
              "ciq_weight_unit",
              "ciq_pregnant",
              "ciq_health_conditions",
              "ciq_consumed_today",
              "ciq_drink_name",
              "ciq_drink_log",
              "ciq_serving_ml",
              "ciq_caffeine_mg",
              "ciq_last_coffee_time",
              "ciq_bedtime",
              "ciq_sleep_hours",
              "ciq_sleep_target",
              "ciq_drinks_count",
              "ciq_water_consumed",
              "ciq_cookie_notice_dismissed",
            ].forEach((key) => window.localStorage.removeItem(key));
            window.location.reload();
          }}
        >
          Reset saved inputs
        </button>
      </div>
      <InsightStrip
        debt={debt}
        waterDeficit={waterDeficit}
        caffeineConsumed={caffeineConsumed}
        dailyLimit={dailyLimit}
        cutoffTime={cutoffTime}
      />
    </div>
  );
}
