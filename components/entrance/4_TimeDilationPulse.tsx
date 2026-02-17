// ============================================================
// TIME DILATION PULSE
// Make the entire structure breathe with time dilation
// Replace the useFrame in your PhotonRing component
// ============================================================

// In PhotonRing component, replace useFrame with:

useFrame((state) => {
  if (!materialRef.current) return
  const t = state.clock.elapsedTime

  materialRef.current.uniforms.uTime.value = t

  // Slow gravitational time dilation pulse (40-60s period)
  const timeDilationCycle = 45.0  // seconds
  const dilationPulse = 1.0 + 0.09 * Math.sin(t * (2 * Math.PI / timeDilationCycle))

  materialRef.current.uniforms.uIntensity.value = 26 * dilationPulse
})

// ═══ ALSO ADD TO HaloRing ═══
// In HaloRing component useFrame:

useFrame((state) => {
  if (!materialRef.current) return
  const t = state.clock.elapsedTime

  materialRef.current.uniforms.uTime.value = t

  // Sync with main ring
  const dilationPulse = 1.0 + 0.09 * Math.sin(t * (2 * Math.PI / 45.0))
  materialRef.current.uniforms.uIntensity.value = 1.2 * dilationPulse
})
