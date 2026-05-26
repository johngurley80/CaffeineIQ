import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { Footer } from "@/components/ui/Footer";
import { NavBar } from "@/components/ui/NavBar";

export const metadata = {
  title: "Caffeine Guides | CaffeineIQ",
  description: "Evidence-based guides to caffeine, sleep, and energy — from half-life to tolerance resets.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <NavBar links={[{ label: "Calculator", href: "/#calculator" }, { label: "Guides", href: "/blog" }]} />
      <main className="min-h-screen bg-[#faf7f2]">
        <section className="mx-auto max-w-wrap px-6 py-16 md:px-wrap md:py-24">
          <div className="max-w-[720px]">
            <h1 className="font-display text-[clamp(44px,6vw,76px)] leading-[0.95] text-[#1c1917]">Caffeine Guides</h1>
            <p className="mt-4 font-ui text-[18px] leading-relaxed text-[#78716c]">
              Evidence-based guides to caffeine, sleep, and energy.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="rounded-lg border border-[#e8e0d5] bg-[#ffffff] p-6 shadow-sm transition-shadow hover:shadow-card"
              >
                <h2 className="font-display text-[30px] leading-tight text-[#1c1917]">{post.title}</h2>
                <p className="mt-3 overflow-hidden font-ui text-body leading-relaxed text-[#78716c] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                  {post.description}
                </p>
                <p className="mt-5 font-ui text-[13px] text-[#a8a29e]">{post.readingTime}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer links={[{ label: "About", href: "/about" }, { label: "Privacy", href: "/privacy" }]} />
    </>
  );
}
