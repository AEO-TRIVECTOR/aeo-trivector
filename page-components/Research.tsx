'use client'

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Attractor } from '@/components/Attractor';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import * as THREE from 'three';

// Knowledge Network - Signature Visual Element
function KnowledgeNetwork({ hoveredNode, mousePosition }: { hoveredNode: number | null, mousePosition: { x: number, y: number } }) {
  const nodes = [
    { position: [0, 2, 0], connections: [1, 2, 3] },
    { position: [-3, 1, -1], connections: [0, 2, 4] },
    { position: [3, 0.5, -2], connections: [0, 3] },
    { position: [-2, -1, 1], connections: [0, 1, 4] },
    { position: [2, -1.5, 0.5], connections: [1, 3] },
  ];

  return (
    <group>
      {/* Draw connections (lines between nodes) */}
      {nodes.map((node, i) => 
        node.connections.map(targetIdx => {
          if (targetIdx > i) { // Draw each connection only once
            const target = nodes[targetIdx];
            return (
              <NetworkConnection
                key={`${i}-${targetIdx}`}
                start={node.position as [number, number, number]}
                end={target.position as [number, number, number]}
                active={hoveredNode === i || hoveredNode === targetIdx}
              />
            );
          }
          return null;
        })
      )}

      {/* Draw nodes */}
      {nodes.map((node, i) => (
        <NetworkNode
          key={i}
          position={node.position as [number, number, number]}
          index={i}
          active={hoveredNode === i}
          mousePosition={mousePosition}
        />
      ))}

      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 5]} intensity={1} color="#FCD34D" />
    </group>
  );
}

function NetworkNode({
  position,
  index,
  active,
  mousePosition
}: {
  position: [number, number, number];
  index: number;
  active: boolean;
  mousePosition: { x: number, y: number };
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      
      // Gentle pulsing
      const scale = active ? 1.3 : 1 + Math.sin(time * 2 + index) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);

      // Mouse parallax
      const parallaxStrength = 0.3;
      meshRef.current.position.x = position[0] + mousePosition.x * parallaxStrength;
      meshRef.current.position.z = position[2] + mousePosition.y * parallaxStrength;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial
        color={active ? "#FCD34D" : "#3B82F6"}
        emissive={active ? "#FCD34D" : "#3B82F6"}
        emissiveIntensity={active ? 1 : 0.5}
        transparent
        opacity={active ? 1 : 0.8}
      />
      {/* Glow effect */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={active ? 2 : 0.5} 
        color={active ? "#FCD34D" : "#3B82F6"} 
        distance={active ? 3 : 1.5} 
      />
    </mesh>
  );
}

function NetworkConnection({
  start,
  end,
  active
}: {
  start: [number, number, number];
  end: [number, number, number];
  active: boolean;
}) {
  const lineRef = useRef<THREE.Line>(null);

  useFrame((state) => {
    if (lineRef.current && lineRef.current.material) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      const time = state.clock.elapsedTime;
      
      // Shimmer effect
      material.opacity = active 
        ? 0.6 + Math.sin(time * 3) * 0.2
        : 0.2 + Math.sin(time * 2) * 0.1;
    }
  });

  const points = [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({
      color: active ? "#FCD34D" : "#3B82F6",
      transparent: true,
      opacity: active ? 0.6 : 0.2
    }))} ref={lineRef} />
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
      <Attractor count={15000} opacity={0.15} speed={1} />
    </group>
  );
}

const researchPapers = [
  {
    title: "Self-Encoding Geometry",
    subtitle: "Spectral foundations for attractor-stable systems",
    status: "In preparation",
    description: "Formalizes the mathematical framework underlying AEO Trivector through spectral triple structures."
  },
  {
    title: "Categorical Dynamics",
    subtitle: "Compositional semantics for cognitive architectures",
    status: "In preparation",
    description: "Develops categorical methods for composing and reasoning about attractor dynamics."
  },
  {
    title: "Interpretable AI via Geometry",
    subtitle: "From black boxes to transparent structures",
    status: "In preparation",
    description: "Demonstrates how geometric constraints enable interpretable machine learning systems."
  },
  {
    title: "The Six-Threshold Conjecture",
    subtitle: "Necessary conditions for self-reference",
    status: "In preparation",
    description: "Proposes six critical thresholds that systems must cross to achieve self-encoding."
  },
  {
    title: "Open Source Framework",
    subtitle: "Reference implementation and tools",
    status: "Coming 2026",
    description: "Python/Julia library for building attractor-stable systems with geometric constraints."
  },
];

export default function Research() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  
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
    <div className="min-h-screen relative overflow-hidden bg-[#050505]">
      {/* Lorenz Attractor Background - Ghost Horizon */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 12], fov: 80 }}>
          <AttractorBackground mousePosition={mousePosition} />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section with Knowledge Network */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20">
          {/* Knowledge Network - Signature Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full max-w-2xl h-[400px] mb-12"
          >
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
              <KnowledgeNetwork hoveredNode={hoveredNode} mousePosition={mousePosition} />
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
            Research
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl text-[#3B82F6] tracking-[0.1em] text-center mb-12"
          >
            Publications & Open Source
          </motion.p>
        </section>

        {/* Research Papers Section */}
        <section className="max-w-4xl mx-auto px-6 pb-32 space-y-8">
          {researchPapers.map((paper, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredNode(index)}
              onMouseLeave={() => setHoveredNode(null)}
              className="relative rounded-2xl p-10 backdrop-blur-xl border transition-all duration-500"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderColor: hoveredNode === index ? 'rgba(252, 211, 77, 0.3)' : 'rgba(252, 211, 77, 0.15)',
                boxShadow: hoveredNode === index
                  ? '0 0 40px rgba(252, 211, 77, 0.2), inset 0 0 60px rgba(252, 211, 77, 0.05)'
                  : '0 0 20px rgba(252, 211, 77, 0.1), inset 0 0 40px rgba(252, 211, 77, 0.02)',
                transform: hoveredNode === index ? 'translateY(-4px)' : 'translateY(0)',
              }}
            >
              {/* Corner glow */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-tr-2xl pointer-events-none transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(circle at top right, rgba(252, 211, 77, 0.15), transparent 70%)',
                  opacity: hoveredNode === index ? 1 : 0.5,
                }}
              />

              <div className="relative">
                {/* Status Badge */}
                <div className="inline-block px-3 py-1 mb-4 rounded-full text-xs font-mono tracking-wider"
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    color: '#3B82F6',
                  }}
                >
                  {paper.status}
                </div>

                {/* Title */}
                <h3 className="font-serif text-2xl text-[#FCD34D] mb-2 tracking-wide"
                  style={{ textShadow: '0 0 20px rgba(252, 211, 77, 0.2)' }}
                >
                  {paper.title}
                </h3>

                {/* Subtitle */}
                <p className="text-lg text-[#E5E5E5]/70 mb-4 italic">
                  {paper.subtitle}
                </p>

                {/* Description */}
                <p className="text-[#E5E5E5]/80 leading-relaxed">
                  {paper.description}
                </p>
              </div>
            </motion.div>
          ))}
        </section>
      </div>

      <Footer />
    </div>
  );
}
