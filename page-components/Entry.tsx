'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AccretionDisk from '@/components/accretion-disk-visualization'

export default function Entry() {
  const router = useRouter()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Simple fade-in after component mounts
    const timer = setTimeout(() => setVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleEnter = () => {
    router.push('/manifold/')
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Black Hole Background */}
      <div className="absolute inset-0 z-0">
        <AccretionDisk />
      </div>

      {/* Centered Content */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 1s ease-in-out'
        }}
      >
        {/* Title */}
        <h1 
          className="font-serif text-white mb-4"
          style={{
            fontSize: 'clamp(2rem, 8vw, 5rem)',
            fontWeight: 300,
            letterSpacing: '0.2em',
            textAlign: 'center',
            textShadow: '0 0 40px rgba(255, 215, 0, 0.5)',
            color: '#FFD700'
          }}
        >
          AEO TRIVECTOR
        </h1>

        {/* Subtitle */}
        <div 
          className="font-sans uppercase mb-12"
          style={{
            fontSize: 'clamp(0.75rem, 2vw, 1.25rem)',
            letterSpacing: '0.5em',
            textAlign: 'center',
            color: '#60A5FA',
            textShadow: '0 0 20px rgba(96, 165, 250, 0.5)'
          }}
        >
          Attractor Architecture
        </div>

        {/* Enter Button */}
        <button
          onClick={handleEnter}
          className="px-12 py-4 border-2 text-white font-mono uppercase tracking-widest transition-all duration-300 hover:bg-white/10 pointer-events-auto"
          style={{
            borderColor: '#60A5FA',
            fontSize: '0.875rem',
            letterSpacing: '0.3em',
            textShadow: '0 0 10px rgba(96, 165, 250, 0.5)',
            boxShadow: '0 0 20px rgba(96, 165, 250, 0.3)'
          }}
        >
          ENTER
        </button>
      </div>
    </div>
  )
}
