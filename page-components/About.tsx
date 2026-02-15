'use client'

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Attractor } from '@/components/Attractor';
import { motion } from 'framer-motion';
import { StickyGlassHeader } from '@/components/StickyGlassHeader';
import Footer from '@/components/Footer';
import * as THREE from 'three';

// Orbital Rings Component - Signature Visual Element
function OrbitalRings({ mousePosition }: { mousePosition: { x: number, y: number } }) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const tetrahedronRef = useRef<THREE.Mesh>(null);
  const octahedronRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Rotate rings at different speeds
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.3;
      ring1Ref.current.rotation.y = time * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = time * -0.25;
      ring2Ref.current.rotation.z = time * 0.15;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = time * 0.35;
      ring3Ref.current.rotation.z = time * -0.2;
    }

    // Orbit Platonic solids
    if (tetrahedronRef.current) {
      const radius = 3;
      tetrahedronRef.current.position.x = Math.cos(time * 0.5) * radius;
      tetrahedronRef.current.position.y = Math.sin(time * 0.5) * radius;
      tetrahedronRef.current.rotation.x = time * 0.5;
      tetrahedronRef.current.rotation.y = time * 0.3;
    }
    if (octahedronRef.current) {
      const radius = 3.5;
      octahedronRef.current.position.x = Math.cos(time * -0.4 + Math.PI) * radius;
      octahedronRef.current.position.z = Math.sin(time * -0.4 + Math.PI) * radius;
      octahedronRef.current.rotation.x = time * -0.4;
      octahedronRef.current.rotation.z = time * 0.2;
    }

    // Mouse parallax (subtle tilt)
    if (ring1Ref.current && ring2Ref.current && ring3Ref.current) {
      const targetRotationX = mousePosition.y * 0.1;
      const targetRotationZ = mousePosition.x * 0.1;
      
      ring1Ref.current.rotation.x += (targetRotationX - ring1Ref.current.rotation.x) * 0.05;
      ring2Ref.current.rotation.z += (targetRotationZ - ring2Ref.current.rotation.z) * 0.05;
      ring3Ref.current.rotation.x += (targetRotationX - ring3Ref.current.rotation.x) * 0.05;
    }
  });

  return (
    <group>
      {/* Ring 1 - Innermost */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2, 0.05, 16, 100]} />
        <meshStandardMaterial 
          color="#FCD34D" 
          emissive="#FCD34D" 
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Ring 2 - Middle */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.5, 0.04, 16, 100]} />
        <meshStandardMaterial 
          color="#FCD34D" 
          emissive="#FCD34D" 
          emissiveIntensity={0.4}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Ring 3 - Outermost */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[3, 0.03, 16, 100]} />
        <meshStandardMaterial 
          color="#FCD34D" 
          emissive="#FCD34D" 
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Tetrahedron orbiting */}
      <mesh ref={tetrahedronRef}>
        <tetrahedronGeometry args={[0.3]} />
        <meshStandardMaterial 
          color="#3B82F6" 
          emissive="#3B82F6" 
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Octahedron orbiting */}
      <mesh ref={octahedronRef}>
        <octahedronGeometry args={[0.25]} />
        <meshStandardMaterial 
          color="#3B82F6" 
          emissive="#3B82F6" 
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Center glow */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#FCD34D" distance={5} />
      <ambientLight intensity={0.3} />
    </group>
  );
}

// Lorenz Attractor Background (Ghost Horizon Effect)
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
      <Attractor count={15000} opacity={0.85} speed={1} />
    </group>
  );
}

export default function About() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#000', overflow: 'hidden' }}>
      {/* Header */}
      <StickyGlassHeader />

      {/* Lorenz Attractor Background - Ghost Horizon Effect */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 12], fov: 80 }}>
          <AttractorBackground mousePosition={mousePosition} />
        </Canvas>
      </div>

      {/* Overlay layer for backdrop-filter to work with WebGL */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 5,
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, rgba(59,130,246,0.05) 50%, rgba(0,0,0,0.02) 100%)',
          pointerEvents: 'none'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section with Orbital Rings */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20">
          {/* Orbital Rings - Signature Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full max-w-md h-[400px] mb-12"
          >
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
              <OrbitalRings mousePosition={mousePosition} />
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
            Dr. Jared Dunahay
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl text-[#3B82F6] tracking-[0.1em] text-center mb-12"
          >
            Founder & Principal Investigator
          </motion.p>
        </section>

        {/* Bio Section - Glass Panels */}
        <section className="max-w-3xl mx-auto px-6 pb-32 space-y-8">
          {/* Bio Paragraph 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl p-10 border border-[#FCD34D]/20"
            style={{
              background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 0 30px rgba(252, 211, 77, 0.1), inset 0 0 50px rgba(252, 211, 77, 0.03)',
            }}
          >
            <div className="absolute top-0 left-0 w-32 h-32 rounded-tl-2xl pointer-events-none"
              style={{
                background: 'radial-gradient(circle at top left, rgba(252, 211, 77, 0.15), transparent 70%)',
              }}
            />
            <p className="text-lg leading-relaxed text-[#E5E5E5]/90">
              Researcher working at the intersection of <span className="text-[#FCD34D]">spectral geometry</span>, <span className="text-[#3B82F6]">category theory</span>, and geometric foundations for interpretable AI. My work focuses on developing mathematical frameworks that bridge continuous and discrete representations of cognitive processes.
            </p>
          </motion.div>

          {/* Bio Paragraph 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative rounded-2xl p-10 border border-[#FCD34D]/20"
            style={{
              background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 0 30px rgba(252, 211, 77, 0.1), inset 0 0 50px rgba(252, 211, 77, 0.03)',
            }}
          >
            <div className="absolute bottom-0 right-0 w-32 h-32 rounded-br-2xl pointer-events-none"
              style={{
                background: 'radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.15), transparent 70%)',
              }}
            />
            <p className="text-lg leading-relaxed text-[#E5E5E5]/90">
              The <span className="text-[#FCD34D]">AEO Trivector framework</span> emerged from the recognition that intelligence—whether biological or artificial—operates through <span className="text-[#3B82F6]">attractor dynamics</span> in structured phase spaces. By formalizing these dynamics through spectral methods and categorical composition, we can build systems that are both powerful and interpretable.
            </p>
          </motion.div>

          {/* Contact Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center gap-8 pt-8"
          >
            <a
              href="mailto:link@trivector.ai"
              className="text-sm tracking-[0.1em] text-[#E5E5E5]/70 hover:text-[#FCD34D] hover:drop-shadow-[0_0_15px_rgba(252,211,77,0.4)] transition-all duration-300"
            >
              EMAIL
            </a>
            <a
              href="https://www.linkedin.com/in/jared-dunahay"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm tracking-[0.1em] text-[#E5E5E5]/70 hover:text-[#FCD34D] hover:drop-shadow-[0_0_15px_rgba(252,211,77,0.4)] transition-all duration-300"
            >
              LINKEDIN
            </a>
            <a
              href="https://scholar.google.com/citations?user=XXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm tracking-[0.1em] text-[#E5E5E5]/70 hover:text-[#FCD34D] hover:drop-shadow-[0_0_15px_rgba(252,211,77,0.4)] transition-all duration-300"
            >
              SCHOLAR
            </a>
          </motion.div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
