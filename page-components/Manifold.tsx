'use client'


import { useRef, useState, useEffect, useMemo, type CSSProperties, type MutableRefObject } from 'react'
import Link from 'next/link'
import { Canvas, useFrame } from '@react-three/fiber'
import { Attractor } from '@/components/Attractor'
import { motion, useReducedMotion } from 'framer-motion'
import Footer from '@/components/Footer'
import * as THREE from 'three'

// 3D Group component for Attractor animation
function AttractorGroup({
  mousePositionRef,
  reduceMotion,
  isTabVisible,
  particleCount,
}: {
  mousePositionRef: MutableRefObject<{ x: number; y: number }>
  reduceMotion: boolean
  isTabVisible: boolean
  particleCount: number
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      if (reduceMotion || !isTabVisible) {
        groupRef.current.rotation.y = 0
        groupRef.current.scale.set(1, 1, 1)
        return
      }

      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
      groupRef.current.scale.set(scale, scale, scale)

      const targetRotationX = mousePositionRef.current.y * 0.1
      const targetRotationZ = mousePositionRef.current.x * 0.1
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05
      groupRef.current.rotation.z += (targetRotationZ - groupRef.current.rotation.z) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      <Attractor count={particleCount} opacity={0.85} speed={1} />
    </group>
  )
}

interface PillarProps {
  icon: string
  title: string
  descriptor: string
  delay: number
  reduceMotion: boolean
}

function Pillar({ icon, title, descriptor, delay, reduceMotion }: PillarProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className="relative group"
      tabIndex={0}
      aria-label={`${title}: ${descriptor}`}
    >
      <div
        className="relative rounded-2xl p-12 transition-all duration-700 ease-out"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: isHovered
            ? '0 0 40px rgba(255, 215, 0, 0.3), inset 0 0 60px rgba(255, 215, 0, 0.1)'
            : '0 0 20px rgba(255, 215, 0, 0.15), inset 0 0 30px rgba(255, 215, 0, 0.05)',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        }}
      >
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-tr-2xl pointer-events-none transition-opacity duration-700"
          style={{
            background: 'radial-gradient(circle at top right, rgba(255, 215, 0, 0.2), transparent 70%)',
            opacity: isHovered ? 1 : 0.6,
          }}
        />

        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={
            reduceMotion
              ? undefined
              : {
                  background: [
                    'linear-gradient(135deg, transparent 0%, rgba(255, 215, 0, 0.03) 50%, transparent 100%)',
                    'linear-gradient(135deg, transparent 30%, rgba(255, 215, 0, 0.05) 70%, transparent 100%)',
                    'linear-gradient(135deg, transparent 0%, rgba(255, 215, 0, 0.03) 50%, transparent 100%)',
                  ],
                }
          }
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className="relative flex flex-col items-center space-y-6" style={{ textAlign: 'center', width: '100%' }}>
          <motion.div
            className="text-5xl"
            animate={{
              rotate: isHovered && !reduceMotion ? 5 : 0,
            }}
            transition={{ duration: 0.5 }}
            style={{
              color: '#FFD700',
              filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))',
              textShadow: '0 2px 12px rgba(0,0,0,0.9)',
            }}
          >
            {icon}
          </motion.div>

          <h3
            className="font-serif text-2xl tracking-wider uppercase"
            style={{
              color: 'rgba(255, 255, 255, 0.95)',
              letterSpacing: '0.15em',
              fontWeight: 400,
              textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 4px 24px rgba(0,0,0,0.7)',
            }}
          >
            {title}
          </h3>

          <motion.p
            className="text-base leading-relaxed max-w-xs"
            animate={{
              opacity: isHovered ? 1 : 0.7,
            }}
            transition={{ duration: 0.5 }}
            style={{
              color: 'rgba(209, 213, 219, 0.9)',
              textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.7)',
            }}
          >
            {descriptor}
          </motion.p>
        </div>
      </div>
    </motion.div>
  )
}

const interactiveLinkStyle: CSSProperties = {
  position: 'relative',
  paddingBottom: '0.25rem',
  paddingTop: '0.5rem',
  paddingLeft: '0.5rem',
  paddingRight: '0.5rem',
  borderBottom: '1px solid rgba(59, 130, 246, 0.5)',
  color: 'rgba(255, 255, 255, 0.7)',
  transition: 'all 0.3s',
  textDecoration: 'none',
}

export default function Manifold() {
  const reduceMotion = useReducedMotion() || false
  const [isWebGLSupported, setIsWebGLSupported] = useState(true)
  const [isTabVisible, setIsTabVisible] = useState(true)

  const fromEventHorizon = typeof window !== 'undefined' && sessionStorage.getItem('fromEventHorizon') === 'true'
  const [showGhostHorizon, setShowGhostHorizon] = useState(fromEventHorizon)

  const mousePositionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl')
    setIsWebGLSupported(Boolean(context))
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const handleVisibility = () => setIsTabVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  useEffect(() => {
    if (fromEventHorizon) {
      const timer = setTimeout(() => {
        setShowGhostHorizon(false)
        sessionStorage.removeItem('fromEventHorizon')
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [fromEventHorizon])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const pointerQuery = window.matchMedia('(pointer: fine)')
    if (!pointerQuery.matches) return

    let rafId: number | null = null
    let latestX = 0
    let latestY = 0

    const updateMouseRef = () => {
      mousePositionRef.current = {
        x: (latestX / window.innerWidth) * 2 - 1,
        y: -(latestY / window.innerHeight) * 2 + 1,
      }
      rafId = null
    }

    const handlePointerMove = (e: PointerEvent) => {
      latestX = e.clientX
      latestY = e.clientY
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateMouseRef)
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      if (rafId !== null) window.cancelAnimationFrame(rafId)
    }
  }, [])

  const pillars = useMemo(
    () => [
      { icon: '△', title: 'Structure', descriptor: 'Topology is the invariant substrate; implementations may deform, the core does not. Stability is identity preserved under morphism.' },
      { icon: '◯', title: 'Dynamics', descriptor: 'Vector fields evolve state through phase space; attractors compress possibility into trajectory. What converges is what survives iteration.' },
      { icon: '◇', title: 'Integration', descriptor: 'Resonance synthesizes disparate representations into one operational geometry. The nexus is where models collapse into a coherent whole.' },
    ],
    []
  )

  const particleCount = useMemo(() => {
    if (typeof window === 'undefined') return 10000
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches
    const cpuThreads = navigator.hardwareConcurrency || 4
    if (reduceMotion) return 4000
    if (isCoarsePointer || cpuThreads <= 4) return 8000
    return 25000
  }, [reduceMotion])

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#000', overflow: 'hidden' }}>
      {/* Lorenz Attractor Background - Fixed Full Viewport */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
        }}
      >
        {isWebGLSupported ? (
          <Canvas
            camera={{ position: [0, 0, 12], fov: 75 }}
            dpr={[1, 1.5]}
            gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
          >
            <AttractorGroup
              mousePositionRef={mousePositionRef}
              reduceMotion={reduceMotion}
              isTabVisible={isTabVisible}
              particleCount={particleCount}
            />
          </Canvas>
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.8)',
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.05em',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            3D visualization unavailable on this device.
          </div>
        )}
      </div>

      {/* Overlay layer for backdrop-filter to work with WebGL */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 5,
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, rgba(59,130,246,0.01) 50%, transparent 100%)',
          pointerEvents: 'none'
        }}
      />

      {/* Ghost Horizon Effect */}
      {showGhostHorizon && (
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.6 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '24rem',
              height: '24rem',
              borderRadius: '50%',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 0 100px rgba(255, 255, 255, 0.3), inset 0 0 100px rgba(255, 255, 255, 0.1)',
            }}
          />
        </motion.div>
      )}

      {/* Fixed Navigation Header */}
      <nav
        aria-label="Primary"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <Link href="/">
          <span
            style={{
              fontSize: '1.25rem',
              fontFamily: 'Cormorant Garamond, serif',
              letterSpacing: '0.05em',
              fontWeight: 700,
              cursor: 'pointer',
              color: 'rgba(255, 215, 0, 0.9)',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
              transition: 'color 0.5s',
            }}
          >
            AEO TRIVECTOR
          </span>
        </Link>
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            opacity: 0.7,
          }}
        >
          <Link
            href="/manifold"
            aria-current="page"
            style={{
              ...interactiveLinkStyle,
              borderBottom: '1px solid #FFD700',
              color: '#FFD700',
            }}
          >
            VISION
          </Link>
          <Link href="/research" style={interactiveLinkStyle}>
            RESEARCH
          </Link>
          <Link href="/about" style={interactiveLinkStyle}>
            ABOUT
          </Link>
          <Link href="/contact" style={interactiveLinkStyle}>
            CONTACT
          </Link>
        </div>
      </nav>

      {/* Scrollable Content - uses normal document flow */}
      <div style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
        {/* Title Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 1.5rem',
            paddingTop: '20vh',
            paddingBottom: '4rem',
          }}
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <h1
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(3rem, 10vw, 6rem)',
                letterSpacing: '0.1em',
                color: 'rgba(255, 255, 255, 0.95)',
                textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 8px 40px rgba(0,0,0,0.7)',
                fontWeight: 300,
                textAlign: 'center',
                margin: 0,
              }}
            >
              AEO TRIVECTOR
            </h1>
            <motion.p
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'rgba(255, 215, 0, 0.8)',
                textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                textAlign: 'center',
                marginTop: '1rem',
              }}
            >
              Attractor Architecture
            </motion.p>
          </motion.div>
        </div>

        {/* Three Pillars */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '0 1.5rem',
            paddingBottom: '6rem',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              width: '100%',
              maxWidth: '80rem',
              pointerEvents: 'auto',
            }}
          >
            {pillars.map((pillar, index) => (
              <Pillar
                key={pillar.title}
                icon={pillar.icon}
                title={pillar.title}
                descriptor={pillar.descriptor}
                delay={0.5 + index * 0.2}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ pointerEvents: 'auto' }}>
          <Footer />
        </div>
      </div>
    </div>
  )
}
