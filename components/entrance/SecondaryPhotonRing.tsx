// ============================================================
// SECONDARY PHOTON RING — Ghost ring showing photon subring
// Ultra-thin and faint at ~1.5× radius
// ============================================================

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PhotonRingVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export function SecondaryPhotonRing({ radius = 7.4 }) {
  const matRef = useRef<THREE.ShaderMaterial>(null!)

  const frag = /* glsl */`
    uniform float uTime;
    uniform float uIntensity;
    varying vec2 vUv;

    float hash(float n) { return fract(sin(n) * 43758.5453123); }
    float noise(float x) {
      float i = floor(x);
      float f = fract(x);
      return mix(hash(i), hash(i + 1.0), f * f * (3.0 - 2.0 * f));
    }

    void main() {
      float d = abs(vUv.y - 0.5) / 0.5;
      float ring = exp(-d * d * 420.0);    // razor thin

      float angle = vUv.x * 6.28318;
      float flicker = 0.85 + 0.15 * noise(angle * 25.0 + uTime * 1.7);

      vec3 color = vec3(1.3, 1.2, 1.0) * uIntensity * ring * flicker;
      float alpha = ring * 0.35 * flicker;
      gl_FragColor = vec4(color, alpha);
    }
  `

  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh rotation={[Math.PI * 0.35, 0, 0.05]} position={[0, -0.5, 0]}>
      <torusGeometry args={[radius, 0.006, 12, 512]} />
      <shaderMaterial
        ref={matRef}
        fragmentShader={frag}
        vertexShader={PhotonRingVertexShader}
        uniforms={{
          uTime: { value: 0 },
          uIntensity: { value: 0.45 }, // very faint, ~10% flux
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
