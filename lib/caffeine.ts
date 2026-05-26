// lib/caffeine.ts
// Pure functions for caffeine math. No side effects, no dependencies.

/**
 * Personalised safe daily caffeine ceiling, in mg.
 *
 * Model: 5.7 mg per kg of bodyweight with condition-specific caps.
 */
export function getDailyLimit(
  weightKg: number,
  isPregnant: boolean,
  healthConditions: string[],
): number {
  const base = weightKg * 5.7;
  let limit = Math.min(base, 400);

  if (isPregnant) limit = 200;

  if (healthConditions.includes("hypertension")) limit = Math.min(limit, 200);
  if (healthConditions.includes("anxiety")) limit = Math.min(limit, 200);
  if (healthConditions.includes("kidney_disease")) limit = Math.min(limit, 150);

  return Math.round(limit);
}

export function poundsToKg(weightLbs: number): number {
  return Math.round(weightLbs * 0.453592);
}

/**
 * Caffeine cut-off time for the day, given:
 *  - lastCoffeeTime — 'HH:MM' 24h (informational; not used to compute cut-off itself)
 *  - mgConsumed     — what the user took / plans to take in the marked drink
 *  - bedtime        — 'HH:MM' 24h target sleep time
 *
 * Returns time of day formatted '1:46 PM' (12h, no leading zero on hour).
 *
 * Model: caffeine half-life ~5h. Required hours-before-bed to fall below
 *        50mg sleep-quality threshold = log2(mg / 50) × 5.
 */
export function getCutoffTime(
  lastCoffeeTime: string,
  mgConsumed: number,
  bedtime: string,
): string {
  const HALF_LIFE_HRS = 5;
  const THRESHOLD_MG = 50;
  const hoursBefore = Math.max(
    0,
    Math.log2(Math.max(mgConsumed, 1) / THRESHOLD_MG) * HALF_LIFE_HRS,
  );
  const bedMin = timeToMinutes(bedtime);
  let cutMin = bedMin - hoursBefore * 60;
  if (cutMin < 0) cutMin += 1440;
  return minutesToTime(cutMin);
}

/**
 * Caffeine decay curve sample points for plotting.
 * Returns N points of [minutesFromMidnight, mgInSystem].
 *
 * Half-life 5h (300 min). After lastCoffeeMin, mg = mgConsumed * (0.5 ^ (Δt / 300)).
 */
export function getDecayCurve(
  lastCoffeeMin: number,
  mgConsumed: number,
  windowStartMin: number,
  windowEndMin: number,
  samples = 60,
): Array<[number, number]> {
  const halfLife = 300;
  const span = Math.max(60, windowEndMin - windowStartMin);
  const out: Array<[number, number]> = [];
  for (let i = 0; i <= samples; i++) {
    const t = windowStartMin + (i / samples) * span;
    const dt = Math.max(0, t - lastCoffeeMin);
    out.push([t, mgConsumed * Math.pow(0.5, dt / halfLife)]);
  }
  return out;
}

// Local helpers (kept here so callers can lift only this module if needed)
function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}
function minutesToTime(m: number): string {
  m = Math.round(((m % 1440) + 1440) % 1440);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(mm).padStart(2, '0')} ${period}`;
}
