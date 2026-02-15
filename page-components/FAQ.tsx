'use client'

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Attractor } from '@/components/Attractor';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyGlassHeader } from '@/components/StickyGlassHeader';
import Footer from '@/components/Footer';
import * as THREE from 'three';

// Knowledge Tree - Signature Visual Element
function KnowledgeTree({ activeBranch, mousePosition }: { activeBranch: number | null, mousePosition: { x: number, y: number } }) {
  // Tree structure: trunk + 6 branches (one for each FAQ category)
  const branches = [
    { angle: -60, length: 1.5, position: [0, 1, 0] },
    { angle: -30, length: 1.3, position: [0, 0.5, 0] },
    { angle: 0, length: 1.4, position: [0, 0, 0] },
    { angle: 30, length: 1.2, position: [0, -0.5, 0] },
    { angle: 60, length: 1.3, position: [0, -1, 0] },
    { angle: 90, length: 1.1, position: [0, -1.5, 0] },
  ];

  return (
    <group>
      {/* Trunk */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 3, 16]} />
        <meshStandardMaterial
          color="#FCD34D"
          emissive="#FCD34D"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Branches */}
      {branches.map((branch, i) => (
        <TreeBranch
          key={i}
          index={i}
          angle={branch.angle}
          length={branch.length}
          position={branch.position as [number, number, number]}
          active={activeBranch === i}
          mousePosition={mousePosition}
        />
      ))}

      <ambientLight intensity={0.4} />
      <pointLight position={[0, 2, 2]} intensity={1} color="#FCD34D" />
    </group>
  );
}

function TreeBranch({
  index,
  angle,
  length,
  position,
  active,
  mousePosition
}: {
  index: number;
  angle: number;
  length: number;
  position: [number, number, number];
  active: boolean;
  mousePosition: { x: number, y: number };
}) {
  const branchRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (branchRef.current) {
      const time = state.clock.elapsedTime;
      
      // Gentle swaying
      const sway = Math.sin(time * 0.5 + index) * 0.05;
      branchRef.current.rotation.z = (angle * Math.PI) / 180 + sway;

      // Glow when active
      if (branchRef.current.children[0]) {
        const mesh = branchRef.current.children[0] as THREE.Mesh;
        if (mesh.material) {
          const material = mesh.material as THREE.MeshStandardMaterial;
          material.emissiveIntensity = active ? 0.8 : 0.3;
        }
      }

      // Mouse parallax
      const parallaxStrength = 0.2;
      branchRef.current.position.x = position[0] + mousePosition.x * parallaxStrength;
      branchRef.current.position.z = position[2] + mousePosition.y * parallaxStrength;
    }
  });

  return (
    <group ref={branchRef} position={position}>
      <mesh rotation={[0, 0, (angle * Math.PI) / 180]}>
        <cylinderGeometry args={[0.04, 0.06, length, 12]} />
        <meshStandardMaterial
          color={active ? "#FCD34D" : "#3B82F6"}
          emissive={active ? "#FCD34D" : "#3B82F6"}
          emissiveIntensity={active ? 0.8 : 0.3}
        />
      </mesh>
      {/* Leaf/endpoint glow */}
      <mesh position={[Math.cos((angle * Math.PI) / 180) * length / 2, Math.sin((angle * Math.PI) / 180) * length / 2, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={active ? "#FCD34D" : "#3B82F6"}
          emissive={active ? "#FCD34D" : "#3B82F6"}
          emissiveIntensity={active ? 1 : 0.5}
          transparent
          opacity={active ? 1 : 0.7}
        />
        <pointLight 
          position={[0, 0, 0]} 
          intensity={active ? 1.5 : 0.3} 
          color={active ? "#FCD34D" : "#3B82F6"} 
          distance={active ? 2 : 1} 
        />
      </mesh>
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
      <Attractor count={15000} opacity={0.85} speed={1} />
    </group>
  );
}

const faqs = [
  {
    question: "What is AEO Trivector?",
    answer: "AEO Trivector is a mathematical framework for building interpretable, attractor-stable AI systems. It combines topology, dynamics, and integration through Self-Encoding Geometry—a spectral approach that makes cognitive architectures transparent and verifiable."
  },
  {
    question: "How does it differ from current AI approaches?",
    answer: "Unlike black-box neural networks, AEO Trivector systems are geometrically constrained by design. The μ constant (≈0.567143) ensures self-encoding structure, making the system's reasoning process interpretable at every level. Think of it as the difference between a tangled web and a crystal lattice."
  },
  {
    question: "What are the practical applications?",
    answer: "Any domain requiring transparent reasoning: medical diagnosis, financial systems, autonomous vehicles, scientific discovery, and regulatory compliance. The framework is particularly valuable where explainability and safety are non-negotiable."
  },
  {
    question: "Is this related to existing mathematical frameworks?",
    answer: "Yes. AEO Trivector draws from noncommutative geometry (Connes), dynamical systems theory (Poincaré), and category theory. It synthesizes these into a unified spectral triple (A, H, D) with attractor-stable dynamics."
  },
  {
    question: "When will the open source framework be available?",
    answer: "The reference implementation (Python/Julia) is planned for 2026. It will include core constraint solvers, spectral analysis tools, and visualization utilities. Early access for research collaborators is available upon request."
  },
  {
    question: "How can I get involved?",
    answer: "Reach out via the contact page. We're interested in research collaborations, technical partnerships, and domain-specific applications. Background in dynamical systems, spectral geometry, or AI interpretability is helpful but not required."
  },
];

export default function FAQ() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
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
      {/* Header */}
      <StickyGlassHeader />

      {/* Lorenz Attractor Background - Ghost Horizon */}
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
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, rgba(59,130,246,0.01) 50%, transparent 100%)',
          pointerEvents: 'none'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section with Knowledge Tree */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20">
          {/* Knowledge Tree - Signature Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full max-w-lg h-[400px] mb-12"
          >
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <KnowledgeTree activeBranch={openIndex} mousePosition={mousePosition} />
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
            Questions
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl text-[#3B82F6] tracking-[0.1em] text-center mb-16"
          >
            Frequently Asked Questions
          </motion.p>
        </section>

        {/* FAQ Accordion Section */}
        <section className="max-w-3xl mx-auto px-6 pb-32 space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setOpenIndex(index)}
              onMouseLeave={() => openIndex === index && setOpenIndex(null)}
            >
              <div
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="relative rounded-2xl p-8 border cursor-pointer transition-all duration-500"
                style={{
                  background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                  borderColor: openIndex === index ? 'rgba(252, 211, 77, 0.3)' : 'rgba(252, 211, 77, 0.15)',
                  boxShadow: openIndex === index
                    ? '0 0 40px rgba(252, 211, 77, 0.2), inset 0 0 60px rgba(252, 211, 77, 0.05)'
                    : '0 0 20px rgba(252, 211, 77, 0.1), inset 0 0 40px rgba(252, 211, 77, 0.02)',
                  transform: openIndex === index ? 'translateY(-2px)' : 'translateY(0)',
                }}
              >
                {/* Corner glow */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-tr-2xl pointer-events-none transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle at top right, rgba(252, 211, 77, 0.15), transparent 70%)',
                    opacity: openIndex === index ? 1 : 0.5,
                  }}
                />

                <div className="relative">
                  {/* Question */}
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-serif text-xl text-[#FCD34D] flex-1"
                      style={{ textShadow: '0 0 15px rgba(252, 211, 77, 0.2)' }}
                    >
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-[#3B82F6] text-2xl font-light"
                    >
                      +
                    </motion.div>
                  </div>

                  {/* Answer */}
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="mt-6 text-[#E5E5E5]/80 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </section>
      </div>

      <Footer />
    </div>
  );
}
