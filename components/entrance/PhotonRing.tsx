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
  // Near-white core, golden halo
  const colorCore = useMemo(() => new THREE.Color('#FFFFFF'), []);
  const colorHalo = useMemo(() => new THREE.Color('#FFD700'), []);

  // ChatGPT spec: razor-thin core (0.3-0.6% of radius), faint wide halo
  const coreThickness = radius * 0.004; // 0.4% of radius - impossibly thin
  const haloThickness = radius * 0.08;  // Wide, faint glow

  return (
    <group position={[0, y, 0]}>
      {/* Faint wide halo - barely visible atmospheric glow */}
      <Ring args={[radius - haloThickness, radius + haloThickness, 256]}>
        <meshBasicMaterial
          color={colorHalo}
          transparent
          opacity={0.08 * intensity} // Very faint: 0.06-0.12 range
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Ring>

      {/* Razor-thin core - line of impossible brightness */}
      <Ring args={[radius - coreThickness, radius + coreThickness, 256]}>
        <meshBasicMaterial
          color={colorCore}
          transparent
          opacity={0.95 * intensity} // Near-opaque: 0.85-1.0 range
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Ring>

      {/* Doppler beaming - asymmetric brightness at apex (top center) */}
      {/* Semi-ring covering top 120° arc, 35% brighter */}
      <Ring 
        args={[radius - coreThickness * 1.5, radius + coreThickness * 1.5, 256, 1, Math.PI * 0.3, Math.PI * 0.66]}
        rotation={[0, 0, Math.PI * 0.17]} // Rotate to center on top
      >
        <meshBasicMaterial
          color={colorCore}
          transparent
          opacity={0.35 * intensity} // Additive boost
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Ring>
    </group>
  );
}
