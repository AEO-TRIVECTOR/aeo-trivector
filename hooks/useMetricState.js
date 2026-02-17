'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

/**
 * Unified Spacetime Metric State
 * 
 * Single source of truth for all gravitational components.
 * Ensures continuous, coherent evolution across photon rings,
 * accretion disk, camera, and UI interactions.
 * 
 * Physics: Represents slowly-evolving Kerr metric parameters
 * observed from multiple worldlines simultaneously.
 */
export function useMetricState(config = {}) {
  const {
    initialSpin = 0.7,
    initialMass = 1.0,
    initialInclination = Math.PI * 0.42,
    
    // Evolution timescales (seconds)
    metricPeriod = 180.0,      // ultra-slow spacetime evolution
    orbitalPeriod = 60.0,       // precession period
    breathingPeriod = 45.0,     // time dilation breathing
    turbulencePeriods = [20, 35, 60], // multi-scale turbulence
  } = config

  const state = useRef({
    // Core Kerr metric parameters
    spin: initialSpin,                    // a/M ∈ [0, 1)
    mass: initialMass,                    // M in geometric units
    inclination: initialInclination,      // observer viewing angle
    
    // Continuous phase evolution
    metricPhase: 0,                       // Φ_metric ∈ [0, 2π)
    orbitalPhase: 0,                      // Φ_orbital ∈ [0, 2π)
    
    // Global modulation
    globalGlow: 1.0,                      // brightness breathing [0.92, 1.08]
    globalRedshift: 1.0,                  // color temperature shift
    
    // Shared turbulence seeds (MRI cascade)
    turbulenceSeed1: 0,   // large-scale (spiral waves)
    turbulenceSeed2: 0,   // medium-scale (MRI cells)
    turbulenceSeed3: 0,   // small-scale (micro-flicker)
    
    // Camera-metric coupling
    cameraOffset: { x: 0, y: 0 },
    
    // Interaction state
    userProximity: 0,     // [0, 1] for button hover
    timeScale: 1.0,       // global time dilation factor
  })

  useFrame((threeState, delta) => {
    const t = threeState.clock.elapsedTime * state.current.timeScale
    
    // Ultra-slow metric evolution (precession of spin axis)
    state.current.metricPhase = (t * (2 * Math.PI / metricPeriod)) % (2 * Math.PI)
    
    // Medium-speed orbital precession (hotspot rotation)
    state.current.orbitalPhase = (t * (2 * Math.PI / orbitalPeriod)) % (2 * Math.PI)
    
    // Time-dilation breathing (global brightness modulation)
    const breathingPhase = t * (2 * Math.PI / breathingPeriod)
    state.current.globalGlow = 1.0 + 0.08 * Math.sin(breathingPhase)
    
    // Gravitational redshift oscillation (very slow)
    state.current.globalRedshift = 1.0 + 0.03 * Math.sin(t * (2 * Math.PI / 240.0))
    
    // Multi-scale turbulence cascade (MRI-driven)
    state.current.turbulenceSeed1 = t * (2 * Math.PI / turbulencePeriods[0])
    state.current.turbulenceSeed2 = t * (2 * Math.PI / turbulencePeriods[1])
    state.current.turbulenceSeed3 = t * (2 * Math.PI / turbulencePeriods[2])
    
    // Camera-metric coupling (observer worldline drift)
    const cameraPhase = state.current.metricPhase * 0.3
    state.current.cameraOffset.x = 0.15 * Math.sin(cameraPhase)
    state.current.cameraOffset.y = 0.08 * Math.cos(cameraPhase * 1.3)
  })

  // API for external modification
  const api = {
    // Read current state
    get: () => state.current,
    
    // Temporarily boost intensity (for interactions)
    boost: (amount = 0.15, duration = 800) => {
      const originalGlow = state.current.globalGlow
      state.current.globalGlow *= (1.0 + amount)
      
      setTimeout(() => {
        state.current.globalGlow = originalGlow
      }, duration)
    },
    
    // Slow down time (for dramatic moments)
    dilate: (factor = 0.3, duration = 2000) => {
      const originalScale = state.current.timeScale
      state.current.timeScale = factor
      
      setTimeout(() => {
        state.current.timeScale = originalScale
      }, duration)
    },
    
    // Update metric parameters smoothly
    updateSpin: (newSpin, transitionTime = 5000) => {
      // TODO: implement smooth interpolation
      state.current.spin = newSpin
    },
    
    updateInclination: (newInclination, transitionTime = 3000) => {
      state.current.inclination = newInclination
    },
  }

  return { state, api }
}
