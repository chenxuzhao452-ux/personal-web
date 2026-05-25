'use client';

import { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { CanvasWrapper } from '@/components/three';
import type { SkillCategory } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  'ML/AI': '#8b7cf0',
  'CS Foundation': '#00f5e9',
  'Dev & Tools': '#ffe082',
};

function createGlowTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.9)');
  gradient.addColorStop(0.55, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

interface SkillNode {
  position: [number, number, number];
  skill: string;
  category: string;
}

function CentralGlow() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(140, 120, 240, 1)');
    gradient.addColorStop(0.1, 'rgba(120, 100, 220, 0.7)');
    gradient.addColorStop(0.35, 'rgba(60, 40, 160, 0.15)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    setTex(texture);
    return () => { texture.dispose(); };
  }, []);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    const s = 1 + Math.sin(delta * 60 + performance.now() * 0.001) * 0.04;
    meshRef.current.scale.setScalar(s);
  });

  if (!tex) return null;

  return (
    <sprite ref={meshRef} scale={[5, 5, 1]} raycast={() => null}>
      <spriteMaterial
        map={tex}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
        opacity={0.6}
      />
    </sprite>
  );
}

function HoverGlow({ position, texture, color }: { position: [number, number, number]; texture: THREE.CanvasTexture; color: string }) {
  const ref = useRef<THREE.Sprite>(null);
  useFrame((_state, delta) => {
    if (!ref.current) return;
    const pulse = 1 + Math.sin(delta * 30 + performance.now() * 0.005) * 0.06;
    ref.current.scale.setScalar(pulse);
  });
  return (
    <sprite ref={ref} position={position} scale={[0.55, 0.55, 1]} raycast={() => null}>
      <spriteMaterial
        map={texture}
        color={color}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
        opacity={0.8}
      />
    </sprite>
  );
}

function OrbitRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.children[0].rotation.x += delta * 0.12;
    groupRef.current.children[0].rotation.y += delta * 0.08;
    groupRef.current.children[1].rotation.x -= delta * 0.1;
    groupRef.current.children[1].rotation.z += delta * 0.14;
  });

  const ringGeo = useMemo(() => new THREE.TorusGeometry(1, 0.015, 16, 120), []);

  return (
    <group ref={groupRef}>
      <mesh geometry={ringGeo} scale={[2.2, 2.2, 2.2]} raycast={() => null}>
        <meshBasicMaterial color="#6c5ce7" transparent opacity={0.25} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh geometry={ringGeo} scale={[2.8, 2.8, 2.8]} raycast={() => null}>
        <meshBasicMaterial color="#00cec9" transparent opacity={0.18} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function Starfield() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 400;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const innerR = 5;
    const outerR = 10;
    for (let i = 0; i < count; i++) {
      // Random point in spherical shell
      const r = innerR + Math.random() * (outerR - innerR);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      // Mix of pale purple and pale cyan
      const mix = Math.random();
      col[i * 3] = 0.4 + mix * 0.1;
      col[i * 3 + 1] = 0.3 + mix * 0.3;
      col[i * 3 + 2] = 0.6 + mix * 0.3;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((_state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.03;
    pointsRef.current.rotation.x += delta * 0.015;
  });

  return (
    <points ref={pointsRef} raycast={() => null}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function WireframeSphere() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x += delta * 0.02;
  });

  const geo = useMemo(() => new THREE.IcosahedronGeometry(4.2, 3), []);

  return (
    <mesh ref={ref} geometry={geo} raycast={() => null}>
      <meshBasicMaterial
        color="#6c5ce7"
        wireframe
        transparent
        opacity={0.04}
        depthWrite={false}
      />
    </mesh>
  );
}

// 3 categories evenly spaced around the sphere (normalised)
const CAT_CENTERS: Record<string, [number, number, number]> = (() => {
  const raw: Record<string, [number, number, number]> = {
    'ML/AI': [0.82, 0.4, 0.4],
    'CS Foundation': [-0.82, -0.3, 0.45],
    'Dev & Tools': [0, 0.4, -0.9],
  };
  for (const key of Object.keys(raw)) {
    const v = raw[key];
    const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    raw[key] = [v[0] / len, v[1] / len, v[2] / len];
  }
  return raw;
})();

function BillboardLabel({ position, children }: { position: [number, number, number]; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ camera }) => {
    if (!ref.current?.parent) return;
    const inv = new THREE.Quaternion();
    ref.current.parent.getWorldQuaternion(inv).invert();
    ref.current.quaternion.copy(inv.multiply(camera.quaternion));
  });
  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
}

function SkillNodes({ categories }: { categories: SkillCategory[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [glowTexture, setGlowTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const tex = createGlowTexture();
    setGlowTexture(tex);
    return () => {
      tex.dispose();
    };
  }, []);

  const { nodes, pointsData, lineGeom } = useMemo(() => {
    const result: SkillNode[] = [];
    const radius = 3;
    const ringRadius = 1.3; // spread of each category ring on the sphere

    const catCenters = CAT_CENTERS;

    for (const cat of categories) {
      const skills = cat.skills;
      const center = catCenters[cat.name] ?? [0, 1, 0];
      // Build two orthogonal tangent vectors at the center point
      const up: [number, number, number] = [0, 1, 0];
      const t0: [number, number, number] = [
        up[1] * center[2] - up[2] * center[1],
        up[2] * center[0] - up[0] * center[2],
        up[0] * center[1] - up[1] * center[0],
      ];
      const t0Len = Math.sqrt(t0[0] * t0[0] + t0[1] * t0[1] + t0[2] * t0[2]);
      if (t0Len > 0.001) {
        t0[0] /= t0Len; t0[1] /= t0Len; t0[2] /= t0Len;
      } else {
        t0[0] = 1; t0[1] = 0; t0[2] = 0;
      }
      const t1: [number, number, number] = [
        center[1] * t0[2] - center[2] * t0[1],
        center[2] * t0[0] - center[0] * t0[2],
        center[0] * t0[1] - center[1] * t0[0],
      ];

      for (let i = 0; i < skills.length; i++) {
        const angle = (2 * Math.PI * i) / skills.length;
        const dx = (Math.cos(angle) * t0[0] + Math.sin(angle) * t1[0]) * ringRadius;
        const dy = (Math.cos(angle) * t0[1] + Math.sin(angle) * t1[1]) * ringRadius;
        const dz = (Math.cos(angle) * t0[2] + Math.sin(angle) * t1[2]) * ringRadius;
        // Position on sphere: center + tangent offset, then re-normalise to radius
        const px = center[0] * radius + dx;
        const py = center[1] * radius + dy;
        const pz = center[2] * radius + dz;
        const plen = Math.sqrt(px * px + py * py + pz * pz);
        result.push({
          position: [(px / plen) * radius, (py / plen) * radius, (pz / plen) * radius],
          skill: skills[i],
          category: cat.name,
        });
      }
    }

    const positions = new Float32Array(result.length * 3);
    const colors = new Float32Array(result.length * 3);

    result.forEach((n, i) => {
      positions[i * 3] = n.position[0];
      positions[i * 3 + 1] = n.position[1];
      positions[i * 3 + 2] = n.position[2];
      const c = new THREE.Color(CATEGORY_COLORS[n.category] ?? '#6c5ce7');
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    });

    // Connect each category's skills in a closed convex ring — skills are
    // already in angular order around their cluster centre so the polygon has no crossings.
    const lineVerts: number[] = [];
    const lineColors: number[] = [];

    const byCategory = new Map<string, SkillNode[]>();
    for (const node of result) {
      const list = byCategory.get(node.category);
      if (list) {
        list.push(node);
      } else {
        byCategory.set(node.category, [node]);
      }
    }

    for (const [, catNodes] of byCategory) {
      if (catNodes.length < 2) continue;
      const catColor = CATEGORY_COLORS[catNodes[0].category] ?? '#6c5ce7';
      const c = new THREE.Color(catColor);

      for (let i = 0; i < catNodes.length; i++) {
        const a = catNodes[i];
        const b = catNodes[(i + 1) % catNodes.length];
        lineVerts.push(a.position[0], a.position[1], a.position[2]);
        lineVerts.push(b.position[0], b.position[1], b.position[2]);
        lineColors.push(c.r, c.g, c.b);
        lineColors.push(c.r, c.g, c.b);
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineVerts, 3));
    lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    return {
      nodes: result,
      pointsData: { positions, colors },
      lineGeom: lineVerts.length > 0 ? lineGeo : null,
    };
  }, [categories]);

  const handlePointerOver = useCallback((skill: string) => {
    setHovered(skill);
    document.body.style.cursor = 'pointer';
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(null);
    document.body.style.cursor = 'auto';
  }, []);

  const [focusCategory, setFocusCategory] = useState<string | null>(null);

  const handleClick = useCallback((category: string) => {
    setFocusCategory(category);
  }, []);

  const prevCategory = useRef<string | null>(null);
  const focusTargetRef = useRef<{ x: number; y: number } | null>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!groupRef.current) return;

    // Detect category change and compute new focus target
    if (focusCategory !== prevCategory.current) {
      prevCategory.current = focusCategory;
      if (focusCategory) {
        const dir = CAT_CENTERS[focusCategory];
        if (dir) {
          focusTargetRef.current = {
            x: Math.atan2(dir[1], Math.sqrt(dir[0] * dir[0] + dir[2] * dir[2])),
            y: -Math.atan2(dir[0], dir[2]),
          };
        }
      } else {
        // Snap mouse target to current rotation on unfocus — no drift
        mouseTarget.current = {
          x: groupRef.current.rotation.x,
          y: groupRef.current.rotation.y,
        };
        focusTargetRef.current = null;
      }
    }

    if (focusTargetRef.current) {
      const t = focusTargetRef.current;
      groupRef.current.rotation.y += (t.y - groupRef.current.rotation.y) * 0.08;
      groupRef.current.rotation.x += (t.x - groupRef.current.rotation.x) * 0.08;
    } else {
      mouseTarget.current = {
        x: state.pointer.x * 0.6,
        y: state.pointer.y * 0.4,
      };
      groupRef.current.rotation.y += (mouseTarget.current.y - groupRef.current.rotation.y) * 0.04;
      groupRef.current.rotation.x += (mouseTarget.current.x - groupRef.current.rotation.x) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      <Starfield />
      <WireframeSphere />
      <CentralGlow />
      <OrbitRings />

      {lineGeom && (
        <lineSegments geometry={lineGeom} raycast={() => null}>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0.45}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      )}

      {glowTexture && (
        <points raycast={() => null}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[pointsData.positions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[pointsData.colors, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            map={glowTexture}
            vertexColors
            size={0.4}
            sizeAttenuation
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            opacity={1.0}
          />
        </points>
      )}

      {/* Invisible hit-spheres — transparent so R3F still processes events */}
      {nodes.map((node) => (
        <mesh
          key={`hit-${node.skill}`}
          position={node.position}
          onPointerOver={() => handlePointerOver(node.skill)}
          onPointerOut={handlePointerOut}
          onPointerDown={(e) => { e.stopPropagation(); handleClick(node.category); }}
        >
          <sphereGeometry args={[0.22, 8, 8]} />
          <meshBasicMaterial transparent opacity={0.01} depthWrite={false} />
        </mesh>
      ))}

      {/* Hover indicator — subtle pulsing glow on the hovered point */}
      {hovered && glowTexture && (
        <HoverGlow
          position={nodes.find((nd) => nd.skill === hovered)!.position}
          texture={glowTexture}
          color={CATEGORY_COLORS[nodes.find((nd) => nd.skill === hovered)!.category] ?? '#6c5ce7'}
        />
      )}

      {nodes.map((node) => {
        const isHovered = hovered === node.skill;
        const len = Math.sqrt(
          node.position[0] ** 2 + node.position[1] ** 2 + node.position[2] ** 2,
        );
        const offset = 0.3;
        const lx = node.position[0] + (node.position[0] / len) * offset;
        const ly = node.position[1] + (node.position[1] / len) * offset;
        const lz = node.position[2] + (node.position[2] / len) * offset;
        return (
          <BillboardLabel key={node.skill} position={[lx, ly, lz]}>
            <Text
              fontSize={isHovered ? 0.28 : 0.16}
              color={isHovered ? '#ffffff' : '#e8e8f8'}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0}
              raycast={() => null}
            >
              {node.skill}
            </Text>
          </BillboardLabel>
        );
      })}

      {/* Click empty space to unfocus */}
      <mesh
        onPointerDown={() => setFocusCategory(null)}
      >
        <sphereGeometry args={[8, 8, 8]} />
        <meshBasicMaterial side={THREE.BackSide} transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

interface SkillCloudProps {
  categories: SkillCategory[];
}

export function SkillCloud({ categories }: SkillCloudProps) {
  return (
    <div className="skill-cloud">
      <div className="skill-cloud__canvas">
        <CanvasWrapper camera={{ fov: 50, position: [0, 0, 8] }}>
          <fog attach="fog" args={['#0a0a0f', 6, 15]} />
          <SkillNodes categories={categories} />
        </CanvasWrapper>
      </div>

      <style jsx>{`
        .skill-cloud {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--color-deep);
          border: var(--border-thin);
        }

        .skill-cloud__canvas {
          height: 480px;
        }
      `}</style>
    </div>
  );
}
