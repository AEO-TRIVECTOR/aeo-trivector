'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, type CSSProperties } from 'react'
import AccretionDisk from '@/components/accretion-disk-visualization'

export default function Entry() {
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const [isHoveringEnter, setIsHoveringEnter] = useState(false)

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

  const handleEnter = () => {
    // Store flag for ghost horizon effect on Manifold page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('fromEventHorizon', 'true')
    }
    router.push('/manifold/')
  }

  // Parallax offset based on mouse position
  const parallaxX = (mousePosition.x - 0.5) * 30
  const parallaxY = (mousePosition.y - 0.5) * 30

  const containerStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: '#000',
  }

  const backgroundStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    zIndex: 0,
    transform: `translate(${parallaxX * 0.3}px, ${parallaxY * 0.3}px)`,
    transition: 'transform 0.3s ease-out',
  }

  // Massive event horizon circle - off-center, dramatic
  const eventHorizonStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    right: '-15%', // Positioned to the right, partially off-screen
    transform: 'translate(0, -50%)',
    width: 'min(120vh, 120vw)',
    height: 'min(120vh, 120vw)',
    borderRadius: '50%',
    border: '2px solid rgba(255, 215, 0, 0.3)',
    boxShadow: `
      0 0 100px rgba(255, 215, 0, 0.4),
      inset 0 0 100px rgba(255, 215, 0, 0.2),
      0 0 200px rgba(96, 165, 250, 0.3)
    `,
    zIndex: 5,
    pointerEvents: 'none',
  }

  // Inner horizon rings
  const innerRing1Style: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    height: '70%',
    borderRadius: '50%',
    border: '1px solid rgba(255, 215, 0, 0.15)',
    boxShadow: 'inset 0 0 50px rgba(255, 215, 0, 0.1)',
  }

  const innerRing2Style: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    height: '40%',
    borderRadius: '50%',
    border: '1px solid rgba(255, 215, 0, 0.1)',
    boxShadow: 'inset 0 0 30px rgba(255, 215, 0, 0.15)',
  }

  // Title positioned in the upper left - asymmetric
  const titleContainerStyle: CSSProperties = {
    position: 'absolute',
    top: '12%',
    left: '8%',
    zIndex: 20,
    transform: `translate(${parallaxX * 0.5}px, ${parallaxY * 0.5}px)`,
    transition: 'transform 0.3s ease-out',
  }

  const titleStyle: CSSProperties = {
    fontSize: 'clamp(2.5rem, 10vw, 7rem)',
    fontWeight: 300,
    letterSpacing: '0.15em',
    textShadow: `
      0 0 60px rgba(255, 215, 0, 0.6),
      0 0 120px rgba(255, 215, 0, 0.3),
      0 4px 40px rgba(0, 0, 0, 0.8)
    `,
    color: '#FFD700',
    fontFamily: 'Cormorant Garamond, serif',
    margin: 0,
    lineHeight: 1.1,
  }

  const subtitleStyle: CSSProperties = {
    fontSize: 'clamp(0.875rem, 2.5vw, 1.5rem)',
    letterSpacing: '0.5em',
    textAlign: 'left',
    color: '#60A5FA',
    textShadow: '0 0 30px rgba(96, 165, 250, 0.6)',
    textTransform: 'uppercase',
    marginTop: '1.5rem',
    fontFamily: 'JetBrains Mono, monospace',
    fontWeight: 300,
  }

  // ENTER button at the edge of the event horizon - literally at the threshold
  const enterContainerStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    right: '20%', // Positioned at the visible edge of the horizon
    transform: `translate(0, -50%) translate(${parallaxX * 0.8}px, ${parallaxY * 0.8}px)`,
    transition: 'transform 0.3s ease-out',
    zIndex: 30,
  }

  const enterButtonStyle: CSSProperties = {
    padding: '1.5rem 4rem',
    border: '2px solid rgba(255, 215, 0, 0.4)',
    background: isHoveringEnter 
      ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(96, 165, 250, 0.15))'
      : 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    color: isHoveringEnter ? '#FFD700' : '#60A5FA',
    fontSize: 'clamp(1rem, 2vw, 1.5rem)',
    textTransform: 'uppercase',
    letterSpacing: '0.3em',
    textShadow: isHoveringEnter
      ? '0 0 30px rgba(255, 215, 0, 0.8)'
      : '0 0 20px rgba(96, 165, 250, 0.6)',
    cursor: 'pointer',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'JetBrains Mono, monospace',
    fontWeight: 600,
    boxShadow: isHoveringEnter
      ? '0 0 60px rgba(255, 215, 0, 0.5), inset 0 0 30px rgba(255, 215, 0, 0.2)'
      : '0 0 30px rgba(96, 165, 250, 0.3), inset 0 0 20px rgba(96, 165, 250, 0.1)',
    transform: isHoveringEnter ? 'scale(1.05)' : 'scale(1)',
    borderRadius: '4px',
  }

  // Gravitational distortion hint text
  const hintTextStyle: CSSProperties = {
    position: 'absolute',
    bottom: '10%',
    left: '8%',
    fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: 'JetBrains Mono, monospace',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    zIndex: 20,
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
  }

  return (
    <div style={containerStyle}>
      {/* Accretion Disk Background with parallax */}
      <div style={backgroundStyle}>
        <div style={{ width: '100%', height: '100%', minHeight: '100vh' }}>
          <AccretionDisk />
        </div>
      </div>

      {/* Massive Event Horizon Circle */}
      <div style={eventHorizonStyle}>
        <div style={innerRing1Style} />
        <div style={innerRing2Style} />
      </div>

      {/* Title - Upper Left, Asymmetric */}
      <div style={titleContainerStyle}>
        <h1 style={titleStyle}>
          AEO<br />TRIVECTOR
        </h1>
        <div style={subtitleStyle}>
          Attractor Architecture
        </div>
      </div>

      {/* ENTER Button - At the Event Horizon Edge */}
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

      {/* Hint Text - Lower Left */}
      <div style={hintTextStyle}>
        Standing at the precipice
      </div>
    </div>
  )
}
