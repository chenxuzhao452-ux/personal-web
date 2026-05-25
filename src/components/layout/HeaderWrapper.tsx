'use client';

import { Header } from './Header';
import { useTranslation } from '@/components/LanguageProvider';

export function HeaderWrapper() {
  const { t } = useTranslation();

  const navItems = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.projects'), href: '/projects' },
    { label: t('nav.contact'), href: '/contact' },
  ];

  return <Header siteName={t('site.name')} navItems={navItems} />;
}
