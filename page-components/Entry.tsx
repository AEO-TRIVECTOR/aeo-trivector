'use client'

import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect, useMemo, Suspense, type CSSProperties } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CosmicEventHorizon } from '@/components/CosmicEventHorizon'
import * as THREE from 'three'
import { motion, useAnimation } from 'framer-motion'

// Star field component with gravitational distortion
function StarField({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const pointsRef = useRef<THREE.Points>(null)
  const originalPositionsRef = useRef<Float32Array | null>(null)
  const starCount = 2000

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(starCount * 3)
    const col = new Float32Array(starCount * 3)
    
    for (let i = 0; i < starCount; i++) {
      // Distribute stars in a sphere around the camera
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 50 + Math.random() * 100
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi) - 50 // Shift back
      
      // Star colors - white to blue
      const brightness = 0.5 + Math.random() * 0.5
      col[i * 3] = brightness
      col[i * 3 + 1] = brightness
      col[i * 3 + 2] = brightness * (0.8 + Math.random() * 0.2)
    }
    
    return { positions: pos, colors: col }
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.elapsedTime
      
      // Store original positions on first frame
      if (!originalPositionsRef.current) {
        originalPositionsRef.current = new Float32Array(positions)
      }
      
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array
      
      // Gravitational distortion based on distance to event horizon (bottom center)
      for (let i = 0; i < starCount; i++) {
        const ox = originalPositionsRef.current[i * 3]
        const oy = originalPositionsRef.current[i * 3 + 1]
        const oz = originalPositionsRef.current[i * 3 + 2]
        
        // Distance to event horizon center (0, -30, 0)
        const dx = ox
        const dy = oy + 30
        const dz = oz
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        
        // Gravitational pull - stars curve toward the horizon
        const pull = 300 / (dist * dist + 10)
        
        // Apply distortion as offset from original position (not accumulating)
        pos[i * 3] = ox - (dx / dist) * pull * 0.3
        pos[i * 3 + 1] = oy - (dy / dist) * pull * 0.3
        
        // Subtle twinkle
        const twinkle = Math.sin(time * 2 + i * 0.1) * 0.02
        pos[i * 3 + 2] = oz + twinkle
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true
      
      // Subtle rotation
      pointsRef.current.rotation.y = time * 0.01
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={starCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Photon Ring - hairline thin, extremely bright
function PhotonRing() {
  const ringRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (ringRef.current) {
      const time = state.clock.elapsedTime
      // Subtle pulse
      const scale = 1 + Math.sin(time * 2) * 0.02
      ringRef.current.scale.set(scale, scale, 1)
    }
  })

  return (
    <mesh ref={ringRef} position={[0, 0, 0.1]}>
      <ringGeometry args={[8.9, 9.1, 128]} />
      <meshBasicMaterial
        color="#FFD700"
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Main 3D Scene
function Scene({ isCrossing, mousePosition }: { isCrossing: boolean; mousePosition: { x: number; y: number } }) {
  const { camera } = useThree()
  const horizonRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (isCrossing) {
      // CROSSING ANIMATION: Camera dolly into singularity
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, -5, 0.05)
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, 0.05)
      
      // Horizon scales up as we approach
      if (horizonRef.current) {
        const scale = 1 + (10 - camera.position.z) * 0.3
        horizonRef.current.scale.set(scale, scale, scale)
      }
    } else {
      // Normal state: subtle parallax based on mouse
      const targetY = (mousePosition.y - 0.5) * 2
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05)
    }
  })

  return (
    <>
      {/* Star field with gravitational distortion */}
      <StarField mousePosition={mousePosition} />
      
      {/* Supermassive Event Horizon - 3x viewport scale, positioned at bottom */}
      <group ref={horizonRef} position={[0, -15, -20]} scale={[3, 3, 3]}>
        <CosmicEventHorizon />
        <PhotonRing />
      </group>
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.1} />
    </>
  )
}

export default function Entry() {
  const router = useRouter()
  const [isHoveringEnter, setIsHoveringEnter] = useState(false)
  const [isCrossing, setIsCrossing] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const overlayControls = useAnimation()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleEnter = async () => {
    setIsCrossing(true)
    
    // Cinematic crossing sequence
    // 0-0.3s: Button brightens
    await overlayControls.start({
      opacity: 1,
      scale: 1.1,
      transition: { duration: 0.3 }
    })
    
    // 0.3-1.2s: White flash and fade
    await overlayControls.start({
      opacity: 0,
      scale: 2,
      filter: 'brightness(3)',
      transition: { duration: 0.9 }
    })
    
    // Store crossing flag
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('fromEventHorizon', 'true')
    }
    
    // Navigate to Manifold
    router.push('/manifold/')
  }

  const containerStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: '#000',
  }

  const canvasContainerStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  }

  const overlayStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 10,
    pointerEvents: 'none',
  }

  const titleContainerStyle: CSSProperties = {
    position: 'absolute',
    top: '15%',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 20,
    textAlign: 'center',
    pointerEvents: 'none',
  }

  const titleStyle: CSSProperties = {
    fontSize: 'clamp(3rem, 12vw, 8rem)',
    fontWeight: 300,
    letterSpacing: '0.2em',
    textShadow: `
      0 0 80px rgba(255, 215, 0, 0.6),
      0 0 160px rgba(255, 215, 0, 0.3),
      0 4px 40px rgba(0, 0, 0, 0.8)
    `,
    color: '#FFD700',
    fontFamily: 'Cormorant Garamond, serif',
    margin: 0,
    lineHeight: 1,
  }

  const subtitleStyle: CSSProperties = {
    fontSize: 'clamp(0.75rem, 2vw, 1.25rem)',
    letterSpacing: '0.8em',
    textAlign: 'center',
    color: 'rgba(96, 165, 250, 0.7)',
    textShadow: '0 0 30px rgba(96, 165, 250, 0.4)',
    textTransform: 'uppercase',
    marginTop: '2rem',
    fontFamily: 'JetBrains Mono, monospace',
    fontWeight: 300,
  }

  const enterContainerStyle: CSSProperties = {
    position: 'absolute',
    bottom: '18%',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 30,
    pointerEvents: 'auto',
  }

  const enterButtonStyle: CSSProperties = {
    padding: '1.5rem 5rem',
    border: `2px solid ${isHoveringEnter ? 'rgba(255, 215, 0, 0.8)' : 'rgba(255, 215, 0, 0.4)'}`,
    background: isHoveringEnter 
      ? 'rgba(255, 215, 0, 0.15)'
      : 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    color: isHoveringEnter ? '#FFD700' : 'rgba(255, 215, 0, 0.9)',
    fontSize: 'clamp(1.25rem, 3vw, 2rem)',
    textTransform: 'uppercase',
    letterSpacing: '0.5em',
    paddingLeft: 'calc(0.5em + 5rem)',
    textShadow: isHoveringEnter
      ? '0 0 40px rgba(255, 215, 0, 1)'
      : '0 0 20px rgba(255, 215, 0, 0.6)',
    cursor: 'pointer',
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'JetBrains Mono, monospace',
    fontWeight: 600,
    boxShadow: isHoveringEnter
      ? '0 0 80px rgba(255, 215, 0, 0.8), inset 0 0 40px rgba(255, 215, 0, 0.2)'
      : '0 0 40px rgba(255, 215, 0, 0.4), inset 0 0 20px rgba(255, 215, 0, 0.1)',
    transform: isHoveringEnter ? 'scale(1.05) translateY(-4px)' : 'scale(1)',
    borderRadius: '2px',
  }

  const hintTextStyle: CSSProperties = {
    position: 'absolute',
    bottom: '8%',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: 'clamp(0.625rem, 1.2vw, 0.875rem)',
    color: 'rgba(255, 255, 255, 0.3)',
    fontFamily: 'JetBrains Mono, monospace',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    zIndex: 20,
    textAlign: 'center',
    pointerEvents: 'none',
  }

  return (
    <div style={containerStyle}>
      {/* WebGL Canvas with Event Horizon */}
      <div style={canvasContainerStyle}>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 75 }}
          gl={{ 
            antialias: false, 
            powerPreference: 'high-performance',
            alpha: false
          }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <Scene isCrossing={isCrossing} mousePosition={mousePosition} />
          </Suspense>
        </Canvas>
      </div>

      {/* White Flash Overlay for Crossing */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isCrossing ? { opacity: [0, 1, 0] } : { opacity: 0 }}
        transition={{ duration: 1.2, times: [0, 0.3, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 100,
          background: 'white',
          pointerEvents: 'none',
        }}
      />

      {/* HTML Overlay */}
      <motion.div style={overlayStyle} animate={overlayControls}>
        {/* Title */}
        <div style={titleContainerStyle}>
          <h1 style={titleStyle}>
            AEO TRIVECTOR
          </h1>
          <div style={subtitleStyle}>
            Attractor Architecture
          </div>
        </div>

        {/* ENTER Button */}
        <div style={enterContainerStyle}>
          <button
            onClick={handleEnter}
            onMouseEnter={() => setIsHoveringEnter(true)}
            onMouseLeave={() => setIsHoveringEnter(false)}
            style={enterButtonStyle}
            disabled={isCrossing}
          >
            ENTER
          </button>
        </div>

        {/* Hint Text */}
        <div style={hintTextStyle}>
          Cross the Event Horizon
        </div>
      </motion.div>
    </div>
  )
}
