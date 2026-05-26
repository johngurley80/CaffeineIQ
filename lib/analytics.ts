export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window === "undefined") return;
  if (!GA_ID || GA_ID === "G-XXXXXXXXXX") return;

  window.gtag?.("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
}
