import { getAllBlogPosts } from "@/lib/blog";

export function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://caffeineiq.com";
  const posts = getAllBlogPosts();
  const items = posts
    .map((post) => `<item><title><![CDATA[${post.title}]]></title><link>${siteUrl}/blog/${post.slug}</link><guid>${siteUrl}/blog/${post.slug}</guid><pubDate>${new Date(post.published).toUTCString()}</pubDate><description><![CDATA[${post.metaDescription}]]></description></item>`)
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>CaffeineIQ</title><link>${siteUrl}</link><description>Caffeine, sleep, and hydration guides.</description>${items}</channel></rss>`;

  return new Response(xml, {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
