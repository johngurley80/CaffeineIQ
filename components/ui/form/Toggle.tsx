"use client";

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <button type="button" className="flex items-center justify-between gap-4 text-left text-body font-medium text-text-secondary" onClick={() => onChange(!checked)} aria-pressed={checked}>
      <span>{label}</span>
      <span className={`relative h-[22px] w-[38px] rounded-[999px] border transition-colors ${checked ? "border-ink/30 bg-ink-dim" : "border-border bg-surface-muted"}`}>
        <span className={`absolute left-[2px] top-[2px] h-4 w-4 rounded-full transition-transform ${checked ? "translate-x-4 bg-ink" : "bg-text-secondary"}`} />
      </span>
    </button>
  );
}
