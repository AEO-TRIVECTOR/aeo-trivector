// ============================================================
// ENHANCED DARK VOID WITH INDIGO DEPTH
// Replace your DarkVoid component entirely
// ============================================================

function DarkVoid({ radius = 5 }) {
  const voidFragShader = /* glsl */ `
    varying vec2 vUv;

    void main() {
      vec2 center = vec2(0.5, 0.48);
      float aspect = 1.777;  // 16:9 aspect
      vec2 delta = vUv - center;
      delta.x *= aspect;
      float dist = length(delta);

      float horizonRadius = 0.82;

      // ═══ INNER EVENT HORIZON ═══
      float innerVoid = 1.0 - smoothstep(0.0, horizonRadius, dist);

      // ═══ INDIGO DEPTH SINK (subtle perception of infinite depth) ═══
      float innerDepth = smoothstep(horizonRadius, 0.0, dist);
      float depthFalloff = pow(innerDepth, 3.5);

      // Faint indigo-violet tint suggesting infinite recession
      vec3 depthColor = vec3(0.06, 0.08, 0.14) * depthFalloff;

      // Add subtle radial gradient toward center
      float centerPull = pow(innerDepth, 2.0) * 0.15;
      depthColor += vec3(0.03, 0.04, 0.09) * centerPull;

      // ═══ BELOW-RING GRADIENT ═══
      float belowRing = smoothstep(0.35, 0.55, 1.0 - vUv.y);
      float gradient = belowRing * 0.92;

      float darkness = max(innerVoid * 0.98, gradient);

      gl_FragColor = vec4(depthColor, darkness);
    }
  `

  const voidVertShader = /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  return (
    <mesh position={[0, -0.3, -0.1]}>
      <planeGeometry args={[radius * 4, radius * 4]} />
      <shaderMaterial
        vertexShader={voidVertShader}
        fragmentShader={voidFragShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}
