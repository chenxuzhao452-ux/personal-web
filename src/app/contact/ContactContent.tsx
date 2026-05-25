'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PageShell } from '@/components/layout';
import { ContactForm, SocialLinks } from '@/features/contact';
import { BackgroundParticles } from '@/components/three';
import { CanvasWrapper } from '@/components/three';
import type { SocialLink } from '@/features/contact';

function SpinningWireframe({ geometry, color, position, speed }: {
  geometry: THREE.BufferGeometry;
  color: string;
  position: [number, number, number];
  speed: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * speed[0];
    ref.current.rotation.y += delta * speed[1];
    ref.current.rotation.z += delta * speed[2];
  });
  return (
    <mesh ref={ref} position={position}>
      <primitive object={geometry} attach="geometry" />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.12} depthWrite={false} />
    </mesh>
  );
}

function WireframeShapes() {
  const icoGeo = useRef(new THREE.IcosahedronGeometry(2.2, 0));
  const octGeo = useRef(new THREE.OctahedronGeometry(1.6, 0));
  const icoSmallGeo = useRef(new THREE.IcosahedronGeometry(1.3, 0));

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
      <CanvasWrapper camera={{ fov: 60, position: [0, 0, 12] }}>
        <SpinningWireframe
          geometry={icoGeo.current}
          color="#8b7cf0"
          position={[-5, 1.5, -2]}
          speed={[0.15, 0.2, 0.1]}
        />
        <SpinningWireframe
          geometry={octGeo.current}
          color="#00f5e9"
          position={[4.5, -2, -4]}
          speed={[-0.1, -0.18, 0.12]}
        />
        <SpinningWireframe
          geometry={icoSmallGeo.current}
          color="#8b7cf0"
          position={[-3, -3, -3]}
          speed={[0.12, -0.15, -0.08]}
        />
      </CanvasWrapper>
    </div>
  );
}

interface ContactContentProps {
  socialLinks: SocialLink[];
}

export function ContactContent({ socialLinks }: ContactContentProps) {
  return (
    <PageShell>
      <BackgroundParticles />
      <WireframeShapes />
      <section className="contact-page" aria-label="Contact">
        <div className="container">
          <div className="contact-page__layout">
            <ContactForm />
            <aside className="contact-page__aside">
              <div className="contact-page__social-card">
                <SocialLinks links={socialLinks} />
              </div>
              <div className="contact-page__decoration" aria-hidden="true">
                <span className="contact-page__decoration-line" />
                <span className="contact-page__decoration-dot" />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <style jsx>{`
        .contact-page {
          position: relative;
          padding: var(--section-padding-y) 0;
          min-height: 100vh;
          min-height: 100dvh;
        }

        .contact-page__layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: var(--space-12);
          align-items: start;
        }

        .contact-page__aside {
          position: sticky;
          top: calc(var(--header-height) + var(--space-8));
        }

        .contact-page__social-card {
          position: relative;
          padding: var(--space-8);
          background: linear-gradient(
            135deg,
            rgba(140, 124, 240, 0.06) 0%,
            rgba(26, 26, 38, 0.9) 50%,
            rgba(0, 245, 233, 0.04) 100%
          );
          border: 1px solid rgba(140, 124, 240, 0.15);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(12px);
          overflow: hidden;
        }

        .contact-page__social-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(140, 124, 240, 0.4),
            rgba(0, 245, 233, 0.3),
            transparent
          );
        }

        .contact-page__social-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(140, 124, 240, 0.015) 2px,
            rgba(140, 124, 240, 0.015) 4px
          );
          pointer-events: none;
        }

        .contact-page__decoration {
          margin-top: var(--space-6);
          display: flex;
          align-items: center;
          gap: var(--space-3);
          opacity: 0.5;
        }

        .contact-page__decoration-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(
            90deg,
            rgba(140, 124, 240, 0.3),
            rgba(0, 245, 233, 0.1),
            transparent
          );
        }

        .contact-page__decoration-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #00f5e9;
          box-shadow: 0 0 6px rgba(0, 245, 233, 0.6);
        }

        @media (max-width: 768px) {
          .contact-page__layout {
            grid-template-columns: 1fr;
            gap: var(--space-8);
          }

          .contact-page__aside {
            position: static;
          }
        }
      `}</style>
    </PageShell>
  );
}
