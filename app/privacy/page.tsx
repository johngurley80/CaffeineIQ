import { Footer } from "@/components/ui/Footer";
import { NavBar } from "@/components/ui/NavBar";

export const metadata = {
  title: "Privacy",
  description: "CaffeineIQ privacy policy.",
};

export default function PrivacyPage() {
  return (
    <>
      <NavBar links={[{ label: "Calculator", href: "/#calculator" }, { label: "Blog", href: "/blog" }]} />
      <main className="mx-auto max-w-[760px] px-wrap-sm py-section-sm md:px-wrap md:py-section">
        <h1 className="font-display text-[clamp(40px,6vw,72px)] leading-[0.95] text-text-primary">Privacy.</h1>
        <p className="mt-6 text-base leading-relaxed text-text-secondary">
          CaffeineIQ runs calculator logic in your browser and does not create accounts or store calculator entries. Production hosting may use Vercel Analytics and Google AdSense, configured through environment variables.
        </p>
      </main>
      <Footer links={[{ label: "About", href: "/about" }, { label: "Blog", href: "/blog" }]} />
    </>
  );
}
