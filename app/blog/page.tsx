import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";
import { Footer } from "@/components/ui/Footer";
import { NavBar } from "@/components/ui/NavBar";

export const metadata = {
  title: "Caffeine Guides",
  description: "Practical caffeine, sleep, and hydration guides from CaffeineIQ.",
};

export default function BlogIndex() {
  const posts = getAllBlogPosts();

  return (
    <>
      <NavBar links={[{ label: "Calculator", href: "/#calculator" }, { label: "Blog", href: "/blog" }]} cta={{ label: "Start free", href: "/#calculator" }} />
      <main className="mx-auto max-w-wrap px-wrap-sm py-section-sm md:px-wrap md:py-section">
        <h1 className="font-display text-[clamp(40px,6vw,76px)] leading-[0.95] text-text-primary">Caffeine guides.</h1>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-2xl border border-border bg-surface p-6 shadow-card">
              <p className="font-mono text-[12px] uppercase tracking-wide text-text-tertiary">{post.readingTime} min read</p>
              <h2 className="mt-3 font-display text-[30px] leading-tight text-text-primary">{post.title}</h2>
              <p className="mt-3 text-body leading-relaxed text-text-secondary">{post.metaDescription}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer links={[{ label: "About", href: "/about" }, { label: "Privacy", href: "/privacy" }]} />
    </>
  );
}
