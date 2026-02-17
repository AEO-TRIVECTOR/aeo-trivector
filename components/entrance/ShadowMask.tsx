// ============================================================
// SHADOW MASK — Pure black disc at event horizon
// Prevents bloom from bleeding into the void
// ============================================================

import * as THREE from 'three'

export function ShadowMask({ radius = 5 }: { radius?: number }) {
  // Shadow disc at 92% of ring radius (just inside event horizon)
  const shadowRadius = radius * 0.92

  return (
    <mesh position={[0, -0.3, 0.1]} renderOrder={-1}>
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
