'use client';

import { useState, useEffect } from 'react';
import { ParticleCanvas } from './ParticleCanvas';
import { HeroHeading } from './HeroHeading';
import { HeroCta } from './HeroCta';
import type { HeroContent } from '../types';

interface HeroSectionProps {
  content: HeroContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="hero" aria-label="Hero">
      <ParticleCanvas />
      <div className="hero__content container">
        {mounted ? (
          <>
            <HeroHeading
              greeting={content.greeting}
              name={content.name}
              tagline={content.tagline}
            />
            <HeroCta
              primary={content.cta.primary}
              secondary={content.cta.secondary}
            />
          </>
        ) : (
          <>
            <div className="hero-heading">
              <span className="hero-heading__greeting mono-label" style={{ opacity: 0, transform: 'translateY(20px)' }}>{content.greeting}</span>
              <h1 className="hero-heading__name" aria-label={content.name}>
                {content.name.split('').map((char, i) => (
                  <span key={`${char}-${i}`} className="hero-heading__char" style={{ opacity: 0, transform: 'translateY(60px) rotateX(-90deg)' }}>
                    {char === ' ' ? ' ' : char}
                  </span>
                ))}
              </h1>
              <p className="hero-heading__tagline body-large" style={{ opacity: 0, transform: 'translateY(20px)' }}>{content.tagline}</p>
            </div>
            <div className="hero-cta" style={{ opacity: 0, transform: 'translateY(20px)' }}>
              <a className="hero-cta__btn hero-cta__btn--primary" href={content.cta.primary.href}>
                <span className="hero-cta__glow" aria-hidden="true" />
                {content.cta.primary.label}
              </a>
              <a className="hero-cta__btn hero-cta__btn--secondary" href={content.cta.secondary.href}>
                {content.cta.secondary.label}
                <span className="hero-cta__arrow" aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </>
        )}
      </div>

      <p className="hero__copyright mono-label">
        &copy; {new Date().getFullYear()} Nebula Terminal. 用心构建。
      </p>

      <style jsx>{`
        .hero {
          position: relative;
          height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding-top: var(--header-height);
        }

        .hero__content {
          position: relative;
          z-index: var(--z-content);
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
          padding-top: var(--space-10);
          padding-bottom: var(--space-10);
        }

        .hero__copyright {
          position: absolute;
          bottom: var(--space-6);
          left: 50%;
          transform: translateX(-50%);
          z-index: var(--z-content);
          color: var(--color-text-tertiary);
          font-size: var(--text-xs);
          white-space: nowrap;
        }

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

        .hero-cta {
          position: relative;
          z-index: var(--z-content);
          display: flex;
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        .hero-cta__btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-6);
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          letter-spacing: 0.04em;
          border-radius: var(--radius-full);
          transition: color var(--duration-fast) var(--ease-out);
        }

        .hero-cta__btn--primary {
          background: var(--color-accent);
          color: #fff;
          overflow: hidden;
        }

        .hero-cta__btn--primary:hover {
          box-shadow: var(--shadow-glow-lg);
        }

        .hero-cta__glow {
          position: absolute;
          inset: -2px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--color-accent), var(--color-accent-secondary));
          opacity: 0;
          filter: blur(8px);
          transition: opacity var(--duration-normal) var(--ease-out);
          z-index: -1;
        }

        .hero-cta__btn--primary:hover .hero-cta__glow {
          opacity: 0.6;
        }

        .hero-cta__btn--secondary {
          color: var(--color-text-secondary);
          border: var(--border-thin);
        }

        .hero-cta__btn--secondary:hover {
          color: var(--color-text-primary);
          border-color: var(--color-accent-glow);
        }

        .hero-cta__arrow {
          transition: transform var(--duration-fast) var(--ease-out);
        }

        .hero-cta__btn--secondary:hover .hero-cta__arrow {
          transform: translateX(4px);
        }
      `}</style>
    </section>
  );
}
