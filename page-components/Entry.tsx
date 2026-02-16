'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, type CSSProperties } from 'react'

export default function Entry() {
  const router = useRouter()
  const [isHoveringEnter, setIsHoveringEnter] = useState(false)
  const [mouseY, setMouseY] = useState(0.5)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY / window.innerHeight)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleEnter = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('fromEventHorizon', 'true')
    }
    router.push('/manifold/')
  }

  // Subtle parallax on the horizon based on vertical mouse position
  const horizonOffset = (mouseY - 0.5) * 20

  const containerStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 70%)',
  }

  // Massive event horizon - simple, clean, dominating
  const horizonStyle: CSSProperties = {
    position: 'absolute',
    bottom: `calc(-40vh + ${horizonOffset}px)`,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '200vw',
    height: '200vw',
    maxWidth: '200vh',
    maxHeight: '200vh',
    borderRadius: '50%',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    boxShadow: `
      0 0 150px rgba(255, 215, 0, 0.4),
      inset 0 0 150px rgba(255, 215, 0, 0.15),
      0 0 300px rgba(96, 165, 250, 0.2)
    `,
    transition: 'bottom 0.3s ease-out',
    pointerEvents: 'none',
  }

  // Inner glow ring
  const innerGlowStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    height: '85%',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  }

  // Title - upper center, floating above the void
  const titleContainerStyle: CSSProperties = {
    position: 'absolute',
    top: '15%',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 20,
    textAlign: 'center',
  }

  const titleStyle: CSSProperties = {
    fontSize: 'clamp(3rem, 12vw, 8rem)',
    fontWeight: 300,
    letterSpacing: '0.2em',
    textShadow: `
      0 0 80px rgba(255, 215, 0, 0.5),
      0 0 160px rgba(255, 215, 0, 0.2)
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

  // ENTER button - positioned at the edge, where the horizon meets the void
  const enterContainerStyle: CSSProperties = {
    position: 'absolute',
    bottom: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 30,
  }

  const enterButtonStyle: CSSProperties = {
    padding: '1.5rem 5rem',
    border: `2px solid ${isHoveringEnter ? 'rgba(255, 215, 0, 0.6)' : 'rgba(255, 215, 0, 0.3)'}`,
    background: isHoveringEnter 
      ? 'rgba(255, 215, 0, 0.1)'
      : 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    color: isHoveringEnter ? '#FFD700' : 'rgba(255, 215, 0, 0.8)',
    fontSize: 'clamp(1.25rem, 3vw, 2rem)',
    textTransform: 'uppercase',
    letterSpacing: '0.5em',
    paddingLeft: 'calc(0.5em + 5rem)',
    textShadow: isHoveringEnter
      ? '0 0 40px rgba(255, 215, 0, 0.8)'
      : '0 0 20px rgba(255, 215, 0, 0.4)',
    cursor: 'pointer',
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'JetBrains Mono, monospace',
    fontWeight: 600,
    boxShadow: isHoveringEnter
      ? '0 0 80px rgba(255, 215, 0, 0.6), inset 0 0 40px rgba(255, 215, 0, 0.15)'
      : '0 0 40px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.05)',
    transform: isHoveringEnter ? 'scale(1.05) translateY(-4px)' : 'scale(1)',
    borderRadius: '2px',
  }

  // Minimal hint text
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
  }

  // Subtle stars/particles in the void
  const starsStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '60%',
    background: `
      radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, 0.3), transparent),
      radial-gradient(2px 2px at 60% 70%, rgba(255, 255, 255, 0.2), transparent),
      radial-gradient(1px 1px at 50% 50%, rgba(255, 255, 255, 0.4), transparent),
      radial-gradient(1px 1px at 80% 10%, rgba(255, 255, 255, 0.3), transparent),
      radial-gradient(2px 2px at 90% 60%, rgba(255, 255, 255, 0.2), transparent),
      radial-gradient(1px 1px at 33% 80%, rgba(255, 255, 255, 0.3), transparent),
      radial-gradient(1px 1px at 15% 90%, rgba(255, 255, 255, 0.2), transparent)
    `,
    backgroundSize: '200% 200%',
    backgroundPosition: '50% 50%',
    pointerEvents: 'none',
  }

  return (
    <div style={containerStyle}>
      {/* Subtle stars in the void */}
      <div style={starsStyle} />

      {/* Massive Event Horizon */}
      <div style={horizonStyle}>
        <div style={innerGlowStyle} />
      </div>

      {/* Title - Floating Above */}
      <div style={titleContainerStyle}>
        <h1 style={titleStyle}>
          AEO TRIVECTOR
        </h1>
        <div style={subtitleStyle}>
          Attractor Architecture
        </div>
      </div>

      {/* ENTER Button - At the Threshold */}
      <div style={enterContainerStyle}>
        <button
          onClick={handleEnter}
          onMouseEnter={() => setIsHoveringEnter(true)}
          onMouseLeave={() => setIsHoveringEnter(false)}
          style={enterButtonStyle}
        >
          ENTER
        </button>
      </div>

      {/* Hint Text */}
      <div style={hintTextStyle}>
        Cross the Event Horizon
      </div>
    </div>
  )
}
