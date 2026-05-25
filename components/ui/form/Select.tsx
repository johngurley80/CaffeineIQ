"use client";

type SelectProps = {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
};

export function Select({ label, value, options, onChange }: SelectProps) {
  return (
    <label className="grid gap-2 text-body font-medium text-text-secondary">
      {label}
      <select className="w-full appearance-none rounded-sm border border-border bg-surface-muted px-3 py-2.5 font-ui text-body text-text-primary focus:border-ink/45 focus:outline-none" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}
