import { PageShell } from '@/components/layout';
import { BackgroundParticles } from '@/components/three';
import { ResearchInterests } from '@/features/projects';
import { SkillsAside } from './SkillsAside';
import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Research',
  description: 'Research interests in Game AI, multimodal fusion, and embodied intelligence.',
};

export default function ProjectsPage() {
  return (
    <PageShell>
      <BackgroundParticles />
      <section className={styles.page} aria-label="Research interests and skills">
        <div className="container">
          <div className={styles.layout}>
            <ResearchInterests />
            <SkillsAside />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
