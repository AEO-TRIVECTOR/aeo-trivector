'use client'

import { useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import * as THREE from 'three'
import { ShaderMaterial } from 'three'

// Gravitational lensing shader that warps space around the black hole
const GravitationalLensingMaterial = {
  uniforms: {
    tDiffuse: { value: null },
    blackHoleCenter: { value: new THREE.Vector2(0.5, 0.5) },
    schwarzschildRadius: { value: 0.15 },
    strength: { value: 1.0 },
    time: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 blackHoleCenter;
    uniform float schwarzschildRadius;
    uniform float strength;
    uniform float time;
    varying vec2 vUv;

    void main() {
      vec2 toCenter = vUv - blackHoleCenter;
      float dist = length(toCenter);
      
      // Einstein ring equation - gravitational lensing
      float warp = (schwarzschildRadius * schwarzschildRadius) / (dist * dist + 0.001);
      warp *= strength;
      
      // Add subtle time-based distortion for living feel
      float pulse = sin(time * 0.5) * 0.1 + 1.0;
      warp *= pulse;
      
      // Distort UV coordinates
      vec2 distortedUV = vUv + normalize(toCenter) * warp;
      
      // Chromatic aberration near the event horizon
      float aberration = warp * 0.02;
      float r = texture2D(tDiffuse, distortedUV + vec2(aberration, 0.0)).r;
      float g = texture2D(tDiffuse, distortedUV).g;
      float b = texture2D(tDiffuse, distortedUV - vec2(aberration, 0.0)).b;
      
      // Brightness boost near event horizon (photon ring effect)
      float brightness = 1.0 + (warp * 2.0);
      
      gl_FragColor = vec4(r * brightness, g * brightness, b * brightness, 1.0);
    }
  `,
}

extend({ GravitationalLensingMaterial: ShaderMaterial })

interface GravitationalLensingProps {
  blackHolePosition?: THREE.Vector2
  strength?: number
}

export function GravitationalLensing({ 
  blackHolePosition = new THREE.Vector2(0.5, 0.7), 
  strength = 1.0 
}: GravitationalLensingProps) {
  const materialRef = useRef<ShaderMaterial>(null)

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        ...GravitationalLensingMaterial.uniforms,
        blackHoleCenter: { value: blackHolePosition },
        strength: { value: strength },
      },
      vertexShader: GravitationalLensingMaterial.vertexShader,
      fragmentShader: GravitationalLensingMaterial.fragmentShader,
    })
  }, [blackHolePosition, strength])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <primitive ref={materialRef} object={material} attach="material" />
    </mesh>
  )
}
