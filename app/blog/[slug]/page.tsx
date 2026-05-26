import type { Metadata } from "next";
import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Footer } from "@/components/ui/Footer";
import { NavBar } from "@/components/ui/NavBar";
import { getAllPosts, getBlogSlugs, getPostBySlug } from "@/lib/blog";

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

type FaqEntry = {
  question: string;
  answer: string;
};

const mdxOptions = {
  parseFrontmatter: false,
  mdxOptions: {
    remarkPlugins: [remarkGfm],
  },
};

const mdxComponents = {
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-[#e8e0d5] bg-white shadow-sm">
      <table {...props} className="w-full min-w-[560px] border-collapse text-left text-[15px]" />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th {...props} className="border-b border-[#e8e0d5] bg-[#faf7f2] px-4 py-3 font-ui text-sm font-semibold text-[#3d1f0d]" />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td {...props} className="border-t border-[#e8e0d5] px-4 py-3 align-top text-[#1c1917]" />
  ),
};

function stripMarkdown(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitBeforeFaq(content: string) {
  const faqHeading = /^## Frequently Asked Questions\s*$/m;
  const match = content.match(faqHeading);
  if (!match || match.index === undefined) return { beforeFaq: content, faqContent: "" };

  return {
    beforeFaq: content.slice(0, match.index).trim(),
    faqContent: content.slice(match.index).trim(),
  };
}

function extractFaqEntries(content: string): FaqEntry[] {
  const { faqContent } = splitBeforeFaq(content);
  if (!faqContent) return [];

  const section = faqContent.split(/^---\s*$/m)[0];
  const entries: FaqEntry[] = [];
  const questionRegex = /^###\s+(.+)\n([\s\S]*?)(?=^###\s+|(?![\s\S]))/gm;
  let match: RegExpExecArray | null;

  while ((match = questionRegex.exec(section)) !== null) {
    const question = stripMarkdown(match[1]);
    const answer = stripMarkdown(match[2].split(/\n\s*\n/)[0] ?? "");
    if (question && answer) entries.push({ question, answer });
  }

  return entries;
}

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!getBlogSlugs().includes(slug)) return {};
  const post = getPostBySlug(slug);

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  if (!getBlogSlugs().includes(slug)) notFound();

  const post = getPostBySlug(slug);
  const allPosts = getAllPosts();
  const currentPostIndex = allPosts.findIndex((item) => item.slug === slug);
  const relatedPosts =
    currentPostIndex >= 0
      ? [allPosts[(currentPostIndex + 1) % allPosts.length], allPosts[(currentPostIndex + 2) % allPosts.length]].filter(
          (item) => item.slug !== slug,
        )
      : allPosts.filter((item) => item.slug !== slug).slice(0, 2);
  const { beforeFaq, faqContent } = splitBeforeFaq(post.content);
  const [body, faq] = await Promise.all([
    compileMDX({ source: beforeFaq, options: mdxOptions, components: mdxComponents }),
    compileMDX({ source: faqContent, options: mdxOptions, components: mdxComponents }),
  ]);
  const faqEntries = extractFaqEntries(post.content);
  const faqSchema =
    faqEntries.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqEntries.map((entry) => ({
            "@type": "Question",
            name: entry.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: entry.answer,
            },
          })),
        }
      : null;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.date,
    publisher: {
      "@type": "Organization",
      name: "CaffeineIQ",
      url: "https://caffeineiq.com",
    },
  };

  return (
    <>
      <NavBar links={[{ label: "Calculator", href: "/#calculator" }, { label: "Guides", href: "/blog" }]} />
      <main className="min-h-screen bg-[#faf7f2]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
        <article className="mx-auto max-w-[720px] px-6 py-12 md:py-20">
          <nav aria-label="Blog navigation" className="mb-8 flex flex-wrap gap-3 font-ui text-sm font-semibold">
            <Link href="/blog" className="rounded-sm border border-[#e8e0d5] bg-white px-3 py-2 text-[#3d1f0d] transition-colors hover:border-[#c4622d] hover:text-[#c4622d]">
              All guides
            </Link>
            <Link href="/#calculator" className="rounded-sm border border-[#e8e0d5] bg-white px-3 py-2 text-[#3d1f0d] transition-colors hover:border-[#c4622d] hover:text-[#c4622d]">
              Main tool
            </Link>
          </nav>
          <p className="font-ui text-[13px] text-[#a8a29e]">{post.readingTime}</p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-[#1c1917] md:text-[56px]">{post.title}</h1>
          <div className="mt-8 font-ui text-[17px] leading-[1.75] text-[#1c1917] [&_a]:text-[#c4622d] [&_a:hover]:underline [&_code]:rounded [&_code]:bg-[#faf7f2] [&_code]:px-1 [&_code]:font-mono [&_code]:text-[#3d1f0d] [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-[#1c1917] [&_h3]:mt-6 [&_h3]:font-ui [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#1c1917] [&_hr]:my-8 [&_hr]:border-[#e8e0d5] [&_p]:mt-4 [&_strong]:text-[#3d1f0d] [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
            {body.content}
          </div>
          {faqContent && (
            <>
              <div className="my-10 rounded-lg bg-[#3d1f0d] p-5 font-ui text-white">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[18px] font-semibold">Find your personal caffeine limit and cut-off time</p>
                  <Link href="/" className="inline-flex rounded-sm bg-[#c4622d] px-4 py-2 font-semibold text-white">
                    Try the tool
                  </Link>
                </div>
              </div>
              <div className="font-ui text-[17px] leading-[1.75] text-[#1c1917] [&_a]:text-[#c4622d] [&_a:hover]:underline [&_code]:rounded [&_code]:bg-[#faf7f2] [&_code]:px-1 [&_code]:font-mono [&_code]:text-[#3d1f0d] [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-[#1c1917] [&_h3]:mt-6 [&_h3]:font-ui [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#1c1917] [&_hr]:my-8 [&_hr]:border-[#e8e0d5] [&_p]:mt-4 [&_strong]:text-[#3d1f0d]">
                {faq.content}
              </div>
            </>
          )}
          <section className="mt-12 border-t border-[#e8e0d5] pt-8">
            <h2 className="font-display text-3xl leading-tight text-[#1c1917]">Read next</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {relatedPosts.slice(0, 2).map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="rounded-lg border border-[#e8e0d5] bg-white p-4 transition-shadow hover:shadow-card"
                >
                  <p className="font-display text-[24px] leading-tight text-[#1c1917]">{relatedPost.title}</p>
                  <p className="mt-3 font-ui text-sm leading-relaxed text-[#78716c]">{relatedPost.readingTime}</p>
                </Link>
              ))}
            </div>
          </section>
        </article>
      </main>
      <Footer links={[{ label: "About", href: "/about" }, { label: "Privacy", href: "/privacy" }]} />
    </>
  );
}
