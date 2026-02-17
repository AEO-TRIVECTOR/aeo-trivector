// ============================================================
// UPDATED POST-PROCESSING STACK
// Replace your PostProcessing component
// ============================================================

function PostProcessing() {
  return (
    <EffectComposer disableNormalPass multisampling={0}>
      {/* TIGHT CORE BLOOM */}
      <Bloom
        intensity={2.8}
        luminanceThreshold={0.16}
        luminanceSmoothing={0.35}
        mipmapBlur
        radius={0.75}
        levels={8}
      />
      {/* WIDE ATMOSPHERIC BLOOM */}
      <Bloom
        intensity={0.95}
        luminanceThreshold={0.42}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={1.3}
        levels={6}
      />
      {/* CHROMATIC ABERRATION (gravitational lensing wavelength split) */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0042, 0.0026)}
        radialModulation
        modulationOffset={0.25}
      />
      {/* VIGNETTE */}
      <Vignette
        offset={0.28}
        darkness={0.89}
        blendFunction={BlendFunction.NORMAL}
      />
      {/* FILM GRAIN */}
      <Noise
        opacity={0.045}
        blendFunction={BlendFunction.OVERLAY}
      />
    </EffectComposer>
  )
}
