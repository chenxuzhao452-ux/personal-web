'use client';

import { m } from 'motion/react';
import type { TimelineEntry } from '../types';

interface TimelineItemProps {
  entry: TimelineEntry;
  index: number;
}

export function TimelineItem({ entry, index }: TimelineItemProps) {
  const isEven = index % 2 === 0;

  return (
    <m.div
      className={`timeline-item ${isEven ? 'timeline-item--left' : 'timeline-item--right'}`}
      initial={{ opacity: 0, x: isEven ? -48 : 48 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="timeline-item__dot" aria-hidden="true">
        <span className="timeline-item__dot-inner" />
      </div>
      <div className="timeline-item__card">
        <time className="timeline-item__year mono-label accent-text">{entry.year}</time>
        <h3 className="timeline-item__title">{entry.title}</h3>
        <p className="timeline-item__desc body-text">{entry.description}</p>
        {entry.tags && (
          <div className="timeline-item__tags">
            {entry.tags.map((tag) => (
              <span key={tag} className="timeline-item__tag mono-label">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .timeline-item {
          position: relative;
          padding: var(--space-5) 0;
          padding-left: var(--space-6);
        }

        .timeline-item__dot {
          position: absolute;
          left: -6px;
          top: var(--space-6);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid var(--color-accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .timeline-item__dot-inner {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-accent);
        }

        .timeline-item__card {
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          border: var(--glass-border);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          transition: border-color var(--duration-normal) var(--ease-out),
                      box-shadow var(--duration-normal) var(--ease-out);
        }

        .timeline-item__card:hover {
          border-color: var(--color-accent-glow);
          box-shadow: var(--shadow-glow);
        }

        .timeline-item__year {
          display: inline-block;
          margin-bottom: var(--space-2);
        }

        .timeline-item__title {
          font-family: var(--font-heading);
          font-size: var(--text-md);
          color: var(--color-text-primary);
          margin-bottom: var(--space-2);
        }

        .timeline-item__desc {
          margin-bottom: var(--space-3);
        }

        .timeline-item__tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .timeline-item__tag {
          padding: var(--space-1) var(--space-3);
          background: rgba(108, 92, 231, 0.1);
          border-radius: var(--radius-full);
        }

        @media (max-width: 768px) {
          .timeline-item {
            padding-left: var(--space-6);
          }
        }
      `}</style>
    </m.div>
  );
}
