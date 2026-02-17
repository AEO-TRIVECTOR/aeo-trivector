/**
 * BlackHoleEntranceGR.jsx
 * 
 * Physics-accurate black hole entrance using General Relativity.
 * Complete rewrite with:
 * - Multi-order photon rings (n=0,1,2) with exponential convergence
 * - Proper Doppler beaming + gravitational redshift
 * - Kerr asymmetry (spin effects)
 * - Screen-space gravitational lensing
 * - Turbulence/hotspot micro-structure
 * 
 * Based on EHT observations and GR theory.
 */

'use client';

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import PhotonRingGR from './PhotonRingGR';

// ============================================================
// STARFIELD COMPONENT
// ============================================================

function StarField({ visible }) {
  const pointsRef = useRef();
  
  const { positions, colors, sizes } = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Distribute in sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 50 + Math.random() * 200;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      // Slight color variation
      const brightness = 0.5 + Math.random() * 0.5;
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness * 0.95;
      colors[i * 3 + 2] = brightness * 0.9;
      
      sizes[i] = 1.0 + Math.random() * 2.0;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  useFrame(({ clock }) => {
    if (pointsRef.current) {
      // Slow rotation for depth
      pointsRef.current.rotation.y = clock.elapsedTime * 0.0001;
    }
  });
  
  return (
    <points ref={pointsRef} visible={visible}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ============================================================
// SCENE COMPONENT
// ============================================================

function Scene({ phase }) {
  const { viewport, camera } = useThree();
  
  // Physics parameters
  const spin = 0.8;              // Kerr parameter a/M
  const inclination = Math.PI / 4; // 45° viewing angle
  const baseRadius = 6.5;
  
  // Responsive radius calculation
  const ringRadius = useMemo(() => {
    const aspect = viewport.width / viewport.height;
    const vFovRad = (camera.fov * Math.PI) / 180;
    const hFovHalf = Math.atan(Math.tan(vFovRad / 2) * aspect);
    const cameraZ = camera.position.z || 12;
    const maxHalfWidth = cameraZ * Math.tan(hFovHalf) * 0.88;
    const scale = Math.min(1.0, maxHalfWidth / baseRadius);
    return baseRadius * scale;
  }, [viewport.width, viewport.height, camera.fov, camera.position.z]);
  
  return (
    <>
      {/* Starfield background */}
      <StarField visible={phase >= 1} />
      
      {/* Multi-order photon rings */}
      <group position={[0, -1.2, 0]}>
        {/* n=0: Base lensing ring (demagnified back side) */}
        <PhotonRingGR
          order={0}
          radius={ringRadius}
          thickness={0.06}
          baseIntensity={5.5}
          spin={spin}
          inclination={inclination}
          dopplerStrength={0.6}
          redshiftStrength={0.6}
          visible={phase >= 2}
        />
        
        {/* n=1: Primary photon ring (dominant feature) */}
        <PhotonRingGR
          order={1}
          radius={ringRadius}
          thickness={0.04}
          baseIntensity={7.0}
          spin={spin}
          inclination={inclination}
          dopplerStrength={0.7}
          redshiftStrength={0.7}
          visible={phase >= 2}
        />
        
        {/* n=2: Secondary photon ring (faint ghost) */}
        <PhotonRingGR
          order={2}
          radius={ringRadius}
          thickness={0.025}
          baseIntensity={3.0}
          spin={spin}
          inclination={inclination}
          dopplerStrength={0.5}
          redshiftStrength={0.5}
          visible={phase >= 2}
        />
      </group>
      
      {/* Post-processing */}
      <EffectComposer disableNormalPass>
        {/* Selective bloom for HDR ring */}
        <Bloom
          intensity={2.0}
          luminanceThreshold={0.95}
          luminanceSmoothing={0.1}
          mipmapBlur
        />
        
        {/* Film grain */}
        <Noise opacity={0.015} blendFunction={BlendFunction.OVERLAY} />
        
        {/* Vignette */}
        <Vignette offset={0.15} darkness={1.3} />
      </EffectComposer>
    </>
  );
}

// ============================================================
// ENTRANCE SEQUENCE HOOK
// ============================================================

function useEntranceSequence() {
  const [phase, setPhase] = useState(0);
  
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),   // Stars fade in
      setTimeout(() => setPhase(2), 1500),  // Rings appear
    ];
    
    return () => timers.forEach(clearTimeout);
  }, []);
  
  return phase;
}

// ============================================================
// TITLE OVERLAY
// ============================================================

function TitleOverlay({ phase, onEnter }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div style={styles.overlay}>
      <div style={{
        ...styles.title,
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? 'translateY(0)' : 'translateY(20px)',
      }}>
        <h1 style={styles.mainTitle}>AEO TRIVECTOR</h1>
        <p style={styles.subtitle}>ATTRACTOR ARCHITECTURE</p>
      </div>
      
      {phase >= 2 && (
        <button
          style={{
            ...styles.enterButton,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={onEnter}
        >
          ENTER
        </button>
      )}
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function BlackHoleEntranceGR({ onEnter }) {
  const phase = useEntranceSequence();
  
  const handleEnter = useCallback(() => {
    if (onEnter) {
      onEnter();
    }
  }, [onEnter]);
  
  return (
    <div style={styles.container}>
      <Canvas
        camera={{ position: [0, 2, 12], fov: 50, near: 0.1, far: 5000 }}
        dpr={[1, 1.6]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.NoToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        style={styles.canvas}
      >
        <color attach="background" args={['#000000']} />
        <Scene phase={phase} />
      </Canvas>
      
      <TitleOverlay phase={phase} onEnter={handleEnter} />
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 10,
  },
  title: {
    textAlign: 'center',
    transition: 'all 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  mainTitle: {
    fontSize: 'clamp(2.5rem, 8vw, 6rem)',
    fontWeight: 300,
    letterSpacing: '0.3em',
    color: '#ffffff',
    margin: 0,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  subtitle: {
    fontSize: 'clamp(0.8rem, 2vw, 1.2rem)',
    fontWeight: 300,
    letterSpacing: '0.5em',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: '1rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  enterButton: {
    marginTop: '4rem',
    padding: '1rem 3rem',
    fontSize: '1rem',
    fontWeight: 300,
    letterSpacing: '0.3em',
    color: '#ffffff',
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    cursor: 'pointer',
    pointerEvents: 'auto',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
};
