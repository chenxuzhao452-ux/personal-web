'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { cn } from '@/utils';
import type { NavItem } from '@/types/global';

interface NavigationProps {
  items: NavItem[];
  className?: string;
}

export function Navigation({ items, className }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const menuOverlay = (
    <ul
      id="nav-menu"
      className={cn('navigation__list', isOpen && 'is-open')}
      role="menubar"
    >
      {items.map((item, index) => (
        <li key={item.href} role="none">
          <Link
            href={item.href}
            className={cn(
              'navigation__link',
              activeIndex === index && 'is-active'
            )}
            role="menuitem"
            onClick={closeMenu}
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
  );

  return (
    <nav className={cn('navigation', className)} aria-label="Main navigation">
      <button
        className="navigation__hamburger"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-controls="nav-menu"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <span className={cn('navigation__hamburger-line', isOpen && 'is-open')} />
        <span className={cn('navigation__hamburger-line', isOpen && 'is-open')} />
      </button>

      {mounted ? createPortal(menuOverlay, document.body) : menuOverlay}

      <style jsx>{`
        .navigation {
          display: flex;
          align-items: center;
        }

        .navigation__hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          padding: var(--space-2);
          z-index: var(--z-sticky);
        }

        .navigation__hamburger-line {
          display: block;
          width: 24px;
          height: 2px;
          background: var(--color-text-primary);
          transition: transform var(--duration-normal) var(--ease-out),
                      opacity var(--duration-fast) var(--ease-out);
        }

        .navigation__hamburger-line.is-open:first-child {
          transform: translateY(7px) rotate(45deg);
        }

        .navigation__hamburger-line.is-open:last-child {
          transform: translateY(-7px) rotate(-45deg);
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

        @media (max-width: 768px) {
          .navigation__hamburger {
            display: flex;
          }

          .navigation__list {
            position: fixed;
            inset: 0;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: var(--space-8);
            background: var(--color-overlay);
            backdrop-filter: blur(20px);
            opacity: 0;
            pointer-events: none;
            transition: opacity var(--duration-normal) var(--ease-out);
            z-index: var(--z-overlay);
          }

          .navigation__list.is-open {
            opacity: 1;
            pointer-events: auto;
          }

          .navigation__link {
            font-size: var(--text-lg);
          }
        }
      `}</style>
    </nav>
  );
}
