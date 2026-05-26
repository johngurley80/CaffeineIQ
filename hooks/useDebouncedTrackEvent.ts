"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

export function useDebouncedTrackEvent(
  dependencies: readonly unknown[],
  action: string,
  category: string,
  label?: string,
  value?: number,
  delay = 800,
) {
  const hasMounted = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      trackEvent(action, category, label, value);
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [...dependencies, action, category, label, value, delay]);
}
