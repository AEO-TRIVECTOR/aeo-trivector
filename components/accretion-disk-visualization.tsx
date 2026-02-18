'use client'

// Optimized black hole visualization with React Three Fiber
// Self-contained implementation without external component dependencies
// Mobile-optimized with SSR-safe metric state

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import {
  EffectComposer,
  Bloom,
  Vignette,
  ToneMapping,
} from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

// ============================================================
// SSR-SAFE METRIC STATE HOOK
// ============================================================

function useMetricState() {
  const [isClient, setIsClient] = useState(false)

  const stateRef = useRef({
    metric: 0,
    orbital: 0,
    breathing: 0,
    turbulenceSeeds: {
      seed1: 0,
      seed2: 0,
      seed3: 0,
    },
  })

  useEffect(() => {
    setIsClient(true)
    stateRef.current.turbulenceSeeds = {
      seed1: Math.random() * 1000,
      seed2: Math.random() * 1000,
      seed3: Math.random() * 1000,
    }
  }, [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const s = stateRef.current
    s.metric = (t / 180) % 1
    s.orbital = (t / 60) % 1
    s.breathing = (t / 45) % 1
  })

  if (!isClient) {
    return {
      state: {
        metric: 0,
        orbital: 0,
        breathing: 0,
        turbulenceSeeds: {
          seed1: 0,
          seed2: 0,
          seed3: 0,
        },
      },
    }
  }

  return {
    state: stateRef.current,
  }
}

// ============================================================
// CAMERA DRIFT
// ============================================================

function CameraDrift({ metricState }: { metricState: any }) {
  const initialPos = useRef<THREE.Vector3 | null>(null)

  useFrame(({ camera }) => {
    if (!initialPos.current) {
      initialPos.current = camera.position.clone()
    }

    const orbitalPhase = metricState.orbital
    const breathingPhase = metricState.breathing
    
    camera.position.x = initialPos.current.x + Math.sin(orbitalPhase * Math.PI * 2) * 0.03
    camera.position.y = initialPos.current.y + Math.cos(breathingPhase * Math.PI * 2) * 0.02
    camera.rotation.z = Math.sin(metricState.metric * Math.PI * 2 * 0.5) * 0.002

    camera.lookAt(0, 0, 0)
  })

  return null
}

// ============================================================
// STAR FIELD
// ============================================================

function StarField() {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const [positions, sizes, randoms] = useMemo(() => {
    const count = 2000
    const pos = new Float32Array(count * 3)
    const sz = new Float32Array(count)
    const rnd = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 50 * (0.3 + 0.7 * Math.random())

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)

      sz[i] = Math.pow(Math.random(), 2.5) * 2
      rnd[i] = Math.random()
    }
    return [pos, sz, rnd]
  }, [])

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.elapsedTime * 0.01
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          args={[randoms, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          attribute float aSize;
          attribute float aRandom;
          varying float vRandom;
          
          void main() {
            vRandom = aRandom;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize * (250.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform float uTime;
          varying float vRandom;
          
          void main() {
            float d = length(gl_PointCoord - 0.5) * 2.0;
            if (d > 1.0) discard;
            float alpha = 1.0 - smoothstep(0.0, 1.0, d);
            alpha *= alpha;
            
            float twinkle = sin(uTime * (1.2 + vRandom * 2.5) + vRandom * 6.28) * 0.2 + 0.8;
            gl_FragColor = vec4(vec3(1.0), alpha * 0.4 * twinkle);
          }
        `}
        uniforms={{
          uTime: { value: 0 },
        }}
      />
    </points>
  )
}

// ============================================================
// PHOTON RING
// ============================================================

function PhotonRing({
  metricState,
  ringRadius,
  rotation,
  intensity = 1.0,
}: {
  metricState: any
  ringRadius: number
  rotation: [number, number, number]
  intensity?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!meshRef.current) return
    
    const breathScale = 1.0 + Math.sin(metricState.breathing * Math.PI * 2) * 0.02
    meshRef.current.scale.setScalar(breathScale)
    
    const material = meshRef.current.material as THREE.ShaderMaterial
    if (material.uniforms) {
      material.uniforms.uIntensity.value = intensity * (0.9 + Math.sin(metricState.metric * Math.PI * 2) * 0.1)
    }
  })

  return (
    <mesh ref={meshRef} rotation={rotation}>
      <torusGeometry args={[ringRadius, 0.08, 16, 64]} />
      <shaderMaterial
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uIntensity;
          varying vec2 vUv;
          
          void main() {
            float brightness = 0.5 + 0.5 * sin(vUv.x * 6.28);
            vec3 color = vec3(1.0, 0.95, 0.85) * uIntensity * brightness;
            float alpha = smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
            gl_FragColor = vec4(color, alpha * 0.8);
          }
        `}
        uniforms={{
          uIntensity: { value: intensity },
        }}
      />
    </mesh>
  )
}

// ============================================================
// SCENE
// ============================================================

function Scene() {
  const { state: metricState } = useMetricState()
  const { viewport, camera } = useThree()
  
  const isMobile = viewport.width < 8

  const ringRadius = useMemo(() => {
    const vFOV = (camera.fov * Math.PI) / 180
    const viewportHeight = 2 * Math.tan(vFOV / 2) * Math.abs(camera.position.z)
    return viewportHeight * 0.45
  }, [viewport.width, viewport.height, camera.fov, camera.position.z])

  const tiltRad = (42 * Math.PI) / 180

  return (
    <>
      <CameraDrift metricState={metricState} />
      <StarField />

      <group position={[0, -1.2, 0]}>
        <PhotonRing
          metricState={metricState}
          ringRadius={ringRadius}
          rotation={[tiltRad, 0, 0]}
          intensity={1.2}
        />
        
        <PhotonRing
          metricState={metricState}
          ringRadius={ringRadius * 0.985}
          rotation={[tiltRad, 0, 0]}
          intensity={0.3}
        />
      </group>

      <EffectComposer disableNormalPass>
        <Bloom 
          intensity={isMobile ? 0.6 : 1.0} 
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
        />
        <Vignette eskil={false} offset={0.2} darkness={0.8} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  )
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function AccretionDiskVisualization() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      camera={{ fov: 60, near: 0.1, far: 1000, position: [0, 0, 8] }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
