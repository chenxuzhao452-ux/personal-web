'use client';

import { usePathname } from 'next/navigation';
import { useTranslation } from '@/components/LanguageProvider';
import styles from './Footer.module.css';

interface FooterProps {
  siteName: string;
  currentYear: number;
}

export function Footer({ siteName, currentYear }: FooterProps) {
  const { t } = useTranslation();
  const pathname = usePathname();

  if (pathname === '/') return null;

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`${styles.inner} container`}>
        <div className={styles.divider} aria-hidden="true" />
        <p className={`${styles.text} mono-label`}>
          &copy; {currentYear} {siteName}. {t('footer.built')}
        </p>
      </div>
    </footer>
  );
}
