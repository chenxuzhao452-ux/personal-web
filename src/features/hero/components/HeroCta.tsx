'use client';

import { useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { m } from 'motion/react';

interface CtaButton {
  label: string;
  href: string;
}

interface HeroCtaProps {
  primary: CtaButton;
  secondary: CtaButton;
}

function MagneticButton({ label, href, variant }: { label: string; href: string; variant: 'primary' | 'secondary' }) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPosition({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <Link
      ref={btnRef}
      href={href}
      className={`hero-cta__btn hero-cta__btn--${variant}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {variant === 'primary' && <span className="hero-cta__glow" aria-hidden="true" />}
      {label}
      {variant === 'secondary' && <span className="hero-cta__arrow" aria-hidden="true">&rarr;</span>}
    </Link>
  );
}

export function HeroCta({ primary, secondary }: HeroCtaProps) {
  return (
    <m.div
      className="hero-cta"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <MagneticButton label={primary.label} href={primary.href} variant="primary" />
      <MagneticButton label={secondary.label} href={secondary.href} variant="secondary" />

      <style jsx>{`
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
    </m.div>
  );
}
