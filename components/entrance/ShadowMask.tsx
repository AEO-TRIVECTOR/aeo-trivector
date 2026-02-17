// ============================================================
// SHADOW MASK — Pure black disc at event horizon
// Prevents bloom from bleeding into the void
// ============================================================

import * as THREE from 'three'

export function ShadowMask({ radius = 5 }: { radius?: number }) {
  // Shadow disc at 96% of ring radius (larger to block bloom bleeding)
  const shadowRadius = radius * 0.96

  return (
    <mesh position={[0, -0.5, 0.05]} renderOrder={-1}>
      <circleGeometry args={[shadowRadius, 128]} />
      <meshBasicMaterial
        color="#000000"
        transparent={false}
        depthWrite={true}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}
