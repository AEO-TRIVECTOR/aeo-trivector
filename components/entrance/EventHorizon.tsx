// ============================================================
// AEO TRIVECTOR — Event Horizon Entrance Page
// "The Mathematics of Mind" — Attractor Architecture
// ============================================================
// File: src/components/EventHorizon.tsx
// Stack: React Three Fiber + @react-three/postprocessing + drei
// ============================================================

import React, { useRef, useMemo, useCallback, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'
import * as THREE from 'three'
import { ShadowMask } from './ShadowMask'
import { SecondaryPhotonRing } from './SecondaryPhotonRing'
import { InfallingParticles } from './InfallingParticles'

// ============================================================
// 1. CUSTOM SHADER: Gravitational Lensing Distortion
//    Screen-space displacement simulating spacetime curvature
// ============================================================

const GravLensVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const GravLensFragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uStrength;
  uniform vec2 uCenter;
  uniform float uRadius;

  void main() {
    vec2 uv = vUv;
    vec2 delta = uv - uCenter;
    float dist = length(delta);
    float normDist = dist / uRadius;

    // Gravitational lensing: displacement falls off as 1/r
    // with a smooth cutoff at the event horizon
    float lensing = 0.0;
    if (normDist > 0.3 && normDist < 2.0) {
      // Einstein ring deflection approximation
      lensing = uStrength / (normDist * normDist);
      // Smooth edges
      lensing *= smoothstep(0.3, 0.5, normDist);
      lensing *= smoothstep(2.0, 1.5, normDist);
    }

    // Radial displacement toward center
    vec2 displacement = normalize(delta) * lensing;
    gl_FragColor = vec4(displacement, 0.0, 1.0);
  }
`

// ============================================================
// 2. PHOTON RING — The "line of impossible brightness"
//    Custom shader with Doppler beaming, chromatic edge split,
//    and time-varying shimmer
// ============================================================

const PhotonRingVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying float vAngle;
  attribute float angle;

  void main() {
    vUv = uv;
    vAngle = angle;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const PhotonRingFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform float uDopplerStrength;
  uniform float uShimmerSpeed;
  uniform float uShimmerAmount;
  uniform vec3 uCoreColor;
  uniform vec3 uHaloColor;
  uniform float uThickness;

  varying vec2 vUv;
  varying float vAngle;

  // Simplex-style noise for shimmer
  float hash(float n) { return fract(sin(n) * 43758.5453123); }
  float noise(float x) {
    float i = floor(x);
    float f = fract(x);
    float a = hash(i);
    float b = hash(i + 1.0);
    return mix(a, b, f * f * (3.0 - 2.0 * f));
  }

  void main() {
    // Ring cross-section: distance from center line of the ring tube
    float d = abs(vUv.y - 0.5) / 0.5;

    // Sharp inner core (knife-edge)
    float core = exp(-d * d * 200.0 / (uThickness * uThickness));

    // Broader halo
    float halo = exp(-d * d * 20.0 / (uThickness * uThickness));

    // Doppler beaming: brighter at top (angle ~PI/2), dimmer at bottom
    // Using angle from custom attribute
    float dopplerAngle = vUv.x * 6.28318;
    float doppler = 1.0 + uDopplerStrength * sin(dopplerAngle);
    doppler = pow(doppler, 3.0); // relativistic beaming is cubed

    // Time-varying shimmer (irregular, not uniform)
    float shimmer = 1.0 + uShimmerAmount * (
      noise(dopplerAngle * 3.0 + uTime * uShimmerSpeed) * 0.6 +
      noise(dopplerAngle * 7.0 - uTime * uShimmerSpeed * 0.7) * 0.4
    );

    // Turbulent hotspots (accretion turbulence)
    float hotspot1 = exp(-pow(dopplerAngle - (uTime * 0.25 + 1.0), 2.0) / 0.04);
    float hotspot2 = exp(-pow(dopplerAngle - (-uTime * 0.18 + 3.6), 2.0) / 0.08);
    float hotspot3 = exp(-pow(dopplerAngle - (uTime * 0.33 + 5.2), 2.0) / 0.06);
    float hotspotNoise = noise(dopplerAngle * 15.0 + uTime * 0.9);
    float hotspot = (hotspot1 * 1.7 + hotspot2 * 1.2 + hotspot3 * 1.4) * (0.7 + 0.3 * hotspotNoise);
    float hotspotBoost = 1.0 + 0.45 * hotspot;

    // Color-shifted Doppler (blue→white→gold)
    float side = clamp(doppler, 0.0, 10.0);
    side = (side - 1.0) / (uDopplerStrength * 3.0 + 0.0001);
    side = clamp(side, -1.0, 1.0);
    vec3 blueTint = vec3(0.8, 0.9, 1.3);
    vec3 goldTint = vec3(1.3, 1.05, 0.7);
    float t = (side + 1.0) * 0.5;
    vec3 tempTint = mix(goldTint, blueTint, t);

    // Combine
    vec3 coreColor = (uCoreColor * tempTint) * core * uIntensity * 3.0;
    vec3 haloColor = (uHaloColor * tempTint) * halo * uIntensity * 0.8;
    vec3 finalColor = (coreColor + haloColor) * doppler * shimmer * hotspotBoost;

    // Alpha
    float alpha = max(core, halo * 0.6) * doppler * shimmer;
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, alpha);
  }
`

// ============================================================
// 3. STAR FIELD with gravitational redshift + time dilation
// ============================================================

function StarField({ count = 500, ringCenter = [0, 0, 0], ringRadius = 5 }) {
  const ref = useRef<THREE.Points>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  const { positions, sizes, opacities, colors, distances } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const opacities = new Float32Array(count)
    const colors = new Float32Array(count * 3)
    const distances = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Distribute in a large sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 8 + Math.random() * 40

      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = -5 + r * Math.cos(phi) * 0.3 // flatten z for screen depth

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // Distance from ring center for redshift calc
      const dist = Math.sqrt(
        (x - ringCenter[0]) ** 2 + (y - ringCenter[1]) ** 2
      )
      const normDist = dist / ringRadius
      distances[i] = normDist

      // Size distribution: 70% tiny, 25% medium, 5% bright
      const roll = Math.random()
      if (roll < 0.70) sizes[i] = 0.05 + Math.random() * 0.03
      else if (roll < 0.95) sizes[i] = 0.10 + Math.random() * 0.06
      else sizes[i] = 0.16 + Math.random() * 0.08

      // Opacity: stars near ring are dimmer (gravitational redshift)
      const redshiftDim = normDist < 2.0 ? 0.25 + 0.55 * (normDist / 2.0) : 0.85
      opacities[i] = redshiftDim * (0.6 + Math.random() * 0.4)

      // Color: blue-white far away, orange-shifted near ring
      if (normDist < 1.5) {
        // Gravitational redshift: orange tint
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 0.7 + Math.random() * 0.2
        colors[i * 3 + 2] = 0.4 + Math.random() * 0.2
      } else {
        // Normal: blue-white
        colors[i * 3] = 0.8 + Math.random() * 0.2
        colors[i * 3 + 1] = 0.85 + Math.random() * 0.15
        colors[i * 3 + 2] = 1.0
      }
    }

    return { positions, sizes, opacities, colors, distances }
  }, [count, ringCenter, ringRadius])

  // Star shader with time-dilation twinkle
  const starVertexShader = /* glsl */ `
    attribute float aSize;
    attribute float aOpacity;
    attribute float aDistance;
    attribute vec3 aColor;
    varying float vOpacity;
    varying vec3 vColor;
    uniform float uTime;
    uniform float uPixelRatio;

    float hash(float n) { return fract(sin(n) * 43758.5453123); }

    void main() {
      vColor = aColor;

      // Time dilation: stars near ring twinkle slower
      float timeDilation = aDistance < 2.0 ? 0.3 : 1.0;
      float twinkle = 0.85 + 0.15 * sin(uTime * timeDilation * (1.0 + hash(aSize * 100.0)) + hash(aSize * 200.0) * 6.28);

      vOpacity = aOpacity * twinkle;

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = aSize * uPixelRatio * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `

  const starFragmentShader = /* glsl */ `
    varying float vOpacity;
    varying vec3 vColor;

    void main() {
      // Soft circular point
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      if (dist > 0.5) discard;

      float alpha = smoothstep(0.5, 0.1, dist) * vOpacity;
      gl_FragColor = vec4(vColor, alpha);
    }
  `

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  // Create geometry with BufferGeometry API
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1))
    geo.setAttribute('aDistance', new THREE.BufferAttribute(distances, 1))
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [positions, sizes, opacities, distances, colors])

  return (
    <points ref={ref} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ============================================================
// 4. PHOTON RING MESH — Torus geometry with custom shader
// ============================================================

function PhotonRing({
  radius = 5,
  tubeRadius = 0.018,
  segments = 256,
  intensity = 20,
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  // Create torus with angle attribute
  const geometry = useMemo(() => {
    const geo = new THREE.TorusGeometry(radius, tubeRadius, 16, segments)
    return geo
  }, [radius, tubeRadius, segments])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[Math.PI * 0.35, 0, 0.05]} position={[0, -0.5, 0]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={PhotonRingVertexShader}
        fragmentShader={PhotonRingFragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uIntensity: { value: 8 },  // Reduced from 25 - let bloom do the work
          uDopplerStrength: { value: 0.75 },  // Stronger asymmetry (was 0.45)
          uShimmerSpeed: { value: 0.7 },
          uShimmerAmount: { value: 0.22 },
          uCoreColor: { value: new THREE.Color(6.0, 5.8, 5.5) },  // HDR white
          uHaloColor: { value: new THREE.Color(2.7, 1.9, 0.65) },  // golden halo
          uThickness: { value: 1.0 },
        }}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

// ============================================================
// 5. SECONDARY HALO RING — Broader, dimmer, orange-gold
// ============================================================

function HaloRing({ radius = 5, tubeRadius = 0.06 }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  const haloFragShader = /* glsl */ `
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
      float glow = exp(-d * d * 8.0);

      // Doppler
      float angle = vUv.x * 6.28318;
      float doppler = 1.0 + 0.35 * sin(angle);
      doppler = pow(doppler, 2.5);

      float shimmer = 1.0 + 0.1 * noise(angle * 5.0 + uTime * 0.5);

      vec3 color = vec3(1.5, 0.9, 0.3) * glow * uIntensity * doppler * shimmer;
      float alpha = glow * 0.6 * doppler * shimmer;

      gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
    }
  `

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh rotation={[Math.PI * 0.35, 0, 0.05]} position={[0, -0.5, 0]}>
      <torusGeometry args={[radius, tubeRadius, 16, 256]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={PhotonRingVertexShader}
        fragmentShader={haloFragShader}
        uniforms={{
          uTime: { value: 0 },
          uIntensity: { value: 1.2 },
        }}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

// ============================================================
// 6. INNER CORONA — Atmospheric scatter above ring
// ============================================================

function InnerCorona({ radius = 5 }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  const coronaFragShader = /* glsl */ `
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float dist = length(vUv - center) * 2.0;

      // Corona glow concentrated near ring radius
      float ringDist = abs(dist - 0.85);
      float corona = exp(-ringDist * ringDist * 60.0);

      // Stronger above (y > center), weaker below
      float verticalBias = smoothstep(0.3, 0.6, vUv.y);

      // Orange-gold atmospheric scatter
      vec3 color = vec3(1.2, 0.6, 0.15) * corona * verticalBias * 0.7;

      // Outer diffuse glow
      float outerGlow = exp(-ringDist * ringDist * 10.0) * 0.3;
      color += vec3(0.8, 0.5, 0.15) * outerGlow * verticalBias;

      float alpha = (corona * verticalBias * 0.5 + outerGlow * 0.2);

      gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
    }
  `

  const coronaVertShader = /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh position={[0, 0, -0.5]}>
      <planeGeometry args={[radius * 3, radius * 3]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={coronaVertShader}
        fragmentShader={coronaFragShader}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

// ============================================================
// 7. GRAVITATIONAL LENSING — Screen-space star distortion
// ============================================================

function GravitationalLensing() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  // This is a screen-space effect applied as a transparent overlay
  const lensVertShader = /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  // Visual-only: distorts nothing but adds a subtle "heat haze"
  // near the ring to suggest spacetime curvature
  const lensFragShader = /* glsl */ `
    uniform float uTime;
    uniform vec2 uResolution;
    varying vec2 vUv;

    void main() {
      vec2 center = vec2(0.5, 0.45);
      float dist = length(vUv - center);
      float ringRadius = 0.35;
      float ringDist = abs(dist - ringRadius);

      // Subtle refraction-like brightness boost near ring
      float lensBoost = exp(-ringDist * ringDist * 400.0) * 0.15;

      // Very subtle time-varying distortion hint
      float wave = sin(dist * 40.0 - uTime * 0.3) * 0.02;
      lensBoost += wave * exp(-ringDist * ringDist * 200.0) * 0.05;

      gl_FragColor = vec4(vec3(lensBoost), lensBoost);
    }
  `

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh ref={meshRef} position={[0, -0.3, 0.5]}>
      <planeGeometry args={[20, 20]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={lensVertShader}
        fragmentShader={lensFragShader}
        uniforms={{
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

// ============================================================
// 8. DARK VOID — Exponential gradient below horizon
// ============================================================

function DarkVoid({ radius = 5 }) {
  const voidFragShader = /* glsl */ `
    varying vec2 vUv;

    void main() {
      vec2 center = vec2(0.5, 0.48);
      float dist = length(vUv - center) * 2.0;

      // Inside the ring: absolute black
      float innerVoid = 1.0 - smoothstep(0.0, 0.82, dist);

      // Below the ring: exponential darkening
      float belowRing = smoothstep(0.35, 0.55, 1.0 - vUv.y);
      float gradient = belowRing * 0.85;

      float darkness = max(innerVoid * 0.98, gradient);

      // Pure black, no color
      gl_FragColor = vec4(0.0, 0.0, 0.0, darkness);
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

// ============================================================
// 9. DEPTH FOG PLANE — Deep indigo background
// ============================================================

function DepthFog() {
  return (
    <mesh position={[0, 0, -25]}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial color="#050510" transparent opacity={0.4} />
    </mesh>
  )
}

// ============================================================
// 10. POST-PROCESSING STACK
// ============================================================

function PostProcessing() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={1.2}
        luminanceThreshold={0.22}
        luminanceSmoothing={0.4}
        mipmapBlur
        radius={0.62}
        levels={8}
      />
      <Vignette
        offset={0.3}
        darkness={0.85}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise
        opacity={0.04}
        blendFunction={BlendFunction.OVERLAY}
      />
    </EffectComposer>
  )
}

// ============================================================
// 11. SCENE COMPOSITION
// ============================================================

function Scene() {
  return (
    <>
      {/* Background: absolute black */}
      <color attach="background" args={['#000000']} />

      {/* No ambient light — ring IS the light source */}
      <ambientLight intensity={0.0} />

      {/* Star field: dimmed, varied, redshifted near ring */}
      <StarField count={450} ringCenter={[0, -0.3, 0]} ringRadius={5} />

      {/* Depth fog */}
      <DepthFog />

      {/* Dark void gradient */}
      <DarkVoid radius={5} />

      {/* Inner corona atmospheric scatter */}
      <InnerCorona radius={5} />

      {/* Gravitational lensing hint */}
      <GravitationalLensing />

      {/* Secondary halo ring (broad, golden) */}
      <HaloRing radius={5} tubeRadius={0.055} />

      {/* Infalling particles - matter spiraling into void */}
      <InfallingParticles count={10} radius={7} />

      {/* Secondary photon ring - ghost ring at 1.5× radius */}
      <SecondaryPhotonRing radius={7.4} />

      {/* Shadow mask - pure black disc at event horizon */}
      <ShadowMask radius={5} />

      {/* PRIMARY PHOTON RING — the singularity */}
      <PhotonRing radius={5} tubeRadius={0.015} segments={512} intensity={25} />

      {/* Post-processing stack */}
      <PostProcessing />
    </>
  )
}

// ============================================================
// 12. ENTRANCE OVERLAY — HTML/CSS Typography & Enter Button
// ============================================================

function EntranceOverlay({ onEnter }: { onEnter: () => void }) {
  const [hovered, setHovered] = useState(false)
  const [mouseNear, setMouseNear] = useState(false)

  return (
    <div style={styles.overlay}>
      {/* Title Block — positioned high, breathing room */}
      <div style={styles.titleBlock}>
        <h1 style={styles.title}>AEO TRIVECTOR</h1>
        <p style={styles.subtitle}>ATTRACTOR ARCHITECTURE</p>
      </div>

      {/* Enter Button — ritual threshold */}
      <div style={styles.enterBlock}>
        <button
          style={{
            ...styles.enterButton,
            ...(hovered ? styles.enterButtonHover : {}),
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={onEnter}
        >
          <span style={styles.enterLabel}>ENTER</span>
          <span style={styles.enterText}>CROSS THE EVENT HORIZON</span>
        </button>
      </div>
    </div>
  )
}

// ============================================================
// 13. CSS-IN-JS STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: '#000000',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    pointerEvents: 'none',
    zIndex: 10,
    padding: '8vh 0 12vh',
  },
  titleBlock: {
    textAlign: 'center',
    // Positioned in top ~18% of viewport
    marginTop: '2vh',
  },
  title: {
    fontFamily: '"Cormorant Garamond", "Garamond", serif',
    fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
    fontWeight: 300,
    letterSpacing: '0.18em',
    color: 'rgba(255, 255, 255, 0.88)',
    margin: 0,
    lineHeight: 1.1,
    // Subtle text shadow for depth
    textShadow: '0 0 40px rgba(255, 200, 100, 0.08)',
  },
  subtitle: {
    fontFamily: '"Cormorant Garamond", "Garamond", serif',
    fontSize: 'clamp(0.6rem, 1.2vw, 0.95rem)',
    fontWeight: 300,
    letterSpacing: '0.30em',
    color: 'rgba(255, 255, 255, 0.50)',
    margin: 0,
    marginTop: '2.5vh',
    lineHeight: 1,
  },
  enterBlock: {
    pointerEvents: 'auto',
  },
  enterButton: {
    background: 'transparent',
    border: '0.5px solid rgba(255, 255, 255, 0.35)',
    borderRadius: 0,
    padding: '1.4rem 3.5rem',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
    position: 'relative',
    // Invisible outer glow on default
    boxShadow: '0 0 0px rgba(255, 255, 255, 0)',
  },
  enterButtonHover: {
    border: '0.5px solid rgba(255, 255, 255, 0.9)',
    boxShadow: '0 0 30px rgba(255, 200, 120, 0.15), inset 0 0 20px rgba(255, 200, 120, 0.05)',
    padding: '1.6rem 4rem',
  },
  enterLabel: {
    fontFamily: '"Cormorant Garamond", "Garamond", serif',
    fontSize: '0.6rem',
    letterSpacing: '0.35em',
    color: 'rgba(180, 160, 120, 0.7)',
    fontWeight: 300,
  },
  enterText: {
    fontFamily: '"Cormorant Garamond", "Garamond", serif',
    fontSize: 'clamp(0.7rem, 1.1vw, 0.85rem)',
    letterSpacing: '0.22em',
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: 300,
    transition: 'color 0.8s ease',
  },
}

// ============================================================
// 14. MAIN COMPONENT — Canvas + Overlay
// ============================================================

export default function EventHorizon() {
  const handleEnter = useCallback(() => {
    // Navigate to manifold page
    window.location.href = '/manifold'
  }, [])

  return (
    <div style={styles.container}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50, near: 0.1, far: 100 }}
        gl={{
          antialias: false,     // Post-processing handles AA
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.85,
        }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
      <EntranceOverlay onEnter={handleEnter} />
    </div>
  )
}
