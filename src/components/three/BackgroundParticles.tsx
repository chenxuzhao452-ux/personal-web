'use client';

import { useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { CanvasWrapper } from './CanvasWrapper';
import { ParticleLayer } from '@/features/hero/components/ParticleLayer';

interface BackgroundParticlesProps {
  avoidRef?: React.RefObject<HTMLElement | null>;
}

export function BackgroundParticles({ avoidRef }: BackgroundParticlesProps) {
  const reducedMotion = useReducedMotion();
  const [isMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  if (reducedMotion || isMobile) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <CanvasWrapper camera={{ fov: 65, position: [0, 0, 12] }}>
        <ParticleLayer
          count={500}
          spread={[22, 16, 12]}
          baseSize={0.08}
          speed={0.35}
          color="#8b7cf0"
          colorAccent="#a78bfa"
          mouseReactive={false}
          opacityBoost={2.2}
          driftSpeed={0.08}
          avoidRef={avoidRef}
        />
        <ParticleLayer
          count={320}
          spread={[20, 14, 10]}
          baseSize={0.07}
          speed={0.3}
          color="#00f5e9"
          colorAccent="#5eead4"
          mouseReactive={false}
          opacityBoost={1.8}
          driftSpeed={-0.08}
          avoidRef={avoidRef}
        />
      </CanvasWrapper>
    </div>
  );
}
