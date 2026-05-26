import faqSchema from "@/faq-schema.json";
import { Icon } from "@/components/icons/Icon";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { AdSenseSlot } from "@/components/ui/AdSenseSlot";
import { AffiliateCard } from "@/components/ui/AffiliateCard";
import { Footer } from "@/components/ui/Footer";
import { HeroBadge } from "@/components/ui/HeroBadge";
import { HowItWorksStep } from "@/components/ui/HowItWorksStep";
import { NavBar } from "@/components/ui/NavBar";
import { StatStrip } from "@/components/ui/StatStrip";

const navLinks = [
  { label: "Calculator", href: "/#calculator" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Blog", href: "/blog" },
];

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Blog", href: "/blog" },
];

export default function Home() {
  const questions = faqSchema.mainEntity;

  return (
    <>
      <NavBar links={navLinks} cta={{ label: "Start free", href: "/#calculator" }} />
      <main>
        <section className="mx-auto grid max-w-wrap gap-12 px-wrap-sm py-hero-sm md:px-wrap md:py-hero">
          <div className="max-w-[820px]">
            <HeroBadge>Know your limit. Own your energy.</HeroBadge>
            <h1 className="mt-7 font-display text-[clamp(40px,6vw,76px)] font-normal leading-[0.95] text-text-primary">
              Your personalised <em className="text-accent">caffeine</em> calculator.
            </h1>
            <p className="mt-6 max-w-[650px] text-[clamp(16px,1.6vw,19px)] leading-relaxed text-text-secondary">
              Find your safe daily limit, your cut-off time, your sleep debt, and your hydration target - in 30 seconds.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {["No signup", "Free forever", "Calibrated"].map((pill) => (
                <span key={pill} className="inline-flex items-center gap-2 rounded-[999px] border border-border bg-surface px-3 py-1.5 text-label font-medium text-text-secondary">
                  <Icon name="check" className="h-3.5 w-3.5 text-accent" />
                  {pill}
                </span>
              ))}
            </div>
          </div>
          <ToolGrid />
        </section>

        <section className="mx-auto max-w-wrap px-wrap-sm py-section-sm md:px-wrap md:py-section">
          <div className="mb-8 max-w-[620px]">
            <p className="text-eyebrow font-semibold uppercase tracking-widest text-text-tertiary">How it works</p>
            <h2 className="mt-3 font-display text-[clamp(34px,4.2vw,48px)] leading-[1.05] text-text-primary">
              Four signals, one practical recommendation.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <HowItWorksStep number="01" icon={<Icon name="cup" />} title="Find your ceiling" body="Weight, pregnancy status, and health flags set a conservative daily caffeine limit." />
            <HowItWorksStep number="02" icon={<Icon name="clock" />} title="Protect bedtime" body="Half-life math works backwards from your target sleep time to set a cut-off." />
            <HowItWorksStep number="03" icon={<Icon name="leaf" />} title="Balance recovery" body="Sleep debt and hydration show when caffeine is covering a deeper deficit." />
          </div>
        </section>

        <section className="mx-auto max-w-wrap px-wrap-sm pb-section-sm md:px-wrap md:pb-section">
          <StatStrip
            headline="Used by focused people who want clean energy without borrowing from tomorrow."
          />
          <AdSenseSlot slot="home-mid" />
          <div className="grid gap-5 md:grid-cols-2">
            <AffiliateCard
              category="Recovery tracking"
              title="Track the habits caffeine hides."
              body="A simple wearable or sleep tracker can reveal whether your extra cup is solving energy or masking recovery debt."
              ctaText="See tracker picks"
              ctaHref="https://example.com/recovery"
            />
            <AffiliateCard
              category="Hydration"
              title="Make water the default."
              body="A measured bottle turns your target into a visible scoreboard, especially on high-caffeine days."
              ctaText="See bottle picks"
              ctaHref="https://example.com/hydration"
            />
          </div>
        </section>

        <section className="mx-auto max-w-[860px] px-wrap-sm pb-section-sm md:px-wrap md:pb-section">
          <h2 className="font-display text-[clamp(34px,4.2vw,48px)] leading-[1.05] text-text-primary">Caffeine calculator FAQ</h2>
          <div className="mt-7 divide-y divide-border rounded-2xl border border-border bg-surface shadow-card">
            {questions.map((item) => (
              <details key={item.name} className="group p-5">
                <summary className="cursor-pointer list-none text-base font-semibold text-text-primary">
                  {item.name}
                </summary>
                <p className="mt-3 text-body leading-relaxed text-text-secondary">{item.acceptedAnswer.text}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer links={footerLinks} />
    </>
  );
}
