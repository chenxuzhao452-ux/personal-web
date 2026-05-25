'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation } from './Navigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { cn } from '@/utils';
import type { NavItem } from '@/types/global';

interface HeaderProps {
  siteName: string;
  navItems: NavItem[];
}

export function Header({ siteName, navItems }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn('header', isScrolled && 'is-scrolled')}
      role="banner"
    >
      <div className="header__inner container">
        <Link href="/" className="header__logo" aria-label="Home">
          <span className="header__logo-text mono-label accent-glow">
            {siteName}
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Navigation items={navItems} />
          <LanguageSwitcher />
        </div>
      </div>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: var(--z-sticky);
          height: var(--header-height);
          transition: background var(--duration-normal) var(--ease-out),
                      box-shadow var(--duration-normal) var(--ease-out);
        }

        .header.is-scrolled {
          background: rgba(10, 10, 15, 0.85);
          backdrop-filter: blur(12px);
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .header__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }

        .header__logo-text {
          transition: text-shadow var(--duration-normal) var(--ease-out);
        }

        .header__logo:hover .header__logo-text {
          text-shadow: 0 0 30px var(--color-accent-glow);
        }
      `}</style>
    </header>
  );
}
