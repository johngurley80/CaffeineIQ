"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { getCutoffTime } from "@/lib/caffeine";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type LookupResult = {
  drinkName: string;
  caffeineMg: number;
  servingSize: string;
  confidence: "low" | "medium" | "high";
  notes: string;
};

const ML_PER_FL_OZ = 29.5735;

type CaffeineLookupCardProps = {
  dailyLimit: number;
  caffeineConsumed: number;
  onAddDrink: (drink: { name: string; caffeineMg: number; servingSize: string }) => void;
};

function servingSizeWithMl(servingSize: string) {
  const trimmed = servingSize.trim();
  const ounceMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*(?:fl\s*)?oz/i);
  if (!ounceMatch || /\bml\b/i.test(trimmed)) return trimmed;

  const ml = Math.round(Number(ounceMatch[1]) * ML_PER_FL_OZ);
  if (!Number.isFinite(ml)) return trimmed;
  return `${trimmed} (${ml} ml)`;
}

export function CaffeineLookupCard({ dailyLimit, caffeineConsumed, onAddDrink }: CaffeineLookupCardProps) {
  const [drink, setDrink] = useState("");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [bedtime] = useLocalStorage("ciq_bedtime", "");
  const limitPercent = result && dailyLimit > 0 ? Math.min(100, Math.round((result.caffeineMg / dailyLimit) * 100)) : 0;
  const cutOffImpact = result && bedtime ? getCutoffTime("", caffeineConsumed + result.caffeineMg, bedtime) : null;

  const lookupDrink = async () => {
    const query = drink.trim();
    if (!query || loading) return;
    setLoading(true);
    setError("");
    setResult(null);
    setAdded(false);

    try {
      const response = await fetch("/api/caffeine-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drink: query }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Lookup failed.");
      setResult(data as LookupResult);
      trackEvent("ai_caffeine_lookup", "tool", "caffeine_lookup", data.caffeineMg);
    } catch (lookupError) {
      setError(lookupError instanceof Error ? lookupError.message : "Lookup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">AI caffeine lookup</h2>
        <span className="rounded-[999px] border border-accent/30 bg-accent-dim px-2 py-0.5 text-[11px] font-semibold tracking-wide text-accent">
          AI Powered
        </span>
      </div>
      <div className="grid gap-3">
        <label className="grid gap-2 text-body font-medium text-text-secondary">
          Drink name
          <input
            type="text"
            value={drink}
            placeholder="e.g. large caramel latte"
            onChange={(event) => setDrink(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") lookupDrink();
            }}
            className="w-full rounded-sm border border-border bg-surface-muted px-3 py-2.5 font-ui text-body text-text-primary focus:border-ink/45 focus:outline-none"
          />
        </label>
        <button
          type="button"
          className="rounded-xs border border-accent bg-accent px-[14px] py-2 text-body font-semibold text-[#faf7f2] hover:border-accent-hover hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          onClick={lookupDrink}
          disabled={loading || !drink.trim()}
        >
          {loading ? "Looking up..." : "Look up caffeine"}
        </button>
      </div>
      {error && <p className="mt-3 rounded-sm border border-danger/30 bg-danger-dim px-3 py-2 text-body text-danger">{error}</p>}
      {result && (
        <div className="mt-4 rounded-sm border border-border bg-surface-muted px-3 py-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-body font-semibold text-text-primary">{result.drinkName}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-text-tertiary">{servingSizeWithMl(result.servingSize)}</p>
            </div>
            <p className="font-mono text-[34px] font-[300] leading-none text-accent">
              {result.caffeineMg}
              <span className="ml-1 text-[16px] text-text-secondary">mg</span>
            </p>
          </div>
          <div className="mt-4">
            <div className="h-2 overflow-hidden rounded-[999px] bg-border">
              <div className="h-full rounded-[999px] bg-[#3d1f0d]" style={{ width: dailyLimit > 0 ? `${limitPercent}%` : "0%" }} />
            </div>
            <p className="mt-2 text-[12px] leading-snug text-text-secondary">
              {dailyLimit > 0 ? `${limitPercent}% of your daily limit` : "Set your weight above to personalise this"}
            </p>
          </div>
          <p className={`mt-3 text-[12px] leading-snug ${cutOffImpact ? "text-text-secondary" : "text-text-tertiary"}`}>
            {cutOffImpact ? `Drinking this now would push your safe cut-off to ${cutOffImpact}` : "Set your bedtime above to see cut-off impact"}
          </p>
          <p className="mt-3 text-[12px] leading-snug text-text-secondary">
            Confidence: <span className="font-semibold text-text-primary">{result.confidence}</span>. {result.notes}
          </p>
          <button
            type="button"
            className="mt-4 w-full rounded-xs border border-accent bg-accent px-[14px] py-2 text-body font-semibold text-[#faf7f2] hover:border-accent-hover hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => {
              onAddDrink({
                name: result.drinkName,
                caffeineMg: result.caffeineMg,
                servingSize: servingSizeWithMl(result.servingSize),
              });
              setAdded(true);
              trackEvent("add_ai_lookup_drink", "tool", "caffeine_lookup", result.caffeineMg);
            }}
            disabled={added}
          >
            {added ? "Added to today" : "Add to today"}
          </button>
        </div>
      )}
    </section>
  );
}
