'use client';

import Link from 'next/link';
import { m } from 'motion/react';
import type { BlogMeta } from '../types';

interface ArticleCardProps {
  article: BlogMeta;
  index: number;
}

export function ArticleCard({ article, index }: ArticleCardProps) {
  return (
    <m.article
      className="article-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/blog/${article.slug}`} className="article-card__inner">
        <div className="article-card__meta">
          <time className="mono-label" dateTime={article.date}>
            {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
          <span className="mono-label">{article.readingTime}</span>
        </div>
        <h3 className="article-card__title">{article.title}</h3>
        <p className="article-card__desc body-text">{article.description}</p>
        <div className="article-card__tags">
          {article.tags.map((tag) => (
            <span key={tag} className="mono-label">{tag}</span>
          ))}
        </div>
      </Link>

      <style jsx>{`
        .article-card__inner {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          padding: var(--space-5);
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          border: var(--glass-border);
          border-radius: var(--radius-lg);
          transition: border-color var(--duration-normal) var(--ease-out),
                      transform var(--duration-normal) var(--ease-out);
        }

        .article-card__inner:hover {
          border-color: var(--color-accent-glow);
          transform: translateY(-2px);
        }

        .article-card__meta {
          display: flex;
          gap: var(--space-4);
        }

        .article-card__title {
          font-family: var(--font-heading);
          font-size: var(--text-md);
          color: var(--color-text-primary);
          line-height: var(--leading-tight);
        }

        .article-card__desc {
          flex: 1;
        }

        .article-card__tags {
          display: flex;
          gap: var(--space-3);
          padding-top: var(--space-3);
          border-top: var(--border-thin);
        }
      `}</style>
    </m.article>
  );
}
