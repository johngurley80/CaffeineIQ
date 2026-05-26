"use client";

type NumberInputProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  blankZero?: boolean;
  onChange: (value: number) => void;
};

export function NumberInput({ label, value, min, max, step = 1, unit, blankZero = false, onChange }: NumberInputProps) {
  return (
    <label className="grid gap-2 text-body font-medium text-text-secondary">
      <span className="flex items-center justify-between">
        {label}
        {unit && <span className="font-mono text-text-primary">{unit}</span>}
      </span>
      <input
        type="number"
        value={blankZero && value === 0 ? "" : value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(event.target.value === "" ? 0 : Number(event.target.value))}
        className="w-full rounded-sm border border-border bg-surface-muted px-3 py-2.5 font-ui text-body text-text-primary focus:border-ink/45 focus:outline-none"
      />
    </label>
  );
}
