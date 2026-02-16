// ShaderAccretionDisk.tsx - Production-grade accretion disk with motion trails
'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface AccretionDiskProps {
  particleCount?: number
  innerRadius?: number
  outerRadius?: number
  thickness?: number
}

export function ShaderAccretionDisk({ 
  particleCount = 12000,
  innerRadius = 1.8,
  outerRadius = 7.0,
  thickness = 0.4
}: AccretionDiskProps) {
  const pointsRef = useRef<THREE.Points>(null)
  
  // Particle data structure with proper orbital mechanics
  const { geometry, speeds, radii } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const speeds = new Float32Array(particleCount)
    const radii = new Float32Array(particleCount)
    const sizes = new Float32Array(particleCount)
    
    for (let i = 0; i < particleCount; i++) {
      // Logarithmic radius distribution (more particles near inner edge)
      const u = Math.random()
      const r = innerRadius * Math.pow(outerRadius / innerRadius, u)
      radii[i] = r
      
      // Keplerian velocity: v ∝ r^(-1/2)
      // Inner particles orbit faster (like Saturn's rings)
      const baseSpeed = 0.4 / Math.sqrt(r / innerRadius)
      speeds[i] = baseSpeed * (0.9 + Math.random() * 0.2)
      
      // Initial angle
      const angle = Math.random() * Math.PI * 2
      
      // Position
      positions[i * 3] = Math.cos(angle) * r
      positions[i * 3 + 1] = Math.sin(angle) * r
      
      // Vertical position - disk thickness with slight warp
      const diskWarp = Math.sin(angle * 3) * 0.05 * r
      positions[i * 3 + 2] = (Math.random() - 0.5) * thickness * (r / outerRadius) + diskWarp
      
      // Temperature-based color (Planck blackbody radiation)
      // T ∝ r^(-3/4) for thin accretion disk
      const temp = Math.pow(innerRadius / r, 0.75)
      
      if (temp > 0.8) {
        // Ultra-hot: Blue-white (like Rigel)
        colors[i * 3] = 0.8 + temp * 0.2      // R
        colors[i * 3 + 1] = 0.9 + temp * 0.1  // G
        colors[i * 3 + 2] = 1.0               // B
      } else if (temp > 0.5) {
        // Hot: Yellow-white (like the Sun)
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 0.9 + temp * 0.1
        colors[i * 3 + 2] = 0.6 + temp * 0.4
      } else if (temp > 0.3) {
        // Warm: Golden-orange
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 0.6 + temp * 0.4
        colors[i * 3 + 2] = 0.2 + temp * 0.4
      } else {
        // Cool: Orange-red
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 0.3 + temp * 0.4
        colors[i * 3 + 2] = 0.1 + temp * 0.2
      }
      
      // Particle size: larger near inner edge (brighter = more visible)
      sizes[i] = (0.08 + temp * 0.12) * (1.0 + Math.random() * 0.3)
    }
    
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    
    return { geometry: geo, speeds, radii }
  }, [particleCount, innerRadius, outerRadius, thickness])
  
  // Custom shader for motion-streaked particles
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: typeof window !== 'undefined' ? window.devicePixelRatio : 1 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        
        varying vec3 vColor;
        varying float vAlpha;
        
        uniform float time;
        uniform float pixelRatio;
        
        void main() {
          vColor = color;
          
          // Fade based on Z-depth (closer = brighter)
          vAlpha = 0.6 + (position.z + 2.0) * 0.2;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Size attenuation with minimum visible size
          float dist = length(mvPosition.xyz);
          float attenuatedSize = size * (300.0 / dist);
          
          gl_PointSize = max(2.0, attenuatedSize * pixelRatio);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          // Circular particle with soft edges
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          // Soft gaussian falloff
          float alpha = exp(-dist * dist * 8.0) * vAlpha;
          
          // Add core brightness
          float core = 1.0 - smoothstep(0.0, 0.2, dist);
          vec3 finalColor = vColor * (1.0 + core * 0.5);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    })
  }, [])
  
  // Animate orbital motion
  useFrame((state) => {
    if (!pointsRef.current) return
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    const time = state.clock.elapsedTime
    
    for (let i = 0; i < particleCount; i++) {
      const r = radii[i]
      const speed = speeds[i]
      
      // Current angle based on initial position + rotation
      const currentX = positions[i * 3]
      const currentY = positions[i * 3 + 1]
      const currentAngle = Math.atan2(currentY, currentX)
      
      // Update angle with Keplerian velocity
      const newAngle = currentAngle + speed * 0.016 // ~60fps
      
      // Apply new position
      positions[i * 3] = Math.cos(newAngle) * r
      positions[i * 3 + 1] = Math.sin(newAngle) * r
      
      // Slight turbulent vertical motion
      const turbulence = Math.sin(time * 0.5 + i * 0.01) * 0.02
      positions[i * 3 + 2] += turbulence
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true
    
    // Update shader time uniform
    shaderMaterial.uniforms.time.value = time
    
    // Rotate entire disk slowly for cinematic effect
    pointsRef.current.rotation.z = time * 0.02
  })
  
  // Cleanup
  useEffect(() => {
    return () => {
      geometry.dispose()
      shaderMaterial.dispose()
    }
  }, [geometry, shaderMaterial])
  
  return (
    <points ref={pointsRef} geometry={geometry} material={shaderMaterial} />
  )
}
