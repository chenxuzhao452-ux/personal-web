'use client';

import { HeroSection } from '@/features/hero';
import { useTranslation } from '@/components/LanguageProvider';
import type { HeroContent } from '@/features/hero';

export default function Home() {
  const { t } = useTranslation();

  const heroContent: HeroContent = {
    greeting: t('hero.greeting'),
    name: t('hero.name'),
    tagline: t('hero.tagline'),
    cta: {
      primary: { label: t('hero.cta.projects'), href: '/projects' },
      secondary: { label: t('hero.cta.about'), href: '/about' },
    },
  };

  return <HeroSection content={heroContent} />;
}
