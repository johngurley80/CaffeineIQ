import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { AdSenseSlot } from "@/components/ui/AdSenseSlot";
import { Footer } from "@/components/ui/Footer";
import { NavBar } from "@/components/ui/NavBar";
import { ToolCTA } from "@/components/ToolCTA";
import { getBlogPost, getBlogSlugs } from "@/lib/blog";

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!getBlogSlugs().includes(slug)) return {};
  const post = getBlogPost(slug);
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.published,
      modifiedTime: post.updated,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  if (!getBlogSlugs().includes(slug)) notFound();
  const post = getBlogPost(slug);
  const { content } = await compileMDX({
    source: post.content,
    components: { ToolCTA, AdSenseSlot },
    options: { parseFrontmatter: false },
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.published,
    dateModified: post.updated,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: "CaffeineIQ" },
    mainEntityOfPage: `/blog/${slug}`,
  };

  return (
    <>
      <NavBar links={[{ label: "Calculator", href: "/#calculator" }, { label: "Blog", href: "/blog" }]} cta={{ label: "Start free", href: "/#calculator" }} />
      <main className="mx-auto max-w-[860px] px-wrap-sm py-section-sm md:px-wrap md:py-section">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <p className="font-mono text-[12px] uppercase tracking-wide text-text-tertiary">{post.readingTime} min read</p>
        <h1 className="mt-4 font-display text-[clamp(40px,6vw,72px)] leading-[0.95] text-text-primary">{post.title}</h1>
        <AdSenseSlot slot="blog-top" />
        <article className="blog-prose mt-8">{content}</article>
        <AdSenseSlot slot="blog-bottom" />
      </main>
      <Footer links={[{ label: "About", href: "/about" }, { label: "Privacy", href: "/privacy" }]} />
    </>
  );
}
