import type { BlogArticle, BlogMeta } from './types';

const articles: BlogArticle[] = [
  {
    slug: 'hello-world',
    title: 'Hello World: Welcome to Nebula Terminal',
    description: 'The first post on my new personal site. Why I built it and what to expect.',
    date: '2026-05-24',
    tags: ['personal', 'web', 'design'],
    readingTime: '3 min read',
    content: `
## Hello World

Welcome to my corner of the internet. This is the first post on **Nebula Terminal**, my personal space for sharing thoughts, projects, and learnings.

### Why I Built This

I wanted a space that reflects my approach to building digital products — where design meets technology, where aesthetics are intentional, and where performance is non-negotiable.

### What to Expect

I'll be writing about:

- **Web development** — deep dives into React, Next.js, and frontend architecture
- **Design engineering** — building beautiful, performant UIs
- **Lessons learned** — real experiences from shipping products

Stay tuned for more.
    `.trim(),
  },
];

export function getArticles(): BlogMeta[] {
  return articles.map(({ content, ...meta }) => meta);
}

export function getArticleBySlug(slug: string): BlogArticle | null {
  return articles.find((a) => a.slug === slug) ?? null;
}

export function getAllSlugs(): string[] {
  return articles.map((a) => a.slug);
}
