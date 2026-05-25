'use client';

import { useTranslation } from '@/components/LanguageProvider';
import { SkillCloud } from '@/features/projects';
import { skillCategories } from '@/features/projects/data/projects';
import styles from './page.module.css';

export function SkillsAside() {
  const { t } = useTranslation();

  return (
    <aside className={styles.skills} aria-label={t('projects.skills')}>
      <span className="mono-label">{t('projects.skills')}</span>
      <h2 className="heading-2" style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        {t('projects.techRadar')}
      </h2>
      <SkillCloud categories={skillCategories} />
      <div className={styles.skillList}>
        {skillCategories.map((cat) => (
          <div key={cat.name} className={styles.skillCat}>
            <span className="mono-label accent-text">{cat.name}</span>
            <p className="body-text" style={{ marginTop: 'var(--space-2)' }}>
              {cat.skills.join(', ')}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}
