// lib/insights.ts
type Args = { debt: number; waterDeficit: number };

/**
 * Single-string personalised insight rendered in the Insight strip.
 * Water deficit takes priority once it crosses ~800ml — dehydration
 * has a stronger short-term effect on caffeine "feel" than mild sleep debt.
 */
export function composeInsight({ debt, waterDeficit }: Args): string {
  if (waterDeficit >= 0.8) {
    const ml = Math.round(waterDeficit * 1000);
    return `You're ${ml}ml behind your water target — dehydration amplifies caffeine jitters. Front-load water before the next cup.`;
  }
  if (debt < 2) {
    return "You're well-rested and well-hydrated — your tolerance is stable. Keep your cut-off tight and you'll stay in the green.";
  }
  if (debt <= 5) {
    return "Your sleep debt is affecting your caffeine tolerance — you need more coffee because you're sleeping less.";
  }
  return "High sleep debt is masking fatigue with caffeine. Pull cut-off earlier and recover one night before adding more.";
}
