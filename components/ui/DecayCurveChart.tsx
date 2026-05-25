import { getDecayCurve } from "@/lib/caffeine";
import { formatClock24, timeToMinutes } from "@/lib/time";

type DecayCurveChartProps = {
  lastCoffeeTime: string;
  mgConsumed: number;
  bedtime: string;
  halfLifeMinutes?: number;
};

export function DecayCurveChart({ lastCoffeeTime, mgConsumed, bedtime }: DecayCurveChartProps) {
  const start = timeToMinutes(lastCoffeeTime);
  const bedRaw = timeToMinutes(bedtime);
  const end = bedRaw <= start ? bedRaw + 1440 : bedRaw;
  const points = getDecayCurve(start, mgConsumed, start, end, 42);
  const max = Math.max(100, mgConsumed);
  const x = (m: number) => ((m - start) / Math.max(1, end - start)) * 280;
  const y = (mg: number) => 64 - (mg / max) * 58;
  const line = points.map(([m, mg]) => `${x(m).toFixed(1)},${y(mg).toFixed(1)}`).join(" ");
  const area = `0,70 ${line} 280,70`;
  const thresholdY = y(50);

  return (
    <div className="rounded-md border border-border bg-accent-soft/30 px-[14px] pb-2.5 pt-3">
      <div className="mb-1.5 flex justify-between font-mono text-[11px] text-text-tertiary">
        <span>{lastCoffeeTime}</span>
        <span>{formatClock24(end)}</span>
      </div>
      <svg viewBox="0 0 280 70" className="h-[70px] w-full" role="img" aria-label="Caffeine decay curve">
        <defs>
          <linearGradient id="curveFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="25%" stopColor="#3d1f0d" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#3d1f0d" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#curveFill)" />
        <polyline points={line} fill="none" stroke="#3d1f0d" strokeWidth="1.6" />
        <line x1="0" x2="280" y1={thresholdY} y2={thresholdY} stroke="#c4622d" strokeDasharray="4 4" strokeWidth="1" />
        <line x1="280" x2="280" y1="6" y2="66" stroke="#a8a29e" strokeDasharray="3 4" strokeWidth="1" />
      </svg>
    </div>
  );
}
