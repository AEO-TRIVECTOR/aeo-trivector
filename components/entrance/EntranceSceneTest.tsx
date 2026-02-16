'use client';

import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

export function EntranceSceneTest() {
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
        padding: '8px'
      }}>
        Canvas Loading...
      </div>
      
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <perspectiveCamera position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* Simple visible mesh for testing */}
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
        
        {/* Visible stars */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={100}
              array={new Float32Array(Array.from({ length: 300 }, () => (Math.random() - 0.5) * 20))}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial size={0.1} color="white" />
        </points>
      </Canvas>
    </div>
  );
}
