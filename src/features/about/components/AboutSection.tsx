'use client';

import type { RefObject } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import { useTranslation } from '@/components/LanguageProvider';
import { Timeline } from './Timeline';
import type { TimelineEntry } from '../types';

const TIMELINE: TimelineEntry[] = [
  {
    year: 'about.timeline.2023.year',
    title: 'about.timeline.2023.title',
    description: 'about.timeline.2023.desc',
    tags: ['Python', 'PyTorch', 'Linux', 'Git'],
  },
];

const BIO_KEYS = [
  'about.bio.1', 'about.bio.2', 'about.bio.3', 'about.bio.4',
  'about.bio.5', 'about.bio.6', 'about.bio.7', 'about.bio.8', 'about.bio.9',
];

interface AboutSectionProps {
  photoRef?: RefObject<HTMLDivElement | null>;
}

export function AboutSection({ photoRef }: AboutSectionProps) {
  const { t } = useTranslation();

  const entries = TIMELINE.map((entry) => ({
    ...entry,
    year: t(entry.year as any),
    title: t(entry.title as any),
    description: t(entry.description as any),
  }));

  return (
    <section className="about" aria-label="About me">
      <div className="container">
        <div className="about__grid">
          <m.div
            className="about__bio"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="mono-label">{t('about.title')}</span>
            <h2 className="heading-2" style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              {t('about.heading')}
            </h2>

            <div className="about__photo" ref={photoRef}>
              <Image
                src="/images/photo.png"
                alt="Chancy Zhao"
                className="about__photo-img"
                width={676}
                height={1024}
                priority
                sizes="180px"
                style={{ width: '180px', height: 'auto' }}
              />
            </div>

            {BIO_KEYS.map((key, i) => {
              if (key === 'about.bio.9') {
                return (
                  <p key={i} className="body-large" style={{ marginBottom: 'var(--space-4)' }}>
                    {t(key as any)}
                    <a href={`mailto:${t('contact.email' as any)}`} className="about__email-link">
                      {t('contact.email' as any)}
                    </a>
                  </p>
                );
              }
              return (
                <p key={i} className="body-large" style={{ marginBottom: 'var(--space-4)' }}>
                  {t(key as any)}
                </p>
              );
            })}

          </m.div>

          <div className="about__timeline">
            <h3 className="mono-label" style={{ marginBottom: 'var(--space-6)' }}>
              {t('about.journey')}
            </h3>
            <Timeline entries={entries} />

            <div className="about__hobbies">
              <span className="mono-label">{t('about.hobbies' as any)}</span>
              <ul className="about__hobby-list">
                <li>
                  <span className="hobby-icon">📚</span>
                  <p className="body-text">{t('about.hobbies.manga' as any)}</p>
                </li>
                <li>
                  <span className="hobby-icon">💪</span>
                  <p className="body-text">{t('about.hobbies.fitness' as any)}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .about {
          padding: var(--section-padding-y) 0;
          min-height: 100vh;
          min-height: 100dvh;
        }

        .about__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-12);
          align-items: start;
        }

        .about__bio {
          position: sticky;
          top: calc(var(--header-height) + var(--space-8));
        }

        .about__hobbies {
          margin-top: var(--space-8);
          padding-top: var(--space-6);
          border-top: 1px solid var(--color-border-subtle);
        }

        .about__hobby-list {
          list-style: none;
          padding: 0;
          margin: var(--space-4) 0 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .about__hobby-list li {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
        }

        .hobby-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .about__hobby-list p {
          color: var(--color-text-secondary);
          margin: 0;
        }

        .about__photo {
          margin-bottom: var(--space-6);
        }

        .about__photo {
          position: relative;
          margin-bottom: var(--space-6);
          display: flex;
          justify-content: center;
        }

        .about__photo::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 320px;
          height: 420px;
          background: radial-gradient(
            ellipse 60% 55% at 50% 50%,
            var(--color-void) 0%,
            rgba(10, 10, 15, 0.85) 35%,
            rgba(10, 10, 15, 0.4) 65%,
            transparent 100%
          );
          border-radius: 50%;
          pointer-events: none;
          z-index: -1;
        }

        .about__photo-img {
          position: relative;
          width: 180px;
          border-radius: var(--radius-lg);
          border: 2px solid rgba(140, 124, 240, 0.2);
          transition: border-color var(--duration-fast) var(--ease-out),
                      box-shadow var(--duration-fast) var(--ease-out);
        }

        .about__photo-img:hover {
          border-color: var(--color-accent);
          box-shadow: 0 0 24px rgba(108, 92, 231, 0.3);
        }

        .about__email-link {
          color: var(--color-accent-secondary);
          text-decoration: none;
          transition: color var(--duration-fast) var(--ease-out);
        }

        .about__email-link:hover {
          color: var(--color-accent);
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .about__grid {
            grid-template-columns: 1fr;
            gap: var(--space-8);
          }

          .about__bio {
            position: static;
          }
        }
      `}</style>
    </section>
  );
}