'use client';

import { useRef } from 'react';
import { PageShell } from '@/components/layout';
import { AboutSection } from '@/features/about';
import { BackgroundParticles } from '@/components/three';

export function AboutContent() {
  const photoRef = useRef<HTMLDivElement | null>(null);

  return (
    <PageShell>
      <BackgroundParticles avoidRef={photoRef} />
      <AboutSection photoRef={photoRef} />
    </PageShell>
  );
}
