'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from './LanguageProvider';
import type { Lang } from '@/i18n/translations';

const OPTIONS: { lang: Lang; label: string }[] = [
  { lang: 'en', label: 'EN' },
  { lang: 'zh', label: '简体中文' },
  { lang: 'tw', label: '繁體中文' },
  { lang: 'ja', label: '日本語' },
];

export function LanguageSwitcher() {
  const { t, lang, setLang } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelect = useCallback(
    (next: Lang) => {
      setLang(next);
      setOpen(false);
    },
    [setLang]
  );

  return (
    <div className="lang" ref={ref}>
      <button
        type="button"
        className="lang__trigger"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-label={t('settings.language')}
      >
        <svg
          className="lang__globe"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          suppressHydrationWarning
        >
          <circle cx="12" cy="12" r="10" suppressHydrationWarning />
          <ellipse cx="12" cy="12" rx="4" ry="10" suppressHydrationWarning />
          <path d="M2 12h20" suppressHydrationWarning />
        </svg>
        <span className="lang__label">{t('settings.language')}</span>
      </button>

      {open && (
        <div className="lang__menu">
          {OPTIONS.map((opt) => (
            <button
              key={opt.lang}
              type="button"
              className={`lang__option${opt.lang === lang ? ' is-active' : ''}`}
              onClick={() => handleSelect(opt.lang)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .lang {
          position: relative;
          margin-left: var(--space-3);
        }

        .lang__trigger {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          height: 28px;
          padding: 0 var(--space-3);
          background: transparent;
          border: var(--border-thin);
          border-radius: var(--radius-sm);
          cursor: pointer;
          color: var(--color-text-tertiary);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.04em;
          transition: color var(--duration-fast) var(--ease-out),
                      border-color var(--duration-fast) var(--ease-out),
                      background var(--duration-fast) var(--ease-out);
        }

        .lang__trigger:hover,
        .lang__trigger[aria-expanded="true"] {
          color: var(--color-text-primary);
          border-color: rgba(255, 255, 255, 0.18);
          background: rgba(108, 92, 231, 0.08);
        }

        .lang__globe {
          flex-shrink: 0;
        }

        .lang__label {
          color: inherit;
        }

        .lang__menu {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          min-width: 110px;
          background: var(--color-surface);
          border: var(--border-thin);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          z-index: var(--z-overlay);
        }

        .lang__option {
          display: block;
          width: 100%;
          padding: var(--space-2) var(--space-4);
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--color-text-secondary);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.04em;
          text-align: left;
          transition: background var(--duration-fast) var(--ease-out),
                      color var(--duration-fast) var(--ease-out);
        }

        .lang__option:hover {
          background: var(--color-elevated);
          color: var(--color-text-primary);
        }

        .lang__option.is-active {
          color: var(--color-accent);
          background: rgba(108, 92, 231, 0.08);
        }

        @media (max-width: 768px) {
          .lang__trigger {
            height: auto;
            min-height: 44px;
            min-width: 44px;
            padding: var(--space-2) var(--space-3);
          }

          .lang__option {
            min-height: 44px;
            display: flex;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
