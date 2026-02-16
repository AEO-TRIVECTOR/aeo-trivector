'use client'

import { useRef, useState, useEffect, type ReactNode, type MutableRefObject, type CSSProperties } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Attractor } from '@/components/Attractor'
import { useReducedMotion } from 'framer-motion'
import StickyGlassHeader from '@/components/StickyGlassHeader'
import Footer from '@/components/Footer'
import * as THREE from 'three'

// 3D Attractor Group with mouse tracking
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

interface ScenePageShellProps {
  children: ReactNode
  particleCount?: number
  showHeader?: boolean
  showFooter?: boolean
  headerStyle?: 'sticky' | 'fixed' | 'none'
  customHeader?: ReactNode
}

export default function ScenePageShell({
  children,
  particleCount = 8000,
  showHeader = true,
  showFooter = true,
  headerStyle = 'sticky',
  customHeader,
}: ScenePageShellProps) {
  const reduceMotion = useReducedMotion() || false
  const [isWebGLSupported, setIsWebGLSupported] = useState(true)
  const [isTabVisible, setIsTabVisible] = useState(true)
  const mousePositionRef = useRef({ x: 0, y: 0 })

  // WebGL support detection
  useEffect(() => {
    if (typeof window === 'undefined') return
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl')
    setIsWebGLSupported(Boolean(context))
  }, [])

  // Tab visibility tracking (pause animation when hidden)
  useEffect(() => {
    if (typeof document === 'undefined') return
    const handleVisibility = () => setIsTabVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  // Throttled mouse tracking with rAF (Manifold's best-practice pattern)
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

  const containerStyle: CSSProperties = {
    position: 'relative',
    minHeight: '100vh',
    overflow: 'hidden',
  }

  const canvasContainerStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none',
  }

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 5,
    pointerEvents: 'none',
    background: 'rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(0px)',
  }

  const contentWrapperStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  }

  return (
    <div style={containerStyle}>
      {/* WebGL Canvas Background */}
      {isWebGLSupported && (
        <>
          <div style={canvasContainerStyle}>
            <Canvas
              camera={{ position: [0, 0, 12], fov: 75 }}
              gl={{
                antialias: false,
                powerPreference: 'high-performance',
                alpha: true,
              }}
              dpr={[1, 1.5]}
            >
              <AttractorGroup
                mousePositionRef={mousePositionRef}
                reduceMotion={reduceMotion}
                isTabVisible={isTabVisible}
                particleCount={particleCount}
              />
              <ambientLight intensity={0.2} />
            </Canvas>
          </div>

          {/* Overlay for backdrop-filter to work over WebGL */}
          <div style={overlayStyle} />
        </>
      )}

      {/* Content Wrapper */}
      <div style={contentWrapperStyle}>
        {/* Header */}
        {showHeader && headerStyle !== 'none' && (
          customHeader || <StickyGlassHeader />
        )}

        {/* Page Content */}
        <main style={{ flex: 1, position: 'relative', zIndex: 10 }}>
          {children}
        </main>

        {/* Footer */}
        {showFooter && <Footer />}
      </div>
    </div>
  )
}
