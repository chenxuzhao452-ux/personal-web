'use client';

import { m } from 'motion/react';
import { useTranslation } from '@/components/LanguageProvider';

interface ResearchItem {
  titleKey: string;
  descKey: string;
  icon: string;
}

const INTERESTS: ResearchItem[] = [
  { titleKey: 'research.gameai.title', descKey: 'research.gameai.desc', icon: '🎮' },
  { titleKey: 'research.multimodal.title', descKey: 'research.multimodal.desc', icon: '🧠' },
  { titleKey: 'research.embodied.title', descKey: 'research.embodied.desc', icon: '🤖' },
];

export function ResearchInterests() {
  const { t } = useTranslation();

  return (
    <div className="research-wrapper">
      <m.div
        className="research-header"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="mono-label">{t('research.title' as any)}</span>
        <h2 className="heading-2" style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
          {t('research.heading' as any)}
        </h2>
      </m.div>

      <div className="research-grid">
        {INTERESTS.map((item, index) => (
          <m.div
            key={item.titleKey}
            className="research-card"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="research-card__icon">{item.icon}</span>
            <h3 className="heading-3">{t(item.titleKey as any)}</h3>
            <p className="body-text">{t(item.descKey as any)}</p>
          </m.div>
        ))}
      </div>

      <style jsx>{`
        .research-wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .research-header {
          max-width: 600px;
        }

        .research-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-5);
        }

        .research-card {
          background: var(--glass-bg);
          border: var(--glass-border);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          backdrop-filter: blur(12px);
          transition: border-color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
        }

        .research-card:hover {
          border-color: var(--color-accent);
          transform: translateY(-4px);
        }

        .research-card__icon {
          font-size: 2rem;
          display: block;
          margin-bottom: var(--space-3);
        }

        .research-card h3 {
          margin-bottom: var(--space-3);
        }

        .research-card p {
          color: var(--color-text-secondary);
          line-height: var(--leading-relaxed);
        }

        @media (max-width: 768px) {
          .research-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
