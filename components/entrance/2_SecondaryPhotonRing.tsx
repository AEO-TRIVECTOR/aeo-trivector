// ============================================================
// SECONDARY PHOTON RING COMPONENT
// Add to EventHorizon.tsx Scene
// Position: Inside <Scene> component, right after <HaloRing />
// ============================================================

function SecondaryPhotonRing({ radius = 5.9 }) {
  const matRef = useRef<THREE.ShaderMaterial>(null!)

  const vertShader = /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragShader = /* glsl */ `
    uniform float uTime;
    uniform float uIntensity;
    varying vec2 vUv;

    float hash(float n) { return fract(sin(n) * 43758.5453123); }
    float noise(float x) {
      float i = floor(x);
      float f = fract(x);
      return mix(hash(i), hash(i + 1.0), f * f * (3.0 - 2.0 * f));
    }

    void main() {
      float d = abs(vUv.y - 0.5) / 0.5;
      float ring = exp(-d * d * 450.0);    // ultra-thin

      float angle = vUv.x * 6.28318;
      float flicker = 0.82 + 0.18 * noise(angle * 28.0 + uTime * 1.8);

      // Slight asymmetry (less than main ring)
      float asymmetry = 1.0 + 0.15 * sin(angle * 0.5 + uTime * 0.12);

      vec3 color = vec3(1.4, 1.25, 1.05) * uIntensity * ring * flicker * asymmetry;
      float alpha = ring * 0.38 * flicker * asymmetry;

      gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
    }
  `

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh rotation={[Math.PI * 0.48, 0, 0.05]}>
      <torusGeometry args={[radius, 0.005, 12, 512]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertShader}
        fragmentShader={fragShader}
        uniforms={{
          uTime: { value: 0 },
          uIntensity: { value: 0.5 },
        }}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

// USAGE: Add to Scene component
// <SecondaryPhotonRing radius={5.9} />
