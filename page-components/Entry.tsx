'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, type CSSProperties } from 'react'
import { motion, useAnimation } from 'framer-motion'
import AccretionDiskVisualization from '@/components/AccretionDiskVisualization'

export default function Entry() {
  const router = useRouter()
  const [isHoveringEnter, setIsHoveringEnter] = useState(false)
  const [isCrossing, setIsCrossing] = useState(false)
  const overlayControls = useAnimation()

  const handleEnter = async () => {
    setIsCrossing(true)
    
    // Cinematic crossing sequence with white flash
    await new Promise(resolve => setTimeout(resolve, 300))
    
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
    fontSize: 'clamp(2.5rem, 8vw, 6rem)',
    fontWeight: 300,
    color: '#FFD700',
    fontFamily: 'Cormorant Garamond, serif',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    margin: 0,
    textShadow: `
      0 0 20px rgba(255, 215, 0, 0.8),
      0 0 40px rgba(255, 215, 0, 0.6),
      0 0 60px rgba(255, 215, 0, 0.4),
      0 0 80px rgba(255, 215, 0, 0.2)
    `,
  }

  const subtitleStyle: CSSProperties = {
    fontSize: 'clamp(0.875rem, 2vw, 1.5rem)',
    fontWeight: 300,
    color: '#60A5FA',
    fontFamily: 'JetBrains Mono, monospace',
    letterSpacing: '0.5em',
    textTransform: 'uppercase',
    marginTop: '1rem',
    textShadow: '0 0 20px rgba(96, 165, 250, 0.6)',
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
  }

  return (
    <div style={containerStyle}>
      {/* WebGL Accretion Disk Visualization (Full Screen) */}
      <div style={canvasContainerStyle}>
        <AccretionDiskVisualization />
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
