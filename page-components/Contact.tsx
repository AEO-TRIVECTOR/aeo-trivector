'use client'

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Attractor } from '@/components/Attractor';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import Footer from '@/components/Footer';

// Pulsing Signal Waves - Signature Visual Element
function PulsingSignal({ mousePosition }: { mousePosition: { x: number, y: number } }) {
  const rings = [0, 1, 2, 3, 4, 5, 6];

  return (
    <group>
      {rings.map((i) => (
        <SignalRing
          key={i}
          index={i}
          mousePosition={mousePosition}
        />
      ))}
      {/* Center point */}
      <mesh>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial
          color="#FCD34D"
          emissive="#FCD34D"
          emissiveIntensity={1}
        />
        <pointLight position={[0, 0, 0]} intensity={2} color="#FCD34D" distance={5} />
      </mesh>
      <ambientLight intensity={0.3} />
    </group>
  );
}

function SignalRing({
  index,
  mousePosition
}: {
  index: number;
  mousePosition: { x: number, y: number };
}) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      const time = state.clock.elapsedTime;
      const cycleTime = 2; // 2 second cycle
      const delay = index * 0.3; // Stagger each ring
      
      // Expanding rings
      const progress = ((time + delay) % cycleTime) / cycleTime;
      const radius = 0.5 + progress * 3;
      ringRef.current.scale.set(radius, radius, 1);

      // Fade out as they expand
      if (ringRef.current.material) {
        const material = ringRef.current.material as THREE.MeshStandardMaterial;
        material.opacity = 1 - progress;
      }

      // Mouse parallax (subtle tilt)
      ringRef.current.rotation.x = mousePosition.y * 0.2;
      ringRef.current.rotation.y = mousePosition.x * 0.2;
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[1, 0.03, 16, 100]} />
      <meshStandardMaterial
        color={index % 2 === 0 ? "#FCD34D" : "#3B82F6"}
        emissive={index % 2 === 0 ? "#FCD34D" : "#3B82F6"}
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

// Ghost Horizon Background
function AttractorBackground({ mousePosition }: { mousePosition: { x: number, y: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      groupRef.current.scale.set(scale, scale, scale);
      
      const targetRotationX = mousePosition.y * 0.1;
      const targetRotationZ = mousePosition.x * 0.1;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.z += (targetRotationZ - groupRef.current.rotation.z) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Attractor count={15000} opacity={0.5} speed={1} />
    </group>
  );
}

export default function Contact() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#000', overflow: 'hidden' }}>
      {/* Lorenz Attractor Background - Ghost Horizon */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 12], fov: 80 }}>
          <AttractorBackground mousePosition={mousePosition} />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section with Pulsing Signal */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20">
          {/* Pulsing Signal - Signature Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full max-w-md h-[400px] mb-12"
          >
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
              <PulsingSignal mousePosition={mousePosition} />
            </Canvas>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-serif text-5xl md:text-6xl text-[#FCD34D] mb-4 tracking-[0.15em] text-center"
            style={{ textShadow: '0 0 40px rgba(252, 211, 77, 0.3)' }}
          >
            Connect
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl text-[#3B82F6] tracking-[0.1em] text-center mb-16"
          >
            Reach out to discuss research, collaborations, or applications
          </motion.p>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="max-w-2xl w-full"
          >
            <div 
              className="relative rounded-2xl p-12 border border-[#FCD34D]/20"
              style={{
                background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 0 30px rgba(252, 211, 77, 0.1), inset 0 0 50px rgba(252, 211, 77, 0.03)',
              }}
            >
              {/* Corner glow */}
              <div
                className="absolute top-0 left-0 w-40 h-40 rounded-tl-2xl pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at top left, rgba(252, 211, 77, 0.15), transparent 70%)',
                }}
              />

              <div className="relative space-y-8 text-center">
                {/* Email */}
                <div>
                  <div className="text-sm tracking-[0.2em] text-[#9CA3AF] mb-2 uppercase">
                    Email
                  </div>
                  <a
                    href="mailto:link@trivector.ai"
                    className="text-2xl font-serif text-[#FCD34D] hover:drop-shadow-[0_0_20px_rgba(252,211,77,0.6)] transition-all duration-300"
                  >
                    link@trivector.ai
                  </a>
                </div>

                {/* Location */}
                <div>
                  <div className="text-sm tracking-[0.2em] text-[#9CA3AF] mb-2 uppercase">
                    Location
                  </div>
                  <div className="text-lg text-[#E5E5E5]/80">
                    New Hampshire, USA
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-8 border-t border-[#FCD34D]/10">
                  <div className="text-sm tracking-[0.2em] text-[#9CA3AF] mb-4 uppercase">
                    Connect
                  </div>
                  <div className="flex justify-center gap-8">
                    <a
                      href="https://www.linkedin.com/in/jared-dunahay"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm tracking-[0.15em] text-[#E5E5E5]/70 hover:text-[#FCD34D] hover:drop-shadow-[0_0_15px_rgba(252,211,77,0.4)] transition-all duration-300"
                    >
                      LINKEDIN
                    </a>
                    <a
                      href="https://github.com/AEO-TRIVECTOR"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm tracking-[0.15em] text-[#E5E5E5]/70 hover:text-[#FCD34D] hover:drop-shadow-[0_0_15px_rgba(252,211,77,0.4)] transition-all duration-300"
                    >
                      GITHUB
                    </a>
                    <a
                      href="https://scholar.google.com/citations?user=XXXXX"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm tracking-[0.15em] text-[#E5E5E5]/70 hover:text-[#FCD34D] hover:drop-shadow-[0_0_15px_rgba(252,211,77,0.4)] transition-all duration-300"
                    >
                      SCHOLAR
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Additional Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-12 text-center text-sm text-[#9CA3AF] max-w-xl"
          >
            Interested in applying AEO Trivector to your domain? Reach out to discuss research collaborations, 
            consulting opportunities, or technical partnerships.
          </motion.p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
