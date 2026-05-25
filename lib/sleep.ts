// lib/sleep.ts
export type DebtTone = 'ok' | 'warning' | 'danger';

/**
 * Total sleep debt across the last 7 days, floored at 0.
 * @param hoursSlept length-7 array (Mon..Sun), in hours
 * @param targetHours user's sleep target (e.g. 8)
 */
export function getSleepDebt(hoursSlept: number[], targetHours: number): number {
  return hoursSlept.reduce(
    (acc, h) => acc + Math.max(0, targetHours - (Number(h) || 0)),
    0,
  );
}

/**
 * Bucket sleep debt into a visual tone for the card.
 *  < 2h  → ok       (accent)
 *  2–5h  → warning  (terracotta)
 *  > 5h  → danger   (terracotta, bolder)
 */
export function classifyDebt(debt: number): DebtTone {
  if (debt < 2) return 'ok';
  if (debt <= 5) return 'warning';
  return 'danger';
}
