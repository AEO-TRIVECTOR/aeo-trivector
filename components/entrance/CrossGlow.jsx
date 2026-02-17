'use client'

import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * CrossGlow Component
 * 
 * Atmospheric coupling between photon rings.
 * Creates subtle inter-ring illumination synchronized with metric state.
 */
export function CrossGlow({ metricState, ringRadius = 6.5, rotation = [0, 0, 0], visible = true }) {
  const meshRef = useRef()

  useFrame(() => {
    if (!meshRef.current?.material || !metricState?.current) return

    const metric = metricState.current
    
    // Modulate opacity with global glow (synchronized breathing)
    const baseOpacity = 0.08
    const opacity = baseOpacity * metric.globalGlow * 0.5
    
    meshRef.current.material.opacity = Math.max(0, Math.min(opacity, 0.15))
  })

  return (
    <mesh ref={meshRef} rotation={rotation} visible={visible}>
      <torusGeometry args={[ringRadius * 1.05, 0.25, 8, 64]} />
      <meshBasicMaterial
        color="#ffeedd"
        transparent
        opacity={0.08}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  )
}
