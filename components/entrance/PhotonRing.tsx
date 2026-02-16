'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { Ring } from '@react-three/drei';

type PhotonRingProps = {
  radius?: number;
  thickness?: number;
  intensity?: number; // 0..1
  y?: number;
};

export function PhotonRing({
  radius = 6.0,
  thickness = 0.06,
  intensity = 0.9,
  y = -3.2,
}: PhotonRingProps) {
  const colorCore = useMemo(() => new THREE.Color('#FFF7D6'), []);
  const colorHalo = useMemo(() => new THREE.Color('#FFD700'), []);

  // Two rings: a thin "razor" core + a wider, faint halo.
  return (
    <group position={[0, y, 0]}>
      {/* Halo */}
      <Ring args={[radius - thickness * 2.0, radius + thickness * 2.0, 256]}>
        <meshBasicMaterial
          color={colorHalo}
          transparent
          opacity={0.12 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Ring>

      {/* Core */}
      <Ring args={[radius - thickness, radius + thickness, 256]}>
        <meshBasicMaterial
          color={colorCore}
          transparent
          opacity={0.55 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Ring>
    </group>
  );
}
