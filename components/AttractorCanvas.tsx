'use client'

import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Attractor } from '@/components/Attractor'

interface AttractorCanvasProps {
  count?: number
  opacity?: number
  speed?: number
}

/**
 * Client-only WebGL canvas. Imported via next/dynamic with ssr:false so it
 * never blocks SSR content rendering. The canvas is purely decorative —
 * all meaningful page content lives in the server-rendered wrapper.
 */
export default function AttractorCanvas({
  count = 8000,
  opacity = 0.42,
  speed = 0.8,
}: AttractorCanvasProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="fixed inset-0"
      style={{ zIndex: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <Canvas camera={{ position: [0, 0, 12], fov: 80 }}>
        <group>
          <Attractor count={count} opacity={opacity} speed={speed} />
        </group>
      </Canvas>
    </div>
  )
}
