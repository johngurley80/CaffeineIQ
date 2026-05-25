"use client";

type StepperProps = {
  label: string;
  value: number;
  max?: number;
  onChange: (value: number) => void;
};

export function Stepper({ label, value, max = 8, onChange }: StepperProps) {
  return (
    <div className="grid gap-2">
      <span className="text-body font-medium text-text-secondary">{label}</span>
      <div className="flex gap-1">
        {Array.from({ length: max + 1 }, (_, index) => (
          <button key={index} type="button" onClick={() => onChange(index)} className={`flex-1 rounded-xs border py-2 font-mono text-body tabular-nums ${index === value ? "border-accent bg-accent-dim font-semibold text-accent" : "border-border bg-surface-muted text-text-primary"}`}>
            {index}
          </button>
        ))}
      </div>
    </div>
  );
}
