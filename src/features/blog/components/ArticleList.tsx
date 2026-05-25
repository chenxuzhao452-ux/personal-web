'use client';

import { m } from 'motion/react';
import { ArticleCard } from './ArticleCard';
import type { BlogMeta } from '../types';

interface ArticleListProps {
  articles: BlogMeta[];
}

export function ArticleList({ articles }: ArticleListProps) {
  return (
    <div className="article-list">
      <m.div
        className="article-list__header"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="mono-label">Blog</span>
        <h2 className="heading-2" style={{ marginTop: 'var(--space-3)' }}>
          Writing & thoughts.
        </h2>
      </m.div>

      {articles.length === 0 ? (
        <p className="body-text" style={{ padding: 'var(--space-8) 0' }}>
          No articles yet. Check back soon.
        </p>
      ) : (
        <div className="article-list__grid">
          {articles.map((article, index) => (
            <ArticleCard key={article.slug} article={article} index={index} />
          ))}
        </div>
      )}

      <style jsx>{`
        .article-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
        }

        .article-list__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
          gap: var(--space-5);
        }

        @media (max-width: 768px) {
          .article-list__grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .article-list__header {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
