import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const blogDir = path.join(process.cwd(), "content", "blog");

export type BlogPost = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  published: string;
  updated: string;
  author: string;
  readingTime: number;
  keyword?: string;
  content: string;
};

export function getBlogSlugs() {
  if (!fs.existsSync(blogDir)) return [];
  return fs.readdirSync(blogDir).filter((file) => file.endsWith(".mdx")).map((file) => file.replace(/\.mdx$/, ""));
}

export function getBlogPost(slug: string): BlogPost {
  const fullPath = path.join(blogDir, `${slug}.mdx`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title,
    metaTitle: data.metaTitle ?? data.title,
    metaDescription: data.metaDescription ?? "",
    published: String(data.published),
    updated: String(data.updated ?? data.published),
    author: data.author ?? "CaffeineIQ",
    readingTime: Number(data.readingTime ?? 5),
    keyword: data.keyword,
    content,
  };
}

export function getAllBlogPosts() {
  return getBlogSlugs()
    .map(getBlogPost)
    .sort((a, b) => Date.parse(b.published) - Date.parse(a.published));
}
