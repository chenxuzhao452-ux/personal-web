'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useParticleConfig } from '../hooks/useParticleConfig';
import { ParticleLayer } from './ParticleLayer';

export function ParticleField() {
  const config = useParticleConfig();
  const clickRef = useRef({ force: 0, x: 0, y: 0 });

  const handleClick = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    clickRef.current = { force: 1, x, y };
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [handleClick]);

  const totalParticles = config.bg.count + config.fg.count;
  if (totalParticles === 0) return null;

  return (
    <>
      <ParticleLayer
        count={config.bg.count}
        spread={[36, 28, 20]}
        baseSize={config.bg.size}
        speed={config.bg.speed}
        color="#6c5ce7"
        colorAccent="#4a3db5"
        mouseReactive={false}
        clickRef={clickRef}
      />
      <ParticleLayer
        count={config.fg.count}
        spread={[28, 22, 16]}
        baseSize={config.fg.size}
        speed={config.fg.speed}
        color="#6c5ce7"
        colorAccent="#00cec9"
        mouseReactive
        clickRef={clickRef}
      />
    </>
  );
}
