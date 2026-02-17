// ============================================================
// INFALLING PARTICLES — Matter spiraling into the void
// 5-10 tiny particles showing gravitational capture
// ============================================================

import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function InfallingParticles({ count = 10, radius = 7 }) {
  const ref = useRef<THREE.Points>(null!)
  const [data] = useState(() =>
    new Array(count).fill(0).map((_, i) => ({
      angle: Math.random() * Math.PI * 2,
      r: radius + Math.random() * 4,
      height: -0.5 + Math.random() * 1.0,
      speed: 0.05 + Math.random() * 0.06,
      fall: 0.22 + Math.random() * 0.18,
      phase: Math.random() * Math.PI * 2,
    }))
  )

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    return arr
  }, [count])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const p = data[i]
      let r = p.r - p.fall * (t + p.phase * 0.3)
      let ang = p.angle + p.speed * (t + p.phase)

      // reset when it hits horizon
      if (r < 4.9) {
        r = p.r + Math.random() * 2.0
      }

      const idx = i * 3
      positions[idx] = r * Math.cos(ang)
      positions[idx + 1] = p.height
      positions[idx + 2] = r * Math.sin(ang) * 0.12
    }
    if (ref.current) {
      (ref.current.geometry.attributes.position as any).needsUpdate = true
    }
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.055}
        sizeAttenuation
        color="#f6e7c5"
        opacity={0.75}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
