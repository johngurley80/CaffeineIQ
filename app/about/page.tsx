import { Footer } from "@/components/ui/Footer";
import { NavBar } from "@/components/ui/NavBar";

export const metadata = {
  title: "About",
  description: "About CaffeineIQ and its caffeine, sleep, and hydration calculator.",
};

export default function AboutPage() {
  return (
    <>
      <NavBar links={[{ label: "Calculator", href: "/#calculator" }, { label: "Blog", href: "/blog" }]} />
      <main className="mx-auto max-w-[760px] px-wrap-sm py-section-sm md:px-wrap md:py-section">
        <h1 className="font-display text-[clamp(40px,6vw,72px)] leading-[0.95] text-text-primary">About CaffeineIQ.</h1>
        <p className="mt-6 text-base leading-relaxed text-text-secondary">
          CaffeineIQ is a free calculator for planning caffeine around sleep and hydration. The formulas are transparent, conservative, and designed for everyday decision-making.
        </p>
      </main>
      <Footer links={[{ label: "Privacy", href: "/privacy" }, { label: "Blog", href: "/blog" }]} />
    </>
  );
}
