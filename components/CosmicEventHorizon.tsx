'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ShaderAccretionDisk } from './ShaderAccretionDisk';

interface CosmicEventHorizonProps {
  onHover?: (hovering: boolean) => void;
  onClick?: () => void;
}

export function CosmicEventHorizon({ onHover, onClick }: CosmicEventHorizonProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // 1. Central Void - Pure Black
  const voidMesh = useRef<THREE.Mesh>(null);
  
  // The Attractor Symphony Nodes
  // 5 nodes on one of the gold rings (index 2, radius ~2.8)
  const nodes = useMemo(() => {
    const nodeData = [];
    const radius = 2.8;
    const angles = [0, 1.2, 2.5, 3.8, 5.1]; // Spaced out
    
    for (let i = 0; i < 5; i++) {
      const theta = angles[i];
      const isConductor = i === 2; // The brightest node
      nodeData.push({
        position: new THREE.Vector3(radius * Math.cos(theta), radius * Math.sin(theta), 0),
        size: isConductor ? 0.15 : 0.08,
        color: isConductor ? '#FFFFFF' : '#FFD700',
        intensity: isConductor ? 2 : 1
      });
    }
    return nodeData;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      
      // Rotate the entire system slowly
      groupRef.current.rotation.z = time * 0.05;
      
      // Tilt for cinematic perspective
      groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.1 + 0.2; 
      groupRef.current.rotation.y = Math.cos(time * 0.15) * 0.1;
    }
  });

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
        onHover?.(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        onHover?.(false);
      }}
      onClick={onClick}
    >
      {/* Central Void - Vantablack Core */}
      <mesh ref={voidMesh}>
        <sphereGeometry args={[1.35, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Event Horizon Glow (Behind the void) */}
      <mesh position={[0, 0, -0.5]}>
        <circleGeometry args={[1.55, 64]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Production-Grade Shader Accretion Disk */}
      <ShaderAccretionDisk 
        particleCount={15000}
        innerRadius={1.8}
        outerRadius={6.5}
        thickness={0.3}
      />

      {/* Nodes */}
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position}>
          <sphereGeometry args={[node.size, 16, 16]} />
          <meshBasicMaterial color={node.color} toneMapped={false} />
          <pointLight distance={1} intensity={node.intensity} color={node.color} />
        </mesh>
      ))}

      {/* Deep Atmospheric Bloom */}
      <mesh position={[0, 0, -2]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial 
          color="#050A1F" 
          transparent 
          opacity={0.4} 
          blending={THREE.NormalBlending} // Darken background
          depthWrite={false}
        />
      </mesh>
      
      {/* Radiant Energy Overlay */}
      <mesh position={[0, 0, -0.1]}>
        <ringGeometry args={[1.4, 4, 64]} />
        <meshBasicMaterial 
          color="#1E40AF" 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending} 
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
