import type { Metadata } from "next";
import { DM_Sans, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import Script from "next/script";
import faqSchema from "@/faq-schema.json";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const ui = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ui",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://caffeineiq.com"),
  title: {
    default: "Caffeine Calculator - Personal Daily Limit & Cut-Off Time | CaffeineIQ",
    template: "%s | CaffeineIQ",
  },
  description:
    "Free personalised caffeine calculator. Find your safe daily caffeine limit, cut-off time, sleep debt, and hydration target in 30 seconds.",
  keywords: [
    "caffeine calculator",
    "caffeine half life calculator",
    "sleep debt calculator",
    "water intake calculator",
    "how much caffeine per day",
    "when to stop drinking coffee",
  ],
  authors: [{ name: "CaffeineIQ" }],
  creator: "CaffeineIQ",
  publisher: "CaffeineIQ",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: "CaffeineIQ",
    title: "Caffeine Calculator - Find Your Personal Daily Limit & Cut-Off Time",
    description: "Safe daily limit, cut-off time, sleep debt, hydration target - free, no signup.",
    images: [{ url: "/og/og-home.png", width: 1200, height: 630, alt: "CaffeineIQ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caffeine Calculator | CaffeineIQ",
    description: "Find your safe caffeine limit, cut-off time, sleep debt, and hydration target.",
    images: ["/og/og-home.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${ui.variable} ${mono.variable}`}>
      <body className="bg-bg text-text-primary font-ui antialiased">
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <Script
          id="webapp-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "CaffeineIQ",
              applicationCategory: "HealthApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              description: "Free personalised caffeine, sleep debt, and hydration calculator.",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
