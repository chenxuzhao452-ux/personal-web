'use client';

import { m } from 'motion/react';

interface HeroHeadingProps {
  greeting: string;
  name: string;
  tagline: string;
}

export function HeroHeading({ greeting, name, tagline }: HeroHeadingProps) {
  const nameChars = name.split('');

  return (
    <div className="hero-heading">
      <m.span
        className="hero-heading__greeting"
        style={{ fontSize: 'var(--text-base)', letterSpacing: '0.06em', color: 'var(--color-text-secondary)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {greeting}
      </m.span>

      <h1 className="hero-heading__name" aria-label={name}>
        {nameChars.map((char, i) => (
          <m.span
            key={`${char}-${i}`}
            className="hero-heading__char"
            initial={{ opacity: 0, y: 60, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.3 + i * 0.04,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            {char === ' ' ? ' ' : char}
          </m.span>
        ))}
      </h1>

      <m.p
        className="hero-heading__tagline body-large"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
        {tagline}
      </m.p>

      <style jsx>{`
        .hero-heading {
          position: relative;
          z-index: var(--z-content);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-4);
          max-width: 800px;
        }

        .hero-heading__greeting {
          display: inline-block;
          font-size: var(--text-xl) !important;
          letter-spacing: 0.05em;
        }

        .hero-heading__name {
          font-family: var(--font-heading);
          font-size: var(--text-5xl);
          line-height: var(--leading-tight);
          letter-spacing: -0.03em;
          color: var(--color-text-primary);
          text-shadow: 0 0 80px var(--color-accent-glow);
          display: flex;
          flex-wrap: wrap;
        }

        .hero-heading__char {
          display: inline-block;
        }

        .hero-heading__tagline {
          max-width: 560px;
        }

        @media (max-width: 768px) {
          .hero-heading__name {
            font-size: var(--text-3xl);
          }
        }
      `}</style>
    </div>
  );
}
