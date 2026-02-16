'use client';

import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';

export function EntranceSceneTest() {
  const starsGeometry = useMemo(() => {
    const positions = new Float32Array(
      Array.from({ length: 300 }, () => (Math.random() - 0.5) * 20)
    );
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'black' }}>
      {/* Debug indicator */}
      <div style={{ 
        position: 'absolute', 
        top: 10, 
        left: 10, 
        color: 'lime', 
        zIndex: 999,
        background: 'rgba(0,0,0,0.8)',
        padding: '8px',
        fontSize: '14px',
        fontFamily: 'monospace'
      }}>
        ✓ Canvas Component Loaded
      </div>
      
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
      >
        <perspectiveCamera position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* Simple visible mesh for testing */}
        <mesh rotation={[0.5, 0.5, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
        </mesh>
        
        {/* Visible stars using BufferGeometry API */}
        <points geometry={starsGeometry}>
          <pointsMaterial size={0.1} color="white" />
        </points>
      </Canvas>
    </div>
  );
}
