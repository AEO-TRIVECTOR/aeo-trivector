'use client'

import { useRouter } from 'next/navigation'
import AccretionDisk from '@/components/accretion-disk-visualization'

export default function Entry() {
  const router = useRouter()

  const handleEnter = () => {
    router.push('/manifold/')
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      {/* Black Hole Background */}
      <div className="absolute inset-0 z-0" style={{ width: '100%', height: '100%' }}>
        <AccretionDisk />
      </div>

      {/* Centered Content - Full Width */}
      <div 
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4"
        style={{ pointerEvents: 'none' }}
      >
        {/* Title */}
        <h1 
          style={{
            fontSize: 'clamp(2rem, 8vw, 5rem)',
            fontWeight: 300,
            letterSpacing: '0.2em',
            textAlign: 'center',
            textShadow: '0 0 40px rgba(255, 215, 0, 0.5)',
            color: '#FFD700',
            marginBottom: '1rem',
            width: '100%',
            fontFamily: 'Cormorant Garamond, serif'
          }}
        >
          AEO TRIVECTOR
        </h1>

        {/* Subtitle */}
        <div 
          style={{
            fontSize: 'clamp(0.75rem, 2vw, 1.25rem)',
            letterSpacing: '0.5em',
            textAlign: 'center',
            color: '#60A5FA',
            textShadow: '0 0 20px rgba(96, 165, 250, 0.5)',
            textTransform: 'uppercase',
            marginBottom: '3rem',
            width: '100%',
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          Attractor Architecture
        </div>

        {/* Enter Button */}
        <div style={{ width: '100%', textAlign: 'center' }}>
          <button
            onClick={handleEnter}
            style={{
            padding: '1rem 3rem',
            border: '2px solid #60A5FA',
            background: 'transparent',
            color: 'white',
            fontSize: '0.875rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            textShadow: '0 0 10px rgba(96, 165, 250, 0.5)',
            boxShadow: '0 0 20px rgba(96, 165, 250, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s',
            pointerEvents: 'auto',
            fontFamily: 'JetBrains Mono, monospace'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          ENTER
        </button>
        </div>
      </div>
    </div>
  )
}
