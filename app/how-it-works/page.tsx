import { Icon } from "@/components/icons/Icon";
import { Footer } from "@/components/ui/Footer";
import { HowItWorksStep } from "@/components/ui/HowItWorksStep";
import { NavBar } from "@/components/ui/NavBar";

export const metadata = {
  title: "How It Works",
  description: "How CaffeineIQ calculates daily caffeine limits, cut-off time, sleep debt, and hydration needs.",
};

export default function HowItWorksPage() {
  return (
    <>
      <NavBar links={[{ label: "Calculator", href: "/#calculator" }, { label: "Blog", href: "/blog" }]} cta={{ label: "Start free", href: "/#calculator" }} />
      <main className="mx-auto max-w-wrap px-wrap-sm py-section-sm md:px-wrap md:py-section">
        <h1 className="max-w-[760px] font-display text-[clamp(40px,6vw,72px)] leading-[0.95] text-text-primary">The calculator turns caffeine into a daily plan.</h1>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <HowItWorksStep number="01" icon={<Icon name="cup" />} title="Daily limit" body="Bodyweight sets the base limit, age adjusts clearance, and pregnancy or breastfeeding applies a stricter cap." />
          <HowItWorksStep number="02" icon={<Icon name="clock" />} title="Cut-off time" body="Caffeine half-life estimates how long your last drink takes to fall below the sleep-quality threshold." />
          <HowItWorksStep number="03" icon={<Icon name="moon" />} title="Recovery context" body="Sleep debt and hydration change how caffeine feels, so the insight strip prioritises the most useful next move." />
        </div>
      </main>
      <Footer links={[{ label: "About", href: "/about" }, { label: "Privacy", href: "/privacy" }]} />
    </>
  );
}
