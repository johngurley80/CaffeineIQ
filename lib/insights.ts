type Args = {
  debt: number;
  waterDeficit: number;
  caffeineConsumed: number;
  dailyLimit: number;
  cutoffPassed: boolean;
};

export function composeInsight({
  debt,
  waterDeficit,
  caffeineConsumed,
  dailyLimit,
  cutoffPassed,
}: Args): string {
  if (cutoffPassed) {
    return "Cut-off passed. What's in your system now will still be active at 3am. Wind down — skip the evening cup.";
  }
  if (debt > 5) {
    return "Five-plus hours in the red. The extra coffee isn't fixing fatigue — it's masking it. One early night beats three flat whites.";
  }
  if (dailyLimit > 0 && caffeineConsumed >= dailyLimit * 0.8) {
    return "You're at 80% of your limit and the day isn't over. Switch to decaf or herbal — your future self will sleep better.";
  }
  if (waterDeficit >= 0.8) {
    return "You're behind on water. Dehydration makes caffeine jitter worse and focus shorter. Drink before the next cup.";
  }
  if (debt >= 2) {
    return "Your sleep debt is affecting your caffeine tolerance - you need more coffee because you're sleeping less.";
  }
  return "All signals clear. Good cut-off, no sleep debt, hydrated. This is what optimised looks like.";
}
