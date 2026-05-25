'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const VERTEX = /* glsl */ `
  attribute float size;
  attribute float opacity;
  varying float vOpacity;
  varying float vDistortion;
  uniform float uTime;
  uniform float uMouseX;
  uniform float uMouseY;
  uniform float uSpeed;
  uniform float uScroll;
  uniform float uClickForce;
  uniform vec2 uClickPos;
  uniform vec2 uAvoidCenter;
  uniform float uAvoidRadius;
  uniform float uAvoidStrength;

  void main() {
    vec3 pos = position;

    float distortion = sin(pos.x * 4.0 + uTime * uSpeed) *
                       cos(pos.y * 5.0 + uTime * uSpeed * 0.7) *
                       sin(pos.z * 3.0 + uTime * uSpeed * 0.5);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vec4 clipPos = projectionMatrix * mvPosition;
    vec2 ndc = clipPos.xy / clipPos.w;

    float mouseDist = length(ndc - vec2(uMouseX, uMouseY));
    float mouseForce = smoothstep(0.28, 0.0, mouseDist) * 1.8;

    float clickDist = length(ndc - uClickPos);
    float clickForce = uClickForce * exp(-clickDist * clickDist * 20.0) * 0.8;

    // Avoid zone repulsion: push particles away from photo area
    float avoidDist = length(ndc - uAvoidCenter);
    float avoidFactor = 1.0 - smoothstep(0.0, uAvoidRadius, avoidDist);
    float strength = avoidFactor * uAvoidStrength;
    // Push particles away along Z (away from camera)
    pos.z -= strength * 50.0;
    // Push radially outward from origin in world XY
    // Uses particle's own world XY direction — more reliable than NDC direction
    float worldDist = length(pos.xy);
    vec2 worldDir = worldDist > 0.001 ? pos.xy / worldDist : vec2(0.0, 1.0);
    pos.x += worldDir.x * strength * 18.0;
    pos.y += worldDir.y * strength * 12.0;

    pos.z += distortion * 0.25 + mouseForce + clickForce;

    mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    gl_PointSize = size * (600.0 / -mvPosition.z) * (1.0 - uScroll * 0.6) * (1.0 - strength * 0.85);
    vOpacity = opacity * (1.0 - uScroll * 0.7) * (1.0 - strength * 0.9);
    vDistortion = abs(distortion);
  }
`;

const FRAGMENT = /* glsl */ `
  varying float vOpacity;
  varying float vDistortion;
  uniform float uTime;
  uniform float uScroll;
  uniform float uAlphaMul;
  uniform vec3 uColor;
  uniform vec3 uColorAccent;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float alpha = smoothstep(0.5, 0.0, dist);
    alpha *= vOpacity;

    float hueShift = sin(uTime * 0.3 + vDistortion * 3.0) * 0.15 + 0.85;
    vec3 color = mix(uColor, uColorAccent, vDistortion * hueShift * 2.0);

    float glow = exp(-dist * 4.0) * 0.8;
    color += uColorAccent * glow;

    gl_FragColor = vec4(color, alpha * uAlphaMul);
  }
`;

interface ParticleLayerProps {
  count: number;
  spread: [number, number, number];
  baseSize: number;
  speed: number;
  color: string;
  colorAccent: string;
  mouseReactive: boolean;
  opacityBoost?: number;
  driftSpeed?: number;
  clickRef?: React.MutableRefObject<{ force: number; x: number; y: number }>;
  avoidRef?: React.RefObject<HTMLElement | null>;
}

interface ParticleData {
  positions: Float32Array;
  sizes: Float32Array;
  opacities: Float32Array;
}

function generateParticles(count: number, spread: [number, number, number], baseSize: number, opacityBoost: number): ParticleData {
  const posArray = new Float32Array(count * 3);
  const sizeArray = new Float32Array(count);
  const opacityArray = new Float32Array(count);

  const rx = spread[0] * 0.5;
  const ry = spread[1] * 0.5;
  const rz = spread[2] * 0.5;

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = Math.pow(Math.random(), 0.5);

    posArray[i * 3] = Math.sin(phi) * Math.cos(theta) * r * rx;
    posArray[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r * ry;
    posArray[i * 3 + 2] = Math.cos(phi) * r * rz;

    sizeArray[i] = baseSize * (0.3 + Math.random() * 1.7);
    opacityArray[i] = (0.1 + Math.random() * 0.55) * opacityBoost;
  }

  return { positions: posArray, sizes: sizeArray, opacities: opacityArray };
}

export function ParticleLayer({
  count,
  spread,
  baseSize,
  speed,
  color,
  colorAccent,
  mouseReactive,
  opacityBoost = 1,
  driftSpeed = 0,
  clickRef,
  avoidRef,
}: ParticleLayerProps) {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    if (!mouseReactive) return;
    const handler = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [mouseReactive]);

  useEffect(() => {
    const handler = () => {
      scrollRef.current = Math.min(window.scrollY / 200, 1.0);
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const [particles, setParticles] = useState<ParticleData>({
    positions: new Float32Array(0),
    sizes: new Float32Array(0),
    opacities: new Float32Array(0),
  });

  useEffect(() => {
    if (count === 0) {
      setParticles({ positions: new Float32Array(0), sizes: new Float32Array(0), opacities: new Float32Array(0) });
    } else {
      setParticles(generateParticles(count, spread, baseSize, opacityBoost));
    }
  }, [count, spread, baseSize, opacityBoost]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouseX: { value: 0 },
      uMouseY: { value: 0 },
      uSpeed: { value: speed },
      uScroll: { value: 0 },
      uClickForce: { value: 0 },
      uClickPos: { value: new THREE.Vector2(0, 0) },
      uAvoidCenter: { value: new THREE.Vector2(0, 0) },
      uAvoidRadius: { value: 0 },
      uAvoidStrength: { value: 0 },
      uAlphaMul: { value: 0.8 },
      uColor: { value: new THREE.Color(color) },
      uColorAccent: { value: new THREE.Color(colorAccent) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    uniforms.uSpeed.value = speed;
  }, [speed, uniforms]);

  useFrame((_state, delta) => {
    if (!meshRef.current || count === 0) return;

    if (mouseReactive) {
      targetMouseRef.current.x += (mouseRef.current.x - targetMouseRef.current.x) * 0.06;
      targetMouseRef.current.y += (mouseRef.current.y - targetMouseRef.current.y) * 0.06;
    }

    uniforms.uTime.value += delta;
    uniforms.uMouseX.value = targetMouseRef.current.x;
    uniforms.uMouseY.value = targetMouseRef.current.y;

    const targetScroll = scrollRef.current;
    uniforms.uScroll.value += (targetScroll - uniforms.uScroll.value) * 0.15;

    if (clickRef) {
      uniforms.uClickForce.value = clickRef.current.force;
      uniforms.uClickPos.value.set(clickRef.current.x, clickRef.current.y);
    }

    if (avoidRef?.current) {
      const rect = avoidRef.current.getBoundingClientRect();
      const cx = (rect.left + rect.right) / 2;
      const cy = (rect.top + rect.bottom) / 2;
      uniforms.uAvoidCenter.value.set(
        (cx / window.innerWidth) * 2 - 1,
        -(cy / window.innerHeight) * 2 + 1
      );
      const ndcW = (rect.width / window.innerWidth) * 2;
      const ndcH = (rect.height / window.innerHeight) * 2;
      uniforms.uAvoidRadius.value = Math.max(ndcW, ndcH) * 3.0;
      uniforms.uAvoidStrength.value += (1.0 - uniforms.uAvoidStrength.value) * 0.08;
    } else {
      uniforms.uAvoidStrength.value += (0.0 - uniforms.uAvoidStrength.value) * 0.08;
    }

    if (driftSpeed > 0) {
      meshRef.current.rotation.y += delta * driftSpeed;
      meshRef.current.rotation.x += delta * driftSpeed * 0.4;
    }
  });

  if (count === 0 || particles.positions.length === 0) return null;

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[particles.sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-opacity"
          args={[particles.opacities, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
