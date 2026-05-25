'use client';

import { useState, useEffect } from 'react';
import { CanvasWrapper } from '@/components/three';
import { ParticleField } from './ParticleField';
import { useParticleConfig } from '../hooks/useParticleConfig';

export function ParticleCanvas() {
  const config = useParticleConfig();
  const [drei, setDrei] = useState<Record<string, React.ComponentType<any>> | null>(null);
  const [pp, setPP] = useState<Record<string, React.ComponentType<any>> | null>(null);

  useEffect(() => {
    import('@react-three/drei').then((mod) => {
      setDrei({ OrbitControls: mod.OrbitControls });
    });
    import('@react-three/postprocessing').then((mod) => {
      setPP({ EffectComposer: mod.EffectComposer, Bloom: mod.Bloom });
    });
  }, []);

  const OC = drei?.OrbitControls;
  const EC = pp?.EffectComposer;
  const BL = pp?.Bloom;

  return (
    <CanvasWrapper camera={{ fov: 60, position: [0, 0, 8] }} className="hero__canvas">
      <ParticleField />
      {OC && (
        <OC
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.15}
        />
      )}
      {EC && BL && config.useBloom && (
        <EC>
          <BL
            intensity={0.4}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EC>
      )}
    </CanvasWrapper>
  );
}
