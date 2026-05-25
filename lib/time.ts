// lib/time.ts
export function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime(m: number): string {
  m = Math.round(((m % 1440) + 1440) % 1440);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(mm).padStart(2, '0')} ${period}`;
}

export function formatClock24(m: number): string {
  m = Math.round(((m % 1440) + 1440) % 1440);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}
