"use client";

type TimeInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function TimeInput({ label, value, onChange }: TimeInputProps) {
  return (
    <label className="grid gap-2 text-body font-medium text-text-secondary">
      {label}
      <input type="time" value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-sm border border-border bg-surface-muted px-3 py-2.5 font-ui text-body text-text-primary focus:border-ink/45 focus:outline-none" />
    </label>
  );
}
