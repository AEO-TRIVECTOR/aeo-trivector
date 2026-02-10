'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem',
      fontFamily: 'Cormorant Garamond, serif',
      color: 'white',
      textAlign: 'center',
      padding: '1rem',
    }}>
      <h1 style={{
        fontSize: 'clamp(4rem, 12vw, 8rem)',
        fontWeight: 300,
        letterSpacing: '0.1em',
        color: '#FFD700',
        textShadow: '0 0 40px rgba(255, 215, 0, 0.3)',
        margin: 0,
      }}>
        404
      </h1>
      <p style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.875rem',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: 'rgba(255, 255, 255, 0.5)',
      }}>
        Lost in the manifold
      </p>
      <Link 
        href="/"
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.875rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#60A5FA',
          textDecoration: 'none',
          padding: '1rem 2rem',
          border: '1px solid rgba(96, 165, 250, 0.3)',
          borderRadius: '0.5rem',
          transition: 'all 0.3s',
        }}
      >
        Return to Origin
      </Link>
    </div>
  )
}
