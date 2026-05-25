'use client';

import { useState, useEffect, type ComponentType } from 'react';
import type { CanvasProps } from '@react-three/fiber';
import { LoadingFallback } from './LoadingFallback';

interface CanvasWrapperProps {
  children: React.ReactNode;
  camera?: { fov?: number; position?: [number, number, number] };
  className?: string;
}

export function CanvasWrapper({
  children,
  camera = { fov: 60, position: [0, 0, 8] },
  className,
}: CanvasWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const [R3FCanvas, setR3FCanvas] = useState<ComponentType<CanvasProps> | null>(null);

  useEffect(() => {
    setMounted(true);
    import('@react-three/fiber').then((mod) => {
      setR3FCanvas(() => mod.Canvas);
    });
  }, []);

  if (!mounted || !R3FCanvas) {
    return <LoadingFallback />;
  }

  return (
    <div className={className} style={{ position: 'absolute', inset: 0 }}>
      <R3FCanvas
        camera={camera}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ position: 'absolute', inset: 0 }}
      >
        {children}
      </R3FCanvas>
    </div>
  );
}
