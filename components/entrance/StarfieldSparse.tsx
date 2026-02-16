'use client';

import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';

type StarfieldSparseProps = {
  count?: number;
  spread?: number;
  drift?: number; // base drift speed
  timeScale?: number; // 0..1, used for "time dilation"
};

export function StarfieldSparse({
  count = 900,
  spread = 60,
  drift = 0.03,
  timeScale = 1,
}: StarfieldSparseProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions } = useMemo(() => {
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // biased distribution: keep most stars far and sparse
      const x = (Math.random() - 0.5) * spread;
      const y = (Math.random() - 0.5) * spread;
      const z = -Math.random() * spread;

      pos[i * 3 + 0] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }
    return { positions: pos };
  }, [count, spread]);

  useFrame((_, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;
    // Very slow drift = "alive, not busy"
    pts.rotation.y += delta * drift * 0.08 * timeScale;
    pts.rotation.x += delta * drift * 0.03 * timeScale;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.02}
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  );
}
