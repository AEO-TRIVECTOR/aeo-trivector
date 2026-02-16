'use client';

import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { PhotonRing } from './PhotonRing';
import { StarfieldSparse } from './StarfieldSparse';

type EntranceSceneProps = {
  timeScale: number;     // 0..1 (slows motion near horizon)
  ringIntensity: number; // 0..1 (flare on hover/click)
};

export function EntranceScene({ timeScale, ringIntensity }: EntranceSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={55} />
      <ambientLight intensity={0.25} />

      <StarfieldSparse count={900} spread={70} drift={0.03} timeScale={timeScale} />
      <PhotonRing radius={10.5} thickness={0.08} intensity={ringIntensity} y={-6.0} />

      {/* NOTE: Do NOT render AccretionDiskVisualization here */}
    </Canvas>
  );
}
