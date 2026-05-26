import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const blogDir = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  title: string;
  description: string;
  slug: string;
  date: string;
  primaryKeyword: string;
  volume: number;
  difficulty: number;
  readingTime: string;
};

export type Post = PostMeta & {
  content: string;
};

export type BlogPost = Post & {
  metaTitle: string;
  metaDescription: string;
  published: string;
  updated: string;
  author: string;
};

function getPostFiles() {
  if (!fs.existsSync(blogDir)) return [];
  return fs.readdirSync(blogDir).filter((file) => file.endsWith(".mdx"));
}

function parsePost(fileName: string): Post {
  const fullPath = path.join(blogDir, fileName);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const slug = String(data.slug ?? fileName.replace(/\.mdx$/, ""));

  return {
    title: String(data.title),
    description: String(data.description),
    slug,
    date: String(data.date),
    primaryKeyword: String(data.primaryKeyword),
    volume: Number(data.volume),
    difficulty: Number(data.difficulty),
    readingTime: readingTime(content).text,
    content,
  };
}

function withLegacyFields(post: Post): BlogPost {
  return {
    ...post,
    metaTitle: post.title,
    metaDescription: post.description,
    published: post.date,
    updated: post.date,
    author: "CaffeineIQ",
  };
}

export function getAllPosts(): PostMeta[] {
  return getPostFiles()
    .map(parsePost)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .map(({ content, ...meta }) => meta);
}

export function getPostBySlug(slug: string): Post {
  const fileName = `${slug}.mdx`;
  if (!getPostFiles().includes(fileName)) {
    throw new Error(`Blog post not found: ${slug}`);
  }
  return parsePost(fileName);
}

export function getBlogSlugs() {
  return getPostFiles().map((file) => file.replace(/\.mdx$/, ""));
}

export function getBlogPost(slug: string): BlogPost {
  return withLegacyFields(getPostBySlug(slug));
}

export function getAllBlogPosts() {
  return getAllPosts().map((post) => withLegacyFields({ ...post, content: getPostBySlug(post.slug).content }));
}
