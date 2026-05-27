"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDebouncedTrackEvent } from "@/hooks/useDebouncedTrackEvent";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import drinks from "@/data/drinks.json";
import { getCutoffTime } from "@/lib/caffeine";
import { trackEvent } from "@/lib/analytics";
import { formatClock24, timeToMinutes } from "@/lib/time";
import { DecayCurveChart } from "@/components/ui/DecayCurveChart";
import { ToolCard } from "@/components/ui/ToolCard";
import { DrinkCombobox, type Drink } from "@/components/ui/form/DrinkCombobox";
import { TimeInput } from "@/components/ui/form/TimeInput";

type CutoffTimeCardProps = {
  caffeineConsumed: number;
  setCaffeineConsumed: (value: number) => void;
  drinksCount: number;
  setDrinksCount: (value: number) => void;
  onCutoffChange: (cutoff: string) => void;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  singleColumnMode: boolean;
};

type DrinkLogEntry = {
  id: number;
  name: string;
  servingMl: number;
  caffeineMg: number;
  time?: string;
};

const drinkList = drinks as Drink[];
const ML_PER_OZ = 29.5735;
const MAX_SERVING_ML = 2000;
const MAX_CAFFEINE_MG = 2000;

function calculateCaffeineMg(drink: Drink, servingMl: number) {
  return Math.round((drink.caffeine_per_100ml / 100) * servingMl);
}

function currentClock24() {
  const now = new Date();
  return formatClock24(now.getHours() * 60 + now.getMinutes());
}

function clock12ToMinutes(clock: string) {
  const match = clock.match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/);
  if (!match) return Number.POSITIVE_INFINITY;
  const [, hourRaw, minuteRaw, period] = match;
  const hour = Number(hourRaw) % 12;
  return (period === "PM" ? hour + 12 : hour) * 60 + Number(minuteRaw);
}

function hoursUntil(fromMinutes: number, toMinutes: number) {
  const delta = toMinutes - fromMinutes;
  return (delta < 0 ? delta + 1440 : delta) / 60;
}

function roundToNearestTen(value: number) {
  return Math.round(value / 10) * 10;
}

export function CutoffTimeCard({
  caffeineConsumed,
  setCaffeineConsumed,
  drinksCount,
  setDrinksCount,
  onCutoffChange,
  expanded,
  onExpandedChange,
  singleColumnMode,
}: CutoffTimeCardProps) {
  const [servingUnit, setServingUnit] = useState<"ml" | "oz">("ml");
  const [currentTime, setCurrentTime] = useState("00:00");
  const [addDisabled, setAddDisabled] = useState(false);
  const [drinkLogTimestamps, setDrinkLogTimestamps] = useState<Record<number, string>>({});
  const [customDrinkName, setCustomDrinkName] = useState("");
  const [customCaffeineMg, setCustomCaffeineMg] = useState(0);
  const addLockedRef = useRef(false);
  const [selectedDrinkName, setSelectedDrinkName] = useLocalStorage("ciq_drink_name", "");
  const [drinkLog, setDrinkLog] = useLocalStorage<DrinkLogEntry[]>("ciq_drink_log", []);
  const [servingMl, setServingMl] = useLocalStorage<number>("ciq_serving_ml", 240);
  const [lastCoffeeTime, setLastCoffeeTime] = useLocalStorage("ciq_last_coffee_time", "14:00");
  const [mgConsumed, setMgConsumed] = useLocalStorage("ciq_caffeine_mg", 180);
  const [bedtime, setBedtime] = useLocalStorage("ciq_bedtime", "23:00");
  const selectedDrink = useMemo(
    () => drinkList.find((drink) => drink.name === selectedDrinkName),
    [selectedDrinkName],
  );
  const selectedUnit = selectedDrink?.unit === "g" ? "g" : "ml";
  const fallbackServing = selectedDrink?.default_serving_ml ?? 240;
  const servingAmount = Math.min(MAX_SERVING_ML, Math.max(1, Math.round(Number(servingMl) || fallbackServing)));
  const calculatedMg = selectedDrink ? calculateCaffeineMg(selectedDrink, servingAmount) : mgConsumed;
  const servingInputValue =
    selectedUnit === "g"
      ? servingAmount
      : servingUnit === "ml"
        ? servingAmount
        : Math.round((servingAmount / ML_PER_OZ) * 10) / 10;
  const cutoff = getCutoffTime(lastCoffeeTime, caffeineConsumed, bedtime);
  const currentMinutes = timeToMinutes(currentTime);
  const cutoffMinutes = clock12ToMinutes(cutoff);
  const bedtimeMinutes = timeToMinutes(bedtime);
  const rawCutoffDelta = cutoffMinutes - currentMinutes;
  const cutoffDelta = rawCutoffDelta < -720 ? rawCutoffDelta + 1440 : rawCutoffDelta;
  const cutoffNeedsAttention = caffeineConsumed > 0 && cutoffDelta <= 120;
  const cutoffHasPassed = caffeineConsumed > 0 && currentMinutes > cutoffMinutes;
  const activeAtBedtime = roundToNearestTen(caffeineConsumed * (0.5 ** (hoursUntil(currentMinutes, bedtimeMinutes) / 5)));
  const cutoffCaption =
    caffeineConsumed > 0 ? (
      <>
        <span>Based on {caffeineConsumed}mg logged today.</span>
        {cutoffHasPassed && (
          <span className="mt-1 block text-warning">
            At your bedtime ({bedtime}), ~{activeAtBedtime}mg will still be active.
          </span>
        )}
      </>
    ) : (
      "Add a drink to calculate today's cut-off."
    );

  useEffect(() => {
    onCutoffChange(cutoff);
  }, [cutoff, onCutoffChange]);

  useDebouncedTrackEvent(
    [selectedDrinkName, servingAmount, lastCoffeeTime, bedtime, mgConsumed, caffeineConsumed],
    "calculate_cutoff",
    "tool",
    "cutoff_time",
  );

  useEffect(() => {
    const loggedCaffeinatedDrinks = drinkLog.filter((entry) => entry.caffeineMg > 0).length;
    if (loggedCaffeinatedDrinks > drinksCount) setDrinksCount(loggedCaffeinatedDrinks);
  }, [drinkLog, drinksCount, setDrinksCount]);

  useEffect(() => {
    setCurrentTime(currentClock24());
    const interval = window.setInterval(() => setCurrentTime(currentClock24()), 60000);
    return () => window.clearInterval(interval);
  }, []);

  const updateServingMl = (nextValue: number, unit: "ml" | "oz", drink = selectedDrink) => {
    const nextServingMl = Math.min(MAX_SERVING_ML, Math.max(1, unit === "ml" ? nextValue : nextValue * ML_PER_OZ));
    setServingMl(nextServingMl);
    if (drink) setMgConsumed(calculateCaffeineMg(drink, nextServingMl));
  };

  const updateServingFromInput = (nextValue: string) => {
    if (!selectedDrink) return;
    if (nextValue.trim() === "") {
      updateServingMl(selectedDrink.default_serving_ml, "ml", selectedDrink);
      return;
    }
    const parsed = Number(nextValue);
    if (!Number.isFinite(parsed)) return;
    updateServingMl(parsed, selectedUnit === "g" ? "ml" : servingUnit, selectedDrink);
  };

  const updateCustomCaffeine = (nextValue: string) => {
    if (nextValue.trim() === "") {
      setCustomCaffeineMg(0);
      return;
    }
    const parsed = Number(nextValue);
    if (!Number.isFinite(parsed)) return;
    setCustomCaffeineMg(Math.min(MAX_CAFFEINE_MG, Math.max(0, Math.round(parsed))));
  };

  const addDrinkToToday = () => {
    if (!selectedDrink || addLockedRef.current) return;
    addLockedRef.current = true;
    setAddDisabled(true);
    const id = Date.now();
    const nextEntry = {
      id,
      name: selectedDrink.name,
      servingMl: servingAmount,
      caffeineMg: mgConsumed,
      time: lastCoffeeTime,
    };
    setDrinkLog([nextEntry, ...drinkLog].slice(0, 8));
    setDrinkLogTimestamps((current) => ({ ...current, [id]: lastCoffeeTime }));
    setCaffeineConsumed(caffeineConsumed + mgConsumed);
    if (mgConsumed > 0) setDrinksCount(drinksCount + 1);
    trackEvent("add_drink", "tool", "cutoff_time", mgConsumed);
    window.setTimeout(() => {
      addLockedRef.current = false;
      setAddDisabled(false);
    }, 500);
  };

  const addCustomDrinkToToday = () => {
    const name = customDrinkName.trim();
    if (!name || customCaffeineMg <= 0 || addLockedRef.current) return;
    addLockedRef.current = true;
    setAddDisabled(true);
    const id = Date.now();
    const nextEntry = {
      id,
      name,
      servingMl: 0,
      caffeineMg: customCaffeineMg,
      time: lastCoffeeTime,
    };
    setDrinkLog([nextEntry, ...drinkLog].slice(0, 8));
    setDrinkLogTimestamps((current) => ({ ...current, [id]: lastCoffeeTime }));
    setCaffeineConsumed(caffeineConsumed + customCaffeineMg);
    setDrinksCount(drinksCount + 1);
    trackEvent("add_custom_drink", "tool", "cutoff_time", customCaffeineMg);
    window.setTimeout(() => {
      addLockedRef.current = false;
      setAddDisabled(false);
    }, 500);
  };

  return (
    <ToolCard
      title="Your cut-off time"
      badge="5h half-life"
      badgeTooltip="Caffeine has a 5-hour half-life. Your cut-off is the last time you could have a drink and still have under 50mg in your system at bedtime - the threshold where most people can sleep normally."
      outputValue={cutoff}
      outputTone="accent"
      outputSize="large"
      underMetric={`Current time: ${currentTime}`}
      caption={cutoffCaption}
      belowOutput={<DecayCurveChart lastCoffeeTime={lastCoffeeTime} mgConsumed={caffeineConsumed} bedtime={bedtime} />}
      accentBorder={cutoffNeedsAttention}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      singleColumnMode={singleColumnMode}
    >
      <DrinkCombobox
        selectedName={selectedDrinkName}
        onSelect={(drink) => {
          setSelectedDrinkName(drink.name);
          setServingMl(drink.default_serving_ml);
          setMgConsumed(calculateCaffeineMg(drink, drink.default_serving_ml));
        }}
      />
      <div className="grid gap-3 rounded-sm border border-border bg-surface-muted p-3">
        <p className="text-body font-medium text-text-secondary">Custom drink</p>
        <label className="grid gap-2 text-body font-medium text-text-secondary">
          Drink name
          <input
            type="text"
            value={customDrinkName}
            placeholder="e.g. Homemade iced coffee"
            onChange={(event) => setCustomDrinkName(event.currentTarget.value)}
            className="w-full rounded-sm border border-border bg-surface px-3 py-2.5 font-ui text-body text-text-primary focus:border-ink/45 focus:outline-none"
          />
        </label>
        <label className="grid gap-2 text-body font-medium text-text-secondary">
          Caffeine amount (mg)
          <input
            type="number"
            value={String(customCaffeineMg)}
            min={0}
            max={MAX_CAFFEINE_MG}
            step={1}
            onFocus={(event) => event.currentTarget.select()}
            onChange={(event) => updateCustomCaffeine(event.currentTarget.value)}
            className="w-full rounded-sm border border-border bg-surface px-3 py-2.5 font-ui text-body text-text-primary focus:border-ink/45 focus:outline-none"
          />
        </label>
        <button
          type="button"
          className="rounded-xs border border-accent bg-accent px-[14px] py-2 text-body font-semibold text-[#faf7f2] hover:border-accent-hover hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          onClick={addCustomDrinkToToday}
          disabled={addDisabled || !customDrinkName.trim() || customCaffeineMg <= 0}
        >
          Add custom drink
        </button>
      </div>
      {selectedDrink && (
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-body font-medium text-text-secondary">Serving size</span>
            {selectedUnit !== "g" && (
              <div className="flex rounded-xs border border-border bg-surface-muted p-1">
                {(["ml", "oz"] as const).map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    className={`rounded-xs px-3 py-1 text-[12px] font-semibold ${servingUnit === unit ? "bg-accent text-text-on-accent" : "text-text-secondary"}`}
                    onClick={() => setServingUnit(unit)}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            )}
          </div>
          <label className="grid gap-2 text-body font-medium text-text-secondary">
            <span className="flex items-center justify-between">
              Serving {selectedUnit === "g" ? "weight" : "volume"} ({selectedUnit === "g" ? "g" : servingUnit})
              <span className="font-mono text-text-primary">{selectedUnit === "g" ? "g" : servingUnit}</span>
            </span>
            <input
              type="number"
              value={String(servingInputValue)}
              min={selectedUnit === "g" || servingUnit === "ml" ? 1 : 0.1}
              max={selectedUnit === "g" ? MAX_SERVING_ML : servingUnit === "ml" ? MAX_SERVING_ML : Math.round((MAX_SERVING_ML / ML_PER_OZ) * 10) / 10}
              step={selectedUnit === "g" || servingUnit === "ml" ? 1 : 0.1}
              onFocus={(event) => event.currentTarget.select()}
              onChange={(event) => updateServingFromInput(event.currentTarget.value)}
              className="w-full rounded-sm border border-border bg-surface-muted px-3 py-2.5 font-ui text-body text-text-primary focus:border-ink/45 focus:outline-none"
            />
          </label>
          <p className="font-mono text-[11px] uppercase tracking-wide text-text-tertiary">
            {selectedDrink.name} - {servingAmount}
            {selectedUnit} serving - {calculatedMg}mg caffeine
          </p>
          <TimeInput label="Drink time" value={lastCoffeeTime} onChange={setLastCoffeeTime} />
          <button
            type="button"
            className="rounded-xs border border-accent bg-accent px-[14px] py-2 text-body font-semibold text-[#faf7f2] hover:border-accent-hover hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
            onClick={addDrinkToToday}
            disabled={addDisabled}
          >
            Add to today
          </button>
        </div>
      )}
      {drinkLog.length > 0 && (
        <div className="max-h-[118px] overflow-auto rounded-sm border border-border bg-surface-muted px-3 py-2">
          <div className="mb-1 flex items-center justify-between gap-3">
            <p className="text-body font-medium text-text-secondary">Today&apos;s drinks</p>
            <button
              type="button"
              className="font-mono text-[11px] uppercase tracking-wide text-text-tertiary hover:text-text-primary"
              onClick={() => {
                setDrinkLog([]);
                setDrinkLogTimestamps({});
                setCaffeineConsumed(0);
                setDrinksCount(0);
              }}
            >
              Clear
            </button>
          </div>
          <div className="grid gap-1">
            {drinkLog.map((entry) => (
              <div key={entry.id} className="text-body text-text-secondary">
                {entry.name} - <span className="font-mono text-text-primary">{entry.caffeineMg}mg</span>
                {(entry.time ?? drinkLogTimestamps[entry.id]) && (
                  <>
                    {" "}
                    - <span className="font-mono text-text-primary">{entry.time ?? drinkLogTimestamps[entry.id]}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <TimeInput label="Target bedtime" value={bedtime} onChange={setBedtime} />
    </ToolCard>
  );
}
