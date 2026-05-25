import { PageShell } from '@/components/layout';
import { BackgroundParticles } from '@/components/three';
import { ArticleList, getArticles } from '@/features/blog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts, learnings, and deep dives into web development and design.',
};

export default function BlogPage() {
  const articles = getArticles();

  return (
    <PageShell>
      <BackgroundParticles />
      <section className="blog-page" aria-label="Blog">
        <div className="container">
          <ArticleList articles={articles} />
        </div>
      </section>
    </PageShell>
  );
}
