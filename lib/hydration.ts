// lib/hydration.ts
/**
 * Daily water target in litres.
 *
 * base = weightKg × 0.033 L  (standard reference value)
 * caffeine adjustment = +0.15 L per caffeinated drink today
 *
 * Returns litres rounded to 1 decimal place.
 */
export function getWaterTarget(
  weightKg: number,
  caffeinatedDrinks: number,
): number {
  const litres = weightKg * 0.033 + caffeinatedDrinks * 0.15;
  return Math.round(litres * 10) / 10;
}

/**
 * Litres still owed at the moment of calculation.
 * Negative values clamp to 0 (you're at or above target).
 */
export function getWaterDeficit(
  consumedLitres: number,
  targetLitres: number,
): number {
  return Math.max(0, targetLitres - consumedLitres);
}
