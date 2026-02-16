'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, type CSSProperties } from 'react'
import { motion, useAnimation } from 'framer-motion'
import AccretionDiskVisualization from '@/components/AccretionDiskVisualization'

export default function Entry() {
  const router = useRouter()
  const [isHoveringEnter, setIsHoveringEnter] = useState(false)
  const [isCrossing, setIsCrossing] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const overlayControls = useAnimation()

  // Track mouse position for gravitational effects
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

  // Calculate distance to horizon (horizon is at bottom center)
  const horizonX = 0.5
  const horizonY = 1.0 // Bottom of screen
  const distanceToHorizon = Math.sqrt(
    Math.pow(mousePosition.x - horizonX, 2) + Math.pow(mousePosition.y - horizonY, 2)
  )

  // Time dilation factor (slower near horizon)
  const timeDilation = Math.max(0.3, distanceToHorizon)

  const handleEnter = async () => {
    setIsCrossing(true)
    
    // Ring flare + inward pull (120ms)
    await new Promise(resolve => setTimeout(resolve, 120))
    
    // Store crossing flag
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('fromEventHorizon', 'true')
    }
    
    // Quick cut to Manifold (inevitable, not polite)
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
    // Time dilation affects background animation speed
    filter: `brightness(${0.8 + timeDilation * 0.2})`,
    transition: 'filter 0.3s ease-out',
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
    transform: `translateX(-50%) scale(${1 + (1 - timeDilation) * 0.05})`, // Subtle scale near horizon
    zIndex: 20,
    textAlign: 'center',
    pointerEvents: 'none',
    transition: 'transform 0.3s ease-out',
  }

  const titleStyle: CSSProperties = {
    fontSize: 'clamp(2.5rem, 8vw, 6rem)',
    fontWeight: 300,
    color: '#FFD700',
    fontFamily: 'Cormorant Garamond, serif',
    letterSpacing: `${0.3 + (1 - timeDilation) * 0.1}em`, // Letter-spacing warps near horizon
    textTransform: 'uppercase',
    margin: 0,
    textShadow: `
      0 0 ${20 + (1 - timeDilation) * 20}px rgba(255, 215, 0, 0.8),
      0 0 40px rgba(255, 215, 0, 0.6),
      0 0 60px rgba(255, 215, 0, 0.4),
      0 0 80px rgba(255, 215, 0, 0.2)
    `,
    transition: 'letter-spacing 0.3s ease-out, text-shadow 0.3s ease-out',
  }

  const subtitleStyle: CSSProperties = {
    fontSize: 'clamp(0.75rem, 1.5vw, 1.25rem)', // Smaller and quieter
    fontWeight: 300,
    color: '#60A5FA',
    fontFamily: 'JetBrains Mono, monospace',
    letterSpacing: '0.5em',
    textTransform: 'uppercase',
    marginTop: '1.5rem',
    textShadow: '0 0 20px rgba(96, 165, 250, 0.6)',
    opacity: isHoveringEnter ? 0.3 : 0.7, // Dims when hovering ENTER
    transition: 'opacity 0.6s ease-out',
  }

  const enterContainerStyle: CSSProperties = {
    position: 'absolute',
    bottom: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 20,
    pointerEvents: 'auto',
  }

  const enterButtonStyle: CSSProperties = {
    padding: '1.5rem 5rem',
    border: isHoveringEnter
      ? '2px solid rgba(255, 215, 0, 1)'
      : '2px solid rgba(255, 215, 0, 0.5)',
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
    opacity: 0,
    animation: 'fadeInHint 1s ease-out 2s forwards', // Appears after 2s
  }

  // Photon ring breathing animation
  const photonRingStyle: CSSProperties = {
    position: 'absolute',
    bottom: '-50vh', // Positioned so only top arc is visible (supermassive scale)
    left: '50%',
    transform: 'translateX(-50%)',
    width: '300vw', // 3× viewport (supermassive)
    height: '300vw',
    borderRadius: '50%',
    border: `2px solid ${isHoveringEnter ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 215, 0, 0.9)'}`, // Hairline bright
    boxShadow: isHoveringEnter
      ? `
        0 0 40px rgba(255, 215, 0, 1),
        0 0 80px rgba(255, 215, 0, 0.8),
        inset 0 0 40px rgba(255, 215, 0, 0.6)
      ` // Ring flare on hover
      : `
        0 0 20px rgba(255, 215, 0, 0.8),
        0 0 40px rgba(255, 215, 0, 0.6),
        inset 0 0 20px rgba(255, 215, 0, 0.4)
      `,
    pointerEvents: 'none',
    zIndex: 15,
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: 'photonBreath 8s ease-in-out infinite',
  }

  // Vignette that tightens on crossing
  const vignetteStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: isCrossing
      ? 'radial-gradient(circle at 50% 100%, transparent 0%, black 40%)'
      : isHoveringEnter
      ? 'radial-gradient(circle at 50% 100%, transparent 30%, rgba(0,0,0,0.6) 100%)'
      : 'radial-gradient(circle at 50% 100%, transparent 40%, rgba(0,0,0,0.3) 100%)',
    zIndex: 12,
    pointerEvents: 'none',
    transition: 'background 0.6s ease-out',
  }

  return (
    <div style={containerStyle}>
      {/* Inline keyframe animations */}
      <style>{`
        @keyframes fadeInHint {
          to { opacity: 1; }
        }
        @keyframes photonBreath {
          0%, 100% { 
            opacity: 0.8; 
            filter: blur(0px);
          }
          50% { 
            opacity: 1; 
            filter: blur(1px);
          }
        }
      `}</style>

      {/* WebGL Accretion Disk Visualization (Full Screen) */}
      <div style={canvasContainerStyle}>
        <AccretionDiskVisualization />
      </div>

      {/* Photon Ring (Hairline Bright) */}
      <div style={photonRingStyle} />

      {/* Vignette (Tightens on hover/crossing) */}
      <div style={vignetteStyle} />

      {/* White Flash + Radial Blur for Crossing */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isCrossing ? { 
          opacity: [0, 1, 0],
          scale: [1, 1.2, 1.5],
          filter: ['blur(0px)', 'blur(10px)', 'blur(20px)']
        } : { opacity: 0 }}
        transition={{ duration: 0.4, times: [0, 0.3, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 100,
          background: 'radial-gradient(circle at 50% 100%, white, transparent 60%)',
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

        {/* Hint Text (Fades in after 2s) */}
        <div style={hintTextStyle}>
          Cross the Event Horizon
        </div>
      </motion.div>
    </div>
  )
}
