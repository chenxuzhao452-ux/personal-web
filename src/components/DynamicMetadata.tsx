'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/components/LanguageProvider';
import type { TranslationKey } from '@/i18n/translations';

const PAGE_TITLE_KEYS: Record<string, TranslationKey> = {
  '/about': 'nav.about',
  '/projects': 'nav.projects',
  '/contact': 'nav.contact',
  '/blog': 'nav.blog',
};

export function DynamicMetadata() {
  const { t, lang } = useTranslation();
  const pathname = usePathname();

  useEffect(() => {
    const title = document.title;

    if (pathname === '/' || PAGE_TITLE_KEYS[pathname]) {
      const pageKey = PAGE_TITLE_KEYS[pathname];
      document.title = pageKey
        ? `${t(pageKey)} | ${t('site.name')}`
        : t('site.name');
    } else {
      const idx = title.indexOf(' | ');
      const pageTitle = idx !== -1 ? title.slice(0, idx) : title;
      document.title = pageTitle
        ? `${pageTitle} | ${t('site.name')}`
        : t('site.name');
    }

    document.documentElement.lang = lang === 'tw' ? 'zh-Hant' : lang;
  }, [lang, pathname, t]);

  return null;
}
