'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface ParticleLayerConfig {
  count: number;
  size: number;
  speed: number;
}

export interface ParticleConfig {
  bg: ParticleLayerConfig;
  fg: ParticleLayerConfig;
  useBloom: boolean;
}

const DESKTOP: ParticleConfig = {
  bg: { count: 8000, size: 0.035, speed: 0.15 },
  fg: { count: 4000, size: 0.05, speed: 0.4 },
  useBloom: true,
};

const MOBILE: ParticleConfig = {
  bg: { count: 3000, size: 0.04, speed: 0.12 },
  fg: { count: 2000, size: 0.06, speed: 0.35 },
  useBloom: false,
};

const REDUCED: ParticleConfig = {
  bg: { count: 0, size: 0, speed: 0 },
  fg: { count: 0, size: 0, speed: 0 },
  useBloom: false,
};

export function useParticleConfig(): ParticleConfig {
  const reducedMotion = useReducedMotion();
  const [config, setConfig] = useState<ParticleConfig>(DESKTOP);

  useEffect(() => {
    if (reducedMotion) {
      setConfig(REDUCED);
    } else {
      setConfig(window.innerWidth < 768 ? MOBILE : DESKTOP);
    }
  }, [reducedMotion]);

  return config;
}
