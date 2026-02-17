/**
 * GravitationalLensing.jsx
 * 
 * Screen-space gravitational lensing shader for starfield distortion.
 * Implements Schwarzschild deflection angle formula:
 * α(b) ≈ 4GM/c²b + 15πGM²/c⁴b²
 * 
 * This creates Einstein ring effects and visible spacetime curvature
 * without expensive full ray tracing.
 * 
 * Based on:
 * - Schwarzschild metric deflection formula
 * - Screen-space approximation for real-time rendering
 */

'use client';

import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// ============================================================
// GLSL SHADERS
// ============================================================

const lensingVertexShader = `
precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const lensingFragmentShader = `
precision highp float;

varying vec2 vUv;

uniform vec2 uCenter;        // Lens center in UV space [0,1]
uniform float uMass;         // Schwarzschild mass parameter
uniform float uStrength;     // Overall lensing strength multiplier
uniform sampler2D uStarfield; // Background starfield texture

// Schwarzschild deflection angle
// α(b) ≈ 4M/b + 15πM²/b²
float deflectionAngle(float b) {
  if (b < 0.001) return 0.0; // Avoid singularity
  
  float term1 = 4.0 * uMass / b;
  float term2 = 15.0 * 3.14159 * uMass * uMass / (b * b);
  
  return (term1 + term2) * uStrength;
}

void main() {
  vec2 uv = vUv;
  
  // Compute distance from lens center
  vec2 toCenter = uv - uCenter;
  float r = length(toCenter);
  
  if (r < 0.001) {
    // At center, no distortion
    gl_FragColor = texture2D(uStarfield, uv);
    return;
  }
  
  // Compute deflection
  float alpha = deflectionAngle(r);
  
  // Apply radial deflection (pull toward center)
  vec2 deflection = normalize(toCenter) * alpha;
  vec2 distortedUV = uv - deflection;
  
  // Sample starfield at distorted coordinates
  gl_FragColor = texture2D(uStarfield, distortedUV);
}
`;

// ============================================================
// SHADER MATERIAL
// ============================================================

const LensingMaterial = shaderMaterial(
  {
    uCenter: new THREE.Vector2(0.5, 0.5),
    uMass: 0.012,
    uStrength: 1.0,
    uStarfield: null,
  },
  lensingVertexShader,
  lensingFragmentShader
);

extend({ LensingMaterial });

// ============================================================
// GRAVITATIONAL LENSING COMPONENT
// ============================================================

export default function GravitationalLensing({
  center = [0.5, 0.5],
  mass = 0.012,
  strength = 1.0,
  starfieldTexture = null,
  visible = true,
}) {
  const meshRef = useRef(null);
  const matRef = useRef(null);

  // Create plane geometry (fullscreen quad)
  const geometry = useMemo(
    () => new THREE.PlaneGeometry(30, 30),
    []
  );

  useFrame(() => {
    if (matRef.current && starfieldTexture) {
      matRef.current.uStarfield = starfieldTexture;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={[0, 0, -5]}
      visible={visible}
    >
      {/* @ts-ignore */}
      <lensingMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        uCenter={new THREE.Vector2(center[0], center[1])}
        uMass={mass}
        uStrength={strength}
      />
    </mesh>
  );
}
