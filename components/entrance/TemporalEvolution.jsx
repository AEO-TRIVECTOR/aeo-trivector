// Temporal Evolution — Extremely slow breathing (30-60s cycles)
// Movement slow enough becomes reality, not animation

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// Hook that provides temporal evolution values
export function useTemporalEvolution() {
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta;
  });

  const getEvolution = () => {
    const t = timeRef.current;

    // Multiple overlapping cycles create complex, organic breathing
    // Primary cycle: 45 seconds (matches existing ring pulse)
    const primary = Math.sin(t * (2 * Math.PI / 45.0));

    // Secondary cycle: 60 seconds (slower, deeper breath)
    const secondary = Math.sin(t * (2 * Math.PI / 60.0));

    // Tertiary cycle: 30 seconds (faster, subtle flutter)
    const tertiary = Math.sin(t * (2 * Math.PI / 30.0));

    // Combine cycles with different weights
    const brightness = 1.0 + primary * 0.025 + secondary * 0.015 + tertiary * 0.008;

    // Arc drift (extremely slow positional shift)
    const arcDriftX = Math.sin(t * (2 * Math.PI / 52.0)) * 0.03;
    const arcDriftY = Math.cos(t * (2 * Math.PI / 47.0)) * 0.02;

    // Star movement (imperceptible but present)
    const starDrift = Math.sin(t * (2 * Math.PI / 90.0)) * 0.002;

    // Photon ring thickness variation (2-3% change)
    const thicknessVariation = 1.0 + Math.sin(t * (2 * Math.PI / 38.0)) * 0.025;

    // Accretion flicker (chaos from photon orbit instability)
    const flicker = 1.0 + Math.sin(t * 3.7) * 0.012 + Math.sin(t * 5.3) * 0.008;

    return {
      brightness,
      arcDriftX,
      arcDriftY,
      starDrift,
      thicknessVariation,
      flicker,
      time: t,
    };
  };

  return getEvolution;
}

// Component that applies temporal evolution to children
export function TemporalEvolutionGroup({ children, enabled = true }) {
  const groupRef = useRef();
  const getEvolution = useTemporalEvolution();

  useFrame(() => {
    if (!enabled || !groupRef.current) return;

    const evolution = getEvolution();

    // Apply subtle brightness modulation
    // This affects the entire scene subtly
    groupRef.current.scale.setScalar(evolution.brightness);

    // Apply arc drift
    groupRef.current.position.x = evolution.arcDriftX;
    groupRef.current.position.y = evolution.arcDriftY;
  });

  return <group ref={groupRef}>{children}</group>;
}

// Specialized component for ring breathing
export function RingBreathing({ ringRef, enabled = true }) {
  const getEvolution = useTemporalEvolution();

  useFrame(() => {
    if (!enabled || !ringRef.current) return;

    const evolution = getEvolution();

    // Apply thickness variation to ring material
    if (ringRef.current.material && ringRef.current.material.uniforms) {
      const uniforms = ringRef.current.material.uniforms;
      
      // Modulate shimmer amplitude (breathing effect)
      if (uniforms.uShimmerAmp) {
        uniforms.uShimmerAmp.value = 0.1 * evolution.thicknessVariation;
      }

      // Modulate intensity (flicker from accretion chaos)
      if (uniforms.uIntensity) {
        uniforms.uIntensity.value = 1.0 * evolution.flicker;
      }
    }

    // Subtle scale breathing (2-3% size variation)
    ringRef.current.scale.setScalar(evolution.thicknessVariation);
  });

  return null;
}

// Specialized component for starfield evolution
export function StarfieldEvolution({ starfieldRef, enabled = true }) {
  const getEvolution = useTemporalEvolution();

  useFrame(() => {
    if (!enabled || !starfieldRef.current) return;

    const evolution = getEvolution();

    // Imperceptible star rotation (90-second period)
    starfieldRef.current.rotation.z = evolution.starDrift;

    // Subtle brightness modulation
    if (starfieldRef.current.material) {
      starfieldRef.current.material.opacity = 0.6 + evolution.brightness * 0.05;
    }
  });

  return null;
}
