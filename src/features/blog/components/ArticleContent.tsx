'use client';

interface ArticleContentProps {
  title: string;
  date: string;
  readingTime: string;
  tags: string[];
  content: string;
}

export function ArticleContent({ title, date, readingTime, tags, content }: ArticleContentProps) {
  return (
    <article className="article-content">
      <header className="article-content__header">
        <div className="article-content__meta">
          <time className="mono-label" dateTime={date}>
            {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
          <span className="mono-label">{readingTime}</span>
        </div>
        <h1 className="heading-1">{title}</h1>
        <div className="article-content__tags">
          {tags.map((tag) => (
            <span key={tag} className="mono-label">{tag}</span>
          ))}
        </div>
      </header>

      <div className="article-content__body">
        <MarkdownContent content={content} />
      </div>

      <style jsx>{`
        .article-content {
          max-width: var(--content-narrow);
          margin: 0 auto;
        }

        .article-content__header {
          margin-bottom: var(--space-10);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .article-content__meta {
          display: flex;
          gap: var(--space-4);
        }

        .article-content__tags {
          display: flex;
          gap: var(--space-3);
          padding-top: var(--space-3);
          border-top: var(--border-thin);
        }

        .article-content__body {
          font-size: var(--text-base);
          line-height: var(--leading-relaxed);
          color: var(--color-text-secondary);
        }
      `}</style>
    </article>
  );
}

function MarkdownContent({ content }: { content: string }) {
  const html = content
    .replace(/^### (.+)$/gm, '<h3 class="heading-3" style="margin-top: var(--space-8); margin-bottom: var(--space-3); color: var(--color-text-primary)">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="heading-2" style="margin-top: var(--space-10); margin-bottom: var(--space-4); color: var(--color-text-primary)">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color: var(--color-text-primary)">$1</strong>')
    .replace(/\n- (.+)/g, '\n<li class="body-text" style="margin-bottom: var(--space-2); padding-left: var(--space-4); list-style-type: disc">$1</li>')
    .replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul style="margin: var(--space-4) 0">$1</ul>')
    .split('\n\n')
    .map((block) => {
      if (block.startsWith('<h') || block.startsWith('<ul')) return block;
      return `<p class="body-text" style="margin-bottom: var(--space-4)">${block}</p>`;
    })
    .join('\n');

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
