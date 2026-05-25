"use client";

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
};

export function Slider({ label, value, min, max, step = 1, unit, onChange }: SliderProps) {
  return (
    <label className="grid gap-2">
      <span className="flex items-center justify-between text-body font-medium text-text-secondary">
        {label}
        <span className="font-mono text-text-primary">{value}{unit}</span>
      </span>
      <input className="slider-input w-full" type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}
