'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import AccretionDisk from '@/components/accretion-disk-visualization'

export default function Entry() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [approaching, setApproaching] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)
    }

    // Show content after brief delay
    const timer = setTimeout(() => setReady(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  const handleEnter = () => {
    if (prefersReducedMotion) {
      router.push('/manifold/')
      return
    }

    setApproaching(true)
    setTimeout(() => {
      router.push('/manifold/')
    }, 4000)
  }

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-[#030712]"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Accretion Disk Background - Full Screen */}
      <div className="absolute inset-0 z-0">
        <AccretionDisk />
      </div>

      {/* Darkness Overlay for Approaching Animation */}
      <AnimatePresence>
        {approaching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 4, ease: "easeIn" }}
            className="absolute inset-0 bg-black z-20"
          />
        )}
      </AnimatePresence>

      {/* Navigation - Top */}
      <nav className="absolute top-0 left-0 right-0 z-30 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div className="text-[#FFD700] font-serif text-lg md:text-xl tracking-wider" style={{textShadow: '0 0 20px rgba(255, 215, 0, 0.5)'}}>
            AEO TRIVECTOR
          </div>
          <div className="flex gap-6 md:gap-8 text-sm md:text-base">
            <a href="/manifold/" className="text-gray-400 hover:text-[#FFD700] transition-colors" style={{letterSpacing: '0.1em'}}>VISION</a>
            <a href="/research/" className="text-gray-400 hover:text-[#FFD700] transition-colors" style={{letterSpacing: '0.1em'}}>RESEARCH</a>
            <a href="/about/" className="text-gray-400 hover:text-[#FFD700] transition-colors" style={{letterSpacing: '0.1em'}}>ABOUT</a>
            <a href="/contact/" className="text-gray-400 hover:text-[#FFD700] transition-colors" style={{letterSpacing: '0.1em'}}>CONTACT</a>
          </div>
        </div>
      </nav>

      {/* Centered Content Container - Using Absolute Positioning */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <AnimatePresence>
          {!approaching && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : -20 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: '1200px',
                textAlign: 'center'
              }}
            >
              {/* Title */}
              <h1 
                className={`font-serif text-[#FCD34D] transition-all duration-1000 mb-8 md:mb-12`}
                style={{ 
                  fontSize: 'clamp(2rem, 8vw, 5rem)',
                  textShadow: '0 0 50px rgba(252, 211, 77, 0.6), 0 0 100px rgba(252, 211, 77, 0.3), 0 0 150px rgba(252, 211, 77, 0.15)',
                  fontWeight: 400,
                  letterSpacing: hovering ? '0.25em' : '0.2em',
                  lineHeight: 1.2
                }}
              >
                {hovering ? 'INTERPRETABILITY BY CONSTRUCTION' : 'AEO TRIVECTOR'}
              </h1>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: ready ? 0.9 : 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <div
                  className="font-sans text-[#3B82F6] uppercase mb-12 md:mb-16"
                  style={{ 
                    fontSize: 'clamp(0.75rem, 2vw, 1.25rem)',
                    textShadow: '0 0 30px rgba(96, 165, 250, 0.7), 0 0 60px rgba(96, 165, 250, 0.4)',
                    letterSpacing: '0.5em',
                    fontWeight: 300
                  }}
                >
                  Attractor Architecture
                </div>
              </motion.div>

              {/* ENTER Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: ready ? 1 : 0,
                  scale: ready ? 1 : 0.9
                }}
                transition={{ duration: 0.8, delay: 1 }}
                className="pointer-events-auto inline-block"
              >
                <button
                  onClick={handleEnter}
                  className="group relative px-12 py-4 md:px-16 md:py-5 border-2 border-[#60A5FA] text-white font-mono tracking-[0.3em] text-sm md:text-base uppercase transition-all duration-500 hover:bg-[#60A5FA]/10 hover:border-[#FFD700] hover:text-[#FFD700] hover:tracking-[0.4em]"
                  style={{
                    textShadow: '0 0 20px rgba(96, 165, 250, 0.5)',
                    boxShadow: '0 0 30px rgba(96, 165, 250, 0.3), inset 0 0 30px rgba(96, 165, 250, 0.1)'
                  }}
                >
                  ENTER
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
