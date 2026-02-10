'use client'

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Attractor } from '@/components/Attractor';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import * as THREE from 'three';

// 3D Group component for Attractor animation
function AttractorGroup({ mousePosition }: { mousePosition: { x: number, y: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation based on time
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      
      // Scale pulsing
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      groupRef.current.scale.set(scale, scale, scale);
      
      // Subtle mouse-responsive tilt (lerp for smoothness)
      const targetRotationX = mousePosition.y * 0.1;
      const targetRotationZ = mousePosition.x * 0.1;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.z += (targetRotationZ - groupRef.current.rotation.z) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Attractor count={25000} opacity={0.85} speed={1} />
    </group>
  );
}

interface PillarProps {
  icon: string;
  title: string;
  descriptor: string;
  delay: number;
}

function Pillar({ icon, title, descriptor, delay }: PillarProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
      style={{ pointerEvents: 'auto' }}
    >
      {/* Translucent glass panel with gold glow */}
      <div 
        className="relative rounded-2xl p-12 transition-all duration-700 ease-out"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: isHovered 
            ? '0 0 40px rgba(255, 215, 0, 0.3), inset 0 0 60px rgba(255, 215, 0, 0.1)' 
            : '0 0 20px rgba(255, 215, 0, 0.15), inset 0 0 30px rgba(255, 215, 0, 0.05)',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        }}
      >
        {/* Gold corner glow */}
        <div 
          className="absolute top-0 right-0 w-32 h-32 rounded-tr-2xl pointer-events-none transition-opacity duration-700"
          style={{
            background: 'radial-gradient(circle at top right, rgba(255, 215, 0, 0.2), transparent 70%)',
            opacity: isHovered ? 1 : 0.6,
          }}
        />
        
        {/* Breathing light band */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            background: [
              'linear-gradient(135deg, transparent 0%, rgba(255, 215, 0, 0.03) 50%, transparent 100%)',
              'linear-gradient(135deg, transparent 30%, rgba(255, 215, 0, 0.05) 70%, transparent 100%)',
              'linear-gradient(135deg, transparent 0%, rgba(255, 215, 0, 0.03) 50%, transparent 100%)',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Content */}
        <div className="relative flex flex-col items-center space-y-6" style={{ textAlign: 'center', width: '100%' }}>
          {/* Icon */}
          <motion.div
            className="text-5xl"
            animate={{
              rotate: isHovered ? 5 : 0,
            }}
            transition={{ duration: 0.5 }}
            style={{
              color: '#FFD700',
              filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))',
              textShadow: '0 2px 12px rgba(0,0,0,0.9)',
            }}
          >
            {icon}
          </motion.div>

          {/* Title */}
          <h3 
            className="font-serif text-2xl tracking-wider uppercase"
            style={{
              color: 'rgba(255, 255, 255, 0.95)',
              letterSpacing: '0.15em',
              fontWeight: 400,
              textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 4px 24px rgba(0,0,0,0.7)',
            }}
          >
            {title}
          </h3>

          {/* Descriptor */}
          <motion.p
            className="text-base leading-relaxed max-w-xs"
            animate={{
              opacity: isHovered ? 1 : 0.7,
            }}
            transition={{ duration: 0.5 }}
            style={{
              color: 'rgba(209, 213, 219, 0.9)',
              textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.7)',
            }}
          >
            {descriptor}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Manifold() {
  // Check if arriving from event horizon crossing
  const fromEventHorizon = typeof window !== 'undefined' && sessionStorage.getItem('fromEventHorizon') === 'true';
  const [showGhostHorizon, setShowGhostHorizon] = useState(fromEventHorizon);
  
  // Mouse tracking for particle interaction
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Ghost horizon dissolves after 600ms, then clear flag
  useEffect(() => {
    if (fromEventHorizon) {
      const timer = setTimeout(() => {
        setShowGhostHorizon(false);
        sessionStorage.removeItem('fromEventHorizon');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [fromEventHorizon]);
  
  // Track mouse movement for particle interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1 range
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const pillars = [
    {
      icon: "△",
      title: "Structure",
      descriptor: "Geometric foundations for stable systems."
    },
    {
      icon: "◯",
      title: "Dynamics",
      descriptor: "How attractors encode and transform."
    },
    {
      icon: "◇",
      title: "Integration",
      descriptor: "Self-encoding through spectral geometry."
    }
  ];

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
      {/* Lorenz Attractor Background - Fixed Full Viewport at z-0 */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0
      }}>
        <Canvas camera={{ position: [0, 0, 12], fov: 75 }} style={{ width: '100%', height: '100%' }}>
          <AttractorGroup mousePosition={mousePosition} />
        </Canvas>
      </div>

      {/* Ghost Horizon Effect */}
      {showGhostHorizon && (
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            style={{
              width: '24rem',
              height: '24rem',
              borderRadius: '50%',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 0 100px rgba(255, 255, 255, 0.3), inset 0 0 100px rgba(255, 255, 255, 0.1)'
            }}
          />
        </motion.div>
      )}

      {/* Fixed Navigation Header - z-50 */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        pointerEvents: 'auto'
      }}>
        <a href="/" style={{ pointerEvents: 'auto' }}>
          <div style={{
            fontSize: '1.25rem',
            fontFamily: 'Cormorant Garamond, serif',
            letterSpacing: '0.05em',
            fontWeight: 700,
            cursor: 'pointer',
            color: 'rgba(255, 215, 0, 0.9)',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
            transition: 'color 0.5s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 215, 0, 0.9)'}
          >
            AEO TRIVECTOR
          </div>
        </a>
        <div style={{
          display: 'flex',
          gap: '2rem',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          opacity: 0.7
        }}>
          <a href="/manifold" style={{ 
            position: 'relative',
            paddingBottom: '0.25rem',
            paddingTop: '0.5rem',
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            borderBottom: '1px solid #FFD700',
            color: '#FFD700',
            transition: 'all 0.3s',
            textDecoration: 'none',
            pointerEvents: 'auto'
          }}>VISION</a>
          <a href="/research" style={{ 
            position: 'relative',
            paddingBottom: '0.25rem',
            paddingTop: '0.5rem',
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            borderBottom: '1px solid rgba(59, 130, 246, 0.5)',
            color: 'rgba(255, 255, 255, 0.7)',
            transition: 'all 0.3s',
            textDecoration: 'none',
            pointerEvents: 'auto'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderBottomColor = '#FFD700';
            e.currentTarget.style.color = '#FFD700';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderBottomColor = 'rgba(59, 130, 246, 0.5)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
          }}
          >RESEARCH</a>
          <a href="/about" style={{ 
            position: 'relative',
            paddingBottom: '0.25rem',
            paddingTop: '0.5rem',
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            borderBottom: '1px solid rgba(59, 130, 246, 0.5)',
            color: 'rgba(255, 255, 255, 0.7)',
            transition: 'all 0.3s',
            textDecoration: 'none',
            pointerEvents: 'auto'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderBottomColor = '#FFD700';
            e.currentTarget.style.color = '#FFD700';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderBottomColor = 'rgba(59, 130, 246, 0.5)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
          }}
          >ABOUT</a>
          <a href="/contact" style={{ 
            position: 'relative',
            paddingBottom: '0.25rem',
            paddingTop: '0.5rem',
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            borderBottom: '1px solid rgba(59, 130, 246, 0.5)',
            color: 'rgba(255, 255, 255, 0.7)',
            transition: 'all 0.3s',
            textDecoration: 'none',
            pointerEvents: 'auto'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderBottomColor = '#FFD700';
            e.currentTarget.style.color = '#FFD700';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderBottomColor = 'rgba(59, 130, 246, 0.5)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
          }}
          >CONTACT</a>
        </div>
      </nav>

      {/* Scrollable Content Container - NO z-index, NO background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        pointerEvents: 'none'
      }}>
        {/* Title Section - Absolutely Positioned at z-10 */}
        <div style={{
          position: 'absolute',
          top: '20vh',
          left: 0,
          width: '100%',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 1.5rem',
          pointerEvents: 'none'
        }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(3rem, 10vw, 6rem)',
              letterSpacing: '0.1em',
              marginBottom: '1.5rem',
              color: 'rgba(255, 255, 255, 0.95)',
              textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 8px 40px rgba(0,0,0,0.7)',
              fontWeight: 300,
              textAlign: 'center',
              margin: 0
            }}>
              AEO TRIVECTOR
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'rgba(255, 215, 0, 0.8)',
                textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                textAlign: 'center',
                marginTop: '0.5rem'
              }}
            >
              Attractor Architecture
            </motion.p>
          </motion.div>
        </div>

        {/* Three Pillars - Absolutely Positioned at z-10 */}
        <div style={{
          position: 'absolute',
          top: '45vh',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '80rem',
          padding: '0 1.5rem',
          zIndex: 10,
          pointerEvents: 'none'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            width: '100%'
          }}>
            {pillars.map((pillar, index) => (
              <Pillar
                key={index}
                icon={pillar.icon}
                title={pillar.title}
                descriptor={pillar.descriptor}
                delay={0.5 + index * 0.2}
              />
            ))}
          </div>
        </div>

        {/* Footer - Absolutely Positioned at z-10 */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          zIndex: 10,
          pointerEvents: 'auto'
        }}>
          <Footer />
        </div>

        {/* Spacer to enable scrolling */}
        <div style={{ height: '150vh' }} />
      </div>
    </div>
  );
}
