type CircularGaugeProps = {
  value: number;
  max: number;
  label: string;
  sublabel?: string;
  color?: string;
  size?: number;
};

export function CircularGauge({ value, max, label, sublabel, color = "#3d1f0d", size = 96 }: CircularGaugeProps) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0, value / max));

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(28,25,23,0.06)" strokeWidth="6" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center font-mono text-[11px] text-text-secondary">
        <span>
          <b className="block text-[13px] text-text-primary">{label}</b>
          {sublabel}
        </span>
      </div>
    </div>
  );
}
