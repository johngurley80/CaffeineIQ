"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import drinks from "@/data/drinks.json";

export type Drink = {
  name: string;
  caffeine_per_100ml: number;
  default_serving_ml: number;
  unit?: "g";
};

type DrinkComboboxProps = {
  selectedName: string;
  onSelect: (drink: Drink) => void;
};

const drinkList = drinks as Drink[];

function caffeineForDefaultServing(drink: Drink) {
  return Math.round((drink.caffeine_per_100ml / 100) * drink.default_serving_ml);
}

function unitLabel(drink: Drink) {
  return drink.unit === "g" ? "g" : "ml";
}

export function DrinkCombobox({ selectedName, onSelect }: DrinkComboboxProps) {
  const [query, setQuery] = useState(selectedName);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const normalised = query.trim().toLowerCase();
    if (!normalised) return drinkList.slice(0, 12);
    return drinkList.filter((drink) => drink.name.toLowerCase().includes(normalised)).slice(0, 12);
  }, [query]);
  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  return (
    <div ref={wrapperRef} className="relative grid gap-2">
      <label className="text-body font-medium text-text-secondary" htmlFor="drink-search">
        Drink lookup
      </label>
      <input
        id="drink-search"
        type="search"
        value={query}
        placeholder="Search coffee, tea, energy drinks..."
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        className="w-full rounded-sm border border-border bg-surface-muted px-3 py-2.5 font-ui text-body text-text-primary focus:border-ink/45 focus:outline-none"
        role="combobox"
        aria-expanded={open}
        aria-controls="drink-results"
      />
      {selectedName && (
        <p className="font-mono text-[11px] uppercase tracking-wide text-text-tertiary">
          Selected: {selectedName}
        </p>
      )}
      {open && (
        <div id="drink-results" className="absolute left-0 right-0 top-[74px] z-40 max-h-[260px] overflow-auto rounded-md border border-border bg-surface p-1 shadow-card" role="listbox">
          {filtered.length > 0 ? (
            filtered.map((drink) => (
              <button
                type="button"
                key={drink.name}
                className="flex w-full items-center justify-between gap-4 rounded-xs px-3 py-2 text-left text-body text-text-primary hover:bg-surface-muted"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setQuery(drink.name);
                  setOpen(false);
                  onSelect(drink);
                }}
                role="option"
                aria-selected={drink.name === selectedName}
              >
                <span>{drink.name}</span>
                <span className="text-right font-mono text-text-secondary">
                  {caffeineForDefaultServing(drink)}mg
                  <span className="block text-[10px] text-text-tertiary">
                    {drink.caffeine_per_100ml}mg per 100{unitLabel(drink)}
                  </span>
                </span>
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-body text-text-secondary">No drinks found.</p>
          )}
        </div>
      )}
    </div>
  );
}
