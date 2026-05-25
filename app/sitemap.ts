import type { MetadataRoute } from "next";
import { getBlogSlugs } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://caffeineiq.com";
  const staticRoutes = ["", "/blog", "/about", "/privacy", "/how-it-works"];
  return [
    ...staticRoutes.map((route) => ({ url: `${siteUrl}${route}`, lastModified: new Date() })),
    ...getBlogSlugs().map((slug) => ({ url: `${siteUrl}/blog/${slug}`, lastModified: new Date("2026-06-01") })),
  ];
}
