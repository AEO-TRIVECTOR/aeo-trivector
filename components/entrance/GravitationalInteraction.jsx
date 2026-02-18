// Gravitational Interaction — Mouse/touch creates resistance (not following)
// The singularity has mass and resists cursor movement

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function GravitationalInteraction({ children, enabled = true }) {
  const groupRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const { viewport } = useThree();

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e) => {
      // Normalize to [-1, 1]
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseRef.current.targetX = (touch.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.targetY = -(touch.clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [enabled]);

  useFrame(() => {
    if (!enabled || !groupRef.current) return;

    const mouse = mouseRef.current;

    // Smooth interpolation (creates inertia/resistance)
    const lerp = 0.015; // Very slow response = massive inertia
    mouse.x += (mouse.targetX - mouse.x) * lerp;
    mouse.y += (mouse.targetY - mouse.y) * lerp;

    // Apply subtle rotation to starfield (not the rings - they resist more)
    // Maximum rotation: 0.8 degrees (0.014 radians)
    const maxRotation = 0.014;
    groupRef.current.rotation.y = mouse.x * maxRotation;
    groupRef.current.rotation.x = mouse.y * maxRotation * 0.6;

    // Subtle position shift (parallax effect)
    const maxShift = 0.15;
    groupRef.current.position.x = mouse.x * maxShift;
    groupRef.current.position.y = mouse.y * maxShift * 0.5;
  });

  return <group ref={groupRef}>{children}</group>;
}

// Ring-specific interaction (even more resistance)
export function RingGravitationalResponse({ ringGroupRef, enabled = true }) {
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseRef.current.targetX = (touch.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.targetY = -(touch.clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [enabled]);

  useFrame(() => {
    if (!enabled || !ringGroupRef.current) return;

    const mouse = mouseRef.current;

    // Even slower interpolation for rings (massive object)
    const lerp = 0.008; // Half the speed of starfield
    mouse.x += (mouse.targetX - mouse.x) * lerp;
    mouse.y += (mouse.targetY - mouse.y) * lerp;

    // Rings shift OPPOSITE to cursor (resistance, not following)
    const maxShift = 0.08;
    ringGroupRef.current.position.x = -mouse.x * maxShift;
    ringGroupRef.current.position.y = -mouse.y * maxShift * 0.4;

    // Subtle counter-rotation (resisting the pull)
    const maxRotation = 0.006;
    ringGroupRef.current.rotation.y = -mouse.x * maxRotation;
  });

  return null;
}
