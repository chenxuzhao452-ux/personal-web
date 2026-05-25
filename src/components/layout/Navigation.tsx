'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/utils';
import type { NavItem } from '@/types/global';

interface NavigationProps {
  items: NavItem[];
  className?: string;
}

export function Navigation({ items, className }: NavigationProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <nav className={cn('navigation', className)} aria-label="Main navigation">
      <ul className="navigation__list" role="menubar">
        {items.map((item, index) => (
          <li key={item.href} role="none">
            <Link
              href={item.href}
              className={cn(
                'navigation__link',
                activeIndex === index && 'is-active'
              )}
              role="menuitem"
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <span className="navigation__link-text">{item.label}</span>
              <span className="navigation__link-indicator" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .navigation {
          display: flex;
          align-items: center;
        }

        .navigation__list {
          display: flex;
          gap: var(--space-6);
          list-style: none;
        }

        .navigation__link {
          position: relative;
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          letter-spacing: 0.04em;
          padding: var(--space-1) 0;
          transition: color var(--duration-fast) var(--ease-out);
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .navigation__link:hover,
        .navigation__link:focus-visible,
        .navigation__link.is-active {
          color: var(--color-text-primary);
          outline: none;
        }

        .navigation__link-indicator {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-accent);
          transform: scale(0);
          transition: transform var(--duration-normal) var(--ease-spring);
        }

        .navigation__link:hover .navigation__link-indicator,
        .navigation__link:focus-visible .navigation__link-indicator,
        .navigation__link.is-active .navigation__link-indicator {
          transform: scale(1);
        }

        .navigation__link-text {
          position: relative;
        }
      `}</style>
    </nav>
  );
}
