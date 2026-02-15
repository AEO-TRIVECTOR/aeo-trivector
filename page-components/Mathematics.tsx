'use client'

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import { Attractor } from '@/components/Attractor';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import * as THREE from 'three';

// Floating 3D Equations - Signature Visual Element
function FloatingEquations({ mousePosition }: { mousePosition: { x: number, y: number } }) {
  const equations = [
    { text: 'μ = e⁻μ', position: [0, 2, 0], color: '#FCD34D', scale: 0.3 },
    { text: 'Ω', position: [-3, 1, -2], color: '#3B82F6', scale: 0.25 },
    { text: 'β', position: [3, 0, -1], color: '#3B82F6', scale: 0.25 },
    { text: '(A,H,D)', position: [-2, -1, 1], color: '#FCD34D', scale: 0.2 },
    { text: 'L', position: [2, -2, 0], color: '#9CA3AF', scale: 0.25 },
  ];

  return (
    <group>
      {equations.map((eq, i) => (
        <FloatingEquation
          key={i}
          text={eq.text}
          position={eq.position as [number, number, number]}
          color={eq.color}
          scale={eq.scale}
          index={i}
          mousePosition={mousePosition}
        />
      ))}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 5]} intensity={1} color="#FCD34D" />
    </group>
  );
}

function FloatingEquation({
  text,
  position,
  color,
  scale,
  index,
  mousePosition
}: {
  text: string;
  position: [number, number, number];
  color: string;
  scale: number;
  index: number;
  mousePosition: { x: number, y: number };
}) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      
      // Slow rotation on all axes
      meshRef.current.rotation.x = Math.sin(time * 0.2 + index) * 0.3;
      meshRef.current.rotation.y = time * 0.15 + index * 0.5;
      meshRef.current.rotation.z = Math.cos(time * 0.25 + index) * 0.2;

      // Gentle floating motion
      meshRef.current.position.y = position[1] + Math.sin(time * 0.3 + index) * 0.3;

      // Mouse parallax (depth effect)
      const parallaxStrength = 0.5 + index * 0.1;
      meshRef.current.position.x = position[0] + mousePosition.x * parallaxStrength;
      meshRef.current.position.z = position[2] + mousePosition.y * parallaxStrength;
    }
  });

  return (
    <group ref={meshRef} position={position} scale={scale}>
      <Center>
        <mesh>
          <boxGeometry args={[text.length * 0.6, 0.8, 0.1]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Glow effect */}
        <pointLight position={[0, 0, 0.5]} intensity={0.5} color={color} distance={2} />
      </Center>
    </group>
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

interface SectionProps {
  title: string;
  children: React.ReactNode;
  delay: number;
}

function Section({ title, children, delay }: SectionProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="relative rounded-2xl p-12 transition-all duration-700"
        style={{
          background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(252, 211, 77, 0.2)',
          boxShadow: isHovered 
            ? '0 0 40px rgba(252, 211, 77, 0.15), inset 0 0 60px rgba(252, 211, 77, 0.05)' 
            : '0 0 25px rgba(252, 211, 77, 0.1), inset 0 0 40px rgba(252, 211, 77, 0.03)',
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        <div 
          className="absolute top-0 left-0 w-32 h-32 rounded-tl-2xl pointer-events-none transition-opacity duration-700"
          style={{
            background: 'radial-gradient(circle at top left, rgba(252, 211, 77, 0.15), transparent 70%)',
            opacity: isHovered ? 1 : 0.6,
          }}
        />

        <div className="relative">
          <h2 
            className="font-serif text-3xl tracking-wide mb-8 text-[#FCD34D]"
            style={{
              textShadow: '0 0 20px rgba(252, 211, 77, 0.3)',
              letterSpacing: '0.12em',
              fontWeight: 300,
            }}
          >
            {title}
          </h2>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

export default function Mathematics() {
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
        {/* Hero Section with Floating Equations */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20">
          {/* Floating 3D Equations - Signature Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full max-w-2xl h-[400px] mb-12"
          >
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
              <FloatingEquations mousePosition={mousePosition} />
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
            The Formalism
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl text-[#E5E5E5]/80 tracking-[0.05em] text-center max-w-2xl"
          >
            Mathematical framework underlying Self-Encoding Geometry and attractor-stable systems
          </motion.p>
        </section>

        {/* Content Sections */}
        <section className="max-w-4xl mx-auto px-6 pb-32 space-y-12">
          {/* Constraint Hierarchy */}
          <Section title="The Constraint Hierarchy" delay={0}>
            <div className="space-y-8">
              <div className="border-l-2 border-[#FCD34D]/30 pl-6">
                <h3 className="font-mono text-xl text-white mb-3">μ — Primitive Constraint</h3>
                <p className="text-[#E5E5E5]/80 mb-4 leading-relaxed">
                  The self-encoding fixed point. Attractor-stable systems satisfy <span className="font-mono text-[#FCD34D]">μ = e<sup>−μ</sup></span>, creating interpretable geometric structure.
                </p>
                <div className="font-mono text-sm text-[#9CA3AF]">
                  μ ≈ 0.567143...
                </div>
              </div>

              <div className="border-l-2 border-[#3B82F6]/30 pl-6">
                <h3 className="font-mono text-xl text-white mb-3">Ω, β — Architectural Constraints</h3>
                <p className="text-[#E5E5E5]/80 leading-relaxed">
                  <span className="font-mono text-[#3B82F6]">Ω</span> governs global integration structure. <span className="font-mono text-[#3B82F6]">β</span> controls balance between structure and dynamics.
                </p>
              </div>

              <div className="border-l-2 border-[#9CA3AF]/30 pl-6">
                <h3 className="font-mono text-xl text-white mb-3">L — Derived Constraint</h3>
                <p className="text-[#E5E5E5]/80 leading-relaxed">
                  Emerges from interaction of primitive and architectural constraints.
                </p>
              </div>
            </div>
          </Section>

          {/* Spectral Triple */}
          <Section title="Spectral Triple Structure" delay={0.2}>
            <div className="space-y-6">
              <p className="text-lg text-[#E5E5E5]/80 leading-relaxed">
                The framework is formalized as a spectral triple <span className="font-mono text-[#FCD34D] text-xl">(A, H, D)</span> in the sense of Connes' noncommutative geometry.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="border border-[#FCD34D]/20 p-6 rounded-lg bg-[#FCD34D]/5">
                  <div className="font-mono text-2xl text-[#FCD34D] mb-3">A</div>
                  <div className="text-sm text-[#E5E5E5]/80">
                    <span className="font-semibold">Algebra</span><br/>
                    Noncommutative algebra of observables
                  </div>
                </div>

                <div className="border border-[#3B82F6]/20 p-6 rounded-lg bg-[#3B82F6]/5">
                  <div className="font-mono text-2xl text-[#3B82F6] mb-3">H</div>
                  <div className="text-sm text-[#E5E5E5]/80">
                    <span className="font-semibold">Hilbert Space</span><br/>
                    Representation space
                  </div>
                </div>

                <div className="border border-[#9CA3AF]/20 p-6 rounded-lg bg-[#9CA3AF]/5">
                  <div className="font-mono text-2xl text-[#9CA3AF] mb-3">D</div>
                  <div className="text-sm text-[#E5E5E5]/80">
                    <span className="font-semibold">Dirac Operator</span><br/>
                    Geometric structure
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Six-Threshold Conjecture */}
          <Section title="The Six-Threshold Conjecture" delay={0.4}>
            <div className="space-y-6">
              <p className="text-lg text-[#E5E5E5]/80 leading-relaxed">
                Systems capable of self-reference must cross six critical thresholds.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {[
                  { num: "01", name: "Differentiation", desc: "Emergence of distinct observables" },
                  { num: "02", name: "Integration", desc: "Formation of coherent structures" },
                  { num: "03", name: "Recursion", desc: "Self-referential loops appear" },
                  { num: "04", name: "Stabilization", desc: "Fixed points in dynamics" },
                  { num: "05", name: "Reflection", desc: "System observes its own state" },
                  { num: "06", name: "Encoding", desc: "Self-representation achieved" }
                ].map((threshold, i) => (
                  <div key={i} className="border-l-2 border-[#FCD34D]/30 pl-4 py-3">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-[#FCD34D]/50">{threshold.num}</span>
                      <div>
                        <h4 className="font-mono text-white mb-1">{threshold.name}</h4>
                        <p className="text-sm text-[#9CA3AF]">{threshold.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </section>
      </div>

      <Footer />
    </div>
  );
}
