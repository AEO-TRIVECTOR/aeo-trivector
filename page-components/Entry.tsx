'use client'

import { useRouter } from 'next/navigation'
import AccretionDisk from '@/components/accretion-disk-visualization'

export default function Entry() {
  const router = useRouter()

  const handleEnter = () => {
    router.push('/manifold/')
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#000'
    }}>
      {/* Black Hole Background - Full Viewport */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        zIndex: 0
      }}>
        <div style={{ width: '100%', height: '100%', minHeight: '100vh' }}>
          <AccretionDisk />
        </div>
      </div>

      {/* Title - Above Black Hole */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: 0,
        width: '100%',
        zIndex: 10,
        textAlign: 'center',
        padding: '0 1rem'
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 8vw, 5rem)',
          fontWeight: 300,
          letterSpacing: '0.2em',
          textAlign: 'center',
          textShadow: '0 0 40px rgba(255, 215, 0, 0.5)',
          color: '#FFD700',
          fontFamily: 'Cormorant Garamond, serif',
          margin: 0
        }}>
          AEO TRIVECTOR
        </h1>
      </div>

      {/* Centered Content - Over Black Hole */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 1rem',
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        {/* Subtitle */}
        <div style={{
          fontSize: 'clamp(0.75rem, 2vw, 1.25rem)',
          letterSpacing: '0.5em',
          textAlign: 'center',
          color: '#60A5FA',
          textShadow: '0 0 20px rgba(96, 165, 250, 0.5)',
          textTransform: 'uppercase',
          marginBottom: '3rem',
          width: '100%',
          fontFamily: 'system-ui, sans-serif'
        }}>
          Attractor Architecture
        </div>

        {/* Enter Button - No Border, Underline on Hover */}
        <button
          onClick={handleEnter}
          style={{
            padding: '1rem 3rem',
            border: 'none',
            borderBottom: '2px solid transparent',
            background: 'transparent',
            color: '#60A5FA',
            fontSize: '0.875rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginRight: '-0.3em',
            textShadow: '0 0 10px rgba(96, 165, 250, 0.5)',
            cursor: 'pointer',
            transition: 'border-color 0.3s',
            pointerEvents: 'auto',
            fontFamily: 'JetBrains Mono, monospace',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderBottomColor = '#60A5FA'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderBottomColor = 'transparent'
          }}
        >
          ENTER
        </button>
      </div>
    </div>
  )
}
