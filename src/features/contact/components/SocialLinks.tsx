import Link from 'next/link';
import type { SocialLink } from '../types';
import { useTranslation } from '@/components/LanguageProvider';
import styles from './SocialLinks.module.css';

interface SocialLinksProps {
  links: SocialLink[];
}

export function SocialLinks({ links }: SocialLinksProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <span className="mono-label">{t('contact.elsewhere' as any)}</span>
      <ul className={styles.list}>
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.url}
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
            >
              <span>{link.name}</span>
              <span className={styles.arrow} aria-hidden="true">&nearr;</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
