'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { photonRingVertexShader, photonRingFragmentShader } from './PhotonRing.glsl.js'

/**
 * Unified PhotonRing Component
 * 
 * Consumes shared metric state to ensure synchronized evolution
 * across all photon ring orders and observer views.
 */
export function PhotonRing({
  metricState,
  ringRadius = 6.5,
  rotation = [0, 0, 0],
  order = 0,
  intensity = 1.0,
  thickness = 0.12,
  observerInclinationOffset = 0,
  observerAzimuthOffset = 0,
  dopplerStrength = 0.6,
  redshiftStrength = 0.15,
  coreColor = [1.5, 1.2, 0.7],
  haloColor = [1.2, 0.9, 0.5],
  blueShiftColor = [1.3, 1.4, 1.8],
  redShiftColor = [1.6, 0.8, 0.4],
  visible = true,
}) {
  const meshRef = useRef()

  const uniforms = useMemo(() => ({
    // Metric state (synchronized)
    uTime: { value: 0 },
    uMetricPhase: { value: 0 },
    uOrbitalPhase: { value: 0 },
    uGlobalGlow: { value: 1.0 },
    uGlobalRedshift: { value: 1.0 },
    uTurbSeed1: { value: 0 },
    uTurbSeed2: { value: 0 },
    uTurbSeed3: { value: 0 },
    
    // Kerr metric parameters
    uSpin: { value: 0.7 },
    uInclination: { value: Math.PI * 0.42 },
    
    // Ring parameters
    uOrder: { value: order },
    uIntensity: { value: intensity },
    uThickness: { value: thickness },
    
    // Observer parameters
    uObserverInclinationOffset: { value: observerInclinationOffset },
    uObserverAzimuthOffset: { value: observerAzimuthOffset },
    
    // Doppler & redshift
    uDopplerStrength: { value: dopplerStrength },
    uRedshiftStrength: { value: redshiftStrength },
    
    // Colors (HDR)
    uCoreColor: { value: new THREE.Vector3(...coreColor) },
    uHaloColor: { value: new THREE.Vector3(...haloColor) },
    uBlueShiftColor: { value: new THREE.Vector3(...blueShiftColor) },
    uRedShiftColor: { value: new THREE.Vector3(...redShiftColor) },
  }), [order, intensity, thickness, observerInclinationOffset, observerAzimuthOffset, dopplerStrength, redshiftStrength])

  useFrame((state) => {
    if (!meshRef.current?.material) return
    if (!metricState || !metricState.current) return

    const mat = meshRef.current.material
    const metric = metricState.current

    // Update metric state uniforms (synchronized across all components)
    mat.uniforms.uTime.value = state.clock.elapsedTime
    mat.uniforms.uMetricPhase.value = metric.metricPhase
    mat.uniforms.uOrbitalPhase.value = metric.orbitalPhase
    mat.uniforms.uGlobalGlow.value = metric.globalGlow
    mat.uniforms.uGlobalRedshift.value = metric.globalRedshift
    mat.uniforms.uTurbSeed1.value = metric.turbulenceSeed1
    mat.uniforms.uTurbSeed2.value = metric.turbulenceSeed2
    mat.uniforms.uTurbSeed3.value = metric.turbulenceSeed3
    
    // Update Kerr parameters (can evolve slowly)
    mat.uniforms.uSpin.value = metric.spin
    mat.uniforms.uInclination.value = metric.inclination
  })

  return (
    <mesh ref={meshRef} rotation={rotation} visible={visible}>
      <torusGeometry args={[ringRadius, thickness * 0.15, 32, 300]} />
      <shaderMaterial
        vertexShader={photonRingVertexShader}
        fragmentShader={photonRingFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  )
}
