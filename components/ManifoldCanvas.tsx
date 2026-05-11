'use client'

import { useRef, useState, useEffect, useMemo, type MutableRefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Attractor } from '@/components/Attractor'
import { motion, useReducedMotion } from 'framer-motion'
import * as THREE from 'three'

// ── Attractor Group ──────────────────────────────────────────────────────────
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
      <Attractor count={particleCount} opacity={0.42} speed={1} />
    </group>
  )
}

// ── Main canvas component ────────────────────────────────────────────────────
export default function ManifoldCanvas() {
  const reduceMotion = useReducedMotion() || false
  const [isWebGLSupported, setIsWebGLSupported] = useState(true)
  const [isTabVisible, setIsTabVisible] = useState(true)
  const [showGhostHorizon, setShowGhostHorizon] = useState(false)
  const mousePositionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl')
    setIsWebGLSupported(Boolean(context))
  }, [])

  useEffect(() => {
    const handleVisibility = () => setIsTabVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  useEffect(() => {
    const fromEventHorizon = sessionStorage.getItem('fromEventHorizon') === 'true'
    if (fromEventHorizon) {
      setShowGhostHorizon(true)
      const timer = setTimeout(() => {
        setShowGhostHorizon(false)
        sessionStorage.removeItem('fromEventHorizon')
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
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

  const particleCount = useMemo(() => {
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches
    const cpuThreads = navigator.hardwareConcurrency || 4
    if (reduceMotion) return 4000
    if (isCoarsePointer || cpuThreads <= 4) return 8000
    return 22000
  }, [reduceMotion])

  return (
    <>
      {/* Lorenz Attractor Background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
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
              textShadow: '0 2px 8px rgba(0,0,0,0.9)',
            }}
          >
            3D visualization unavailable on this device.
          </div>
        )}
      </div>

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
          aria-hidden="true"
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
    </>
  )
}
