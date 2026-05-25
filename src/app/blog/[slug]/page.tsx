import { PageShell } from '@/components/layout';
import { ArticleContent, getArticleBySlug } from '@/features/blog';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: 'Not Found' };
  return {
    title: article.title,
    description: article.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <PageShell>
      <section className="blog-post-page" aria-label="Blog post">
        <div className="container">
          <ArticleContent
            title={article.title}
            date={article.date}
            readingTime={article.readingTime}
            tags={article.tags}
            content={article.content}
          />
        </div>
      </section>
    </PageShell>
  );
}
