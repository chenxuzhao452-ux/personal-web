'use client';

import { TimelineItem } from './TimelineItem';
import type { TimelineEntry } from '../types';

interface TimelineProps {
  entries: TimelineEntry[];
}

export function Timeline({ entries }: TimelineProps) {
  if (entries.length === 0) {
    return <p className="body-text">No timeline entries yet.</p>;
  }

  return (
    <div className="timeline" role="list">
      {entries.map((entry, index) => (
        <div key={`${entry.year}-${entry.title}`} role="listitem">
          <TimelineItem entry={entry} index={index} />
        </div>
      ))}

      <style jsx>{`
        .timeline {
          position: relative;
          padding-left: var(--space-6);
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 0;
          top: var(--space-5);
          bottom: 0;
          width: 1px;
          background: linear-gradient(
            to bottom,
            var(--color-accent),
            var(--color-accent-glow),
            transparent
          );
        }
      `}</style>
    </div>
  );
}
