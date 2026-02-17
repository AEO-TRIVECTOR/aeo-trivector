// BlackHoleEntrance.jsx
// Complete AEO Trivector entrance page — React Three Fiber + postprocessing
// 
// Dependencies needed in package.json:
//   "three": "^0.160.0",
//   "@react-three/fiber": "^8.15.0",
//   "@react-three/postprocessing": "^2.16.0",
//   "postprocessing": "^6.35.0",
//   "react": "^18.2.0",
//   "react-dom": "^18.2.0"

import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
  ToneMapping,
} from '@react-three/postprocessing';
import { ToneMappingMode, Effect, BlendFunction } from 'postprocessing';

// ============================================================
// §1. GRAVITATIONAL LENS — Custom post-process effect
// ============================================================

const gravitationalLensFragment = `
uniform vec2 uCenter;
uniform float uMass;
uniform float uShadowRadius;

void mainUv(inout vec2 uv) {
  vec2 dir = uv - uCenter;
  float dist = length(dir);
  
  // Lensing: strongest near ring, fades beyond
  float lensZone = smoothstep(uShadowRadius * 2.0, uShadowRadius * 0.6, dist);
  float warp = uMass / (dist * dist + 0.0005) * lensZone;
  
  uv += normalize(dir) * warp;
}
`;

class GravitationalLensEffect extends Effect {
  constructor({ center = [0.5, 0.43], mass = 0.008, shadowRadius = 0.25 } = {}) {
    super('GravitationalLens', gravitationalLensFragment, {
      uniforms: new Map([
        ['uCenter', { value: new Float32Array(center) }],
        ['uMass', { value: mass }],
        ['uShadowRadius', { value: shadowRadius }],
      ]),
    });
  }
}

// ============================================================
// §2. SHADOW MASK — Post-process pass to enforce void blackness
// ============================================================

const shadowMaskFragment = `
uniform vec2 uCenter;
uniform float uRadius;
uniform float uFeather;
uniform float uEllipseY;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 delta = uv - uCenter;
  // Elliptical mask matching ring tilt
  delta.y /= uEllipseY;
  float dist = length(delta);
  float mask = smoothstep(uRadius - uFeather, uRadius + uFeather * 0.5, dist);
  outputColor = vec4(inputColor.rgb * mask, inputColor.a);
}
`;

class ShadowMaskEffect extends Effect {
  constructor({
    center = [0.5, 0.5],
    radius = 0.2,
    feather = 0.008,
    ellipseY = 0.55,
  } = {}) {
    super('ShadowMask', shadowMaskFragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['uCenter', { value: new Float32Array(center) }],
        ['uRadius', { value: radius }],
        ['uFeather', { value: feather }],
        ['uEllipseY', { value: ellipseY }],
      ]),
    });
  }
}

// ============================================================
// §3. STAR FIELD — Three-layer parallax with GPU twinkle
// ============================================================

const starVertexShader = `
attribute float aSize;
attribute float aRandom;
varying float vRandom;
varying float vOpacity;

uniform float uBaseOpacity;

void main() {
  vRandom = aRandom;
  vOpacity = uBaseOpacity;
  
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * (250.0 / -mvPosition.z);
  gl_PointSize = clamp(gl_PointSize, 0.5, 8.0);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const starFragmentShader = `
uniform float uTime;
uniform float uOpacity;
uniform vec3 uColor;
varying float vRandom;

void main() {
  // Soft circular point
  float d = length(gl_PointCoord - 0.5) * 2.0;
  if (d > 1.0) discard;
  float alpha = 1.0 - smoothstep(0.0, 1.0, d);
  alpha *= alpha; // sharper falloff
  
  // Per-star twinkle — two frequencies for organic feel
  float twinkle = sin(uTime * (1.2 + vRandom * 2.5) + vRandom * 6.2831) * 0.2 + 0.8;
  twinkle *= sin(uTime * (0.4 + vRandom * 0.8) + vRandom * 3.14) * 0.15 + 0.85;
  
  gl_FragColor = vec4(uColor, alpha * uOpacity * twinkle);
}
`;

function StarLayer({ count, baseSize, opacity, spread, rotationSpeed, colorHex = '#ffffff' }) {
  const pointsRef = useRef();
  const materialRef = useRef();

  const [positions, sizes, randoms] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const rnd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = spread * (0.3 + 0.7 * Math.random());

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Power-law: most stars tiny, few bright
      sz[i] = baseSize * Math.pow(Math.random(), 2.5);
      rnd[i] = Math.random();
    }
    return [pos, sz, rnd];
  }, [count, baseSize, spread]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * rotationSpeed;
      pointsRef.current.rotation.x = t * rotationSpeed * 0.3;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
    }
  });

  const color = useMemo(() => new THREE.Color(colorHex), [colorHex]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          array={sizes}
          count={count}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          array={randoms}
          count={count}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uOpacity: { value: opacity },
          uColor: { value: color },
          uBaseOpacity: { value: opacity },
        }}
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
      />
    </points>
  );
}

function StarField({ visible }) {
  return (
    <group visible={visible}>
      {/* Far layer: cosmic background, barely moves */}
      <StarLayer
        count={4000}
        baseSize={0.5}
        opacity={0.3}
        spread={800}
        rotationSpeed={0.00005}
      />
      {/* Mid layer: depth parallax */}
      <StarLayer
        count={2000}
        baseSize={1.5}
        opacity={0.5}
        spread={400}
        rotationSpeed={0.0002}
      />
      {/* Near layer: prominent stars, some bright enough for bloom */}
      <StarLayer
        count={600}
        baseSize={3.0}
        opacity={0.75}
        spread={200}
        rotationSpeed={0.0005}
      />
    </group>
  );
}

// ============================================================
// §4. PHOTON RING — Multi-layer with Doppler + shimmer
// ============================================================

// Custom shader for Doppler beaming modulation
const dopplerVertexShader = `
varying float vAngle;
varying vec3 vWorldPos;

void main() {
  vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  // Compute angle around ring for Doppler modulation
  vAngle = atan(vWorldPos.x, vWorldPos.z);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const dopplerFragmentShader = `
uniform vec3 uColor;
uniform float uOpacity;
uniform float uDopplerStrength;
uniform float uApproachAngle;
uniform float uTime;
uniform float uShimmerAmp;
uniform float uShimmerFreq1;
uniform float uShimmerFreq2;

varying float vAngle;

void main() {
  // Doppler beaming: approaching side brighter
  float doppler = 1.0 + uDopplerStrength * cos(vAngle - uApproachAngle);
  
  // Shimmer: two-frequency organic flicker
  float shimmer = 1.0 
    + sin(uTime * uShimmerFreq1 + vAngle * 3.0) * uShimmerAmp
    + sin(uTime * uShimmerFreq2 + vAngle * 5.0) * uShimmerAmp * 0.4;
  
  vec3 color = uColor * doppler * shimmer;
  gl_FragColor = vec4(color, uOpacity * doppler);
}
`;

function PhotonRingLayer({
  radius,
  tubeRadius,
  color,
  opacity,
  dopplerStrength = 0.0,
  approachAngle = Math.PI * 0.5, // top of ring
  shimmerAmp = 0.0,
  shimmerFreq1 = 1.5,
  shimmerFreq2 = 3.7,
}) {
  const materialRef = useRef();
  const colorVec = useMemo(() => {
    if (color instanceof THREE.Color) return color;
    return new THREE.Color(...(Array.isArray(color) ? color : [color, color, color]));
  }, [color]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <mesh>
      <torusGeometry args={[radius, tubeRadius, 32, 300]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        toneMapped={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
        uniforms={{
          uColor: { value: colorVec },
          uOpacity: { value: opacity },
          uDopplerStrength: { value: dopplerStrength },
          uApproachAngle: { value: approachAngle },
          uTime: { value: 0 },
          uShimmerAmp: { value: shimmerAmp },
          uShimmerFreq1: { value: shimmerFreq1 },
          uShimmerFreq2: { value: shimmerFreq2 },
        }}
        vertexShader={dopplerVertexShader}
        fragmentShader={dopplerFragmentShader}
      />
    </mesh>
  );
}

function PhotonRing({ visible, ringRadius = 5.5, tiltDeg = 75 }) {
  const groupRef = useRef();
  const tiltRad = (tiltDeg * Math.PI) / 180;

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Very slow rotation: spin in-plane (like a record) around ring's normal axis
      groupRef.current.rotation.z = clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={groupRef} rotation={[tiltRad, 0, 0]} visible={visible}>
      {/* ── Layer 1: Core filament ── */}
      {/* KEY: emissive 3-4, NOT 10-12. Let bloom do the work. */}
      <PhotonRingLayer
        radius={ringRadius}
        tubeRadius={0.003}
        color={new THREE.Color(4.5, 4.5, 4.5)} // HDR white at 4.5x
        opacity={1.0}
        dopplerStrength={0.7}
        shimmerAmp={0.1}
        shimmerFreq1={1.5}
        shimmerFreq2={3.7}
      />

      {/* ── Layer 2: Inner warm halo ── */}
      <PhotonRingLayer
        radius={ringRadius}
        tubeRadius={0.025}
        color={new THREE.Color(2.0, 1.0, 0.2)} // Warm gold at 2x
        opacity={0.35}
        dopplerStrength={0.6}
        shimmerAmp={0.08}
        shimmerFreq1={1.047} // 6-second breathing cycle
        shimmerFreq2={2.3}
      />

      {/* ── Layer 3: Outer atmospheric scatter ── */}
      {/* SUBTLE. If this causes bloom blowout, reduce opacity to 0.04 or remove */}
      <PhotonRingLayer
        radius={ringRadius}
        tubeRadius={0.06}
        color={new THREE.Color(0.6, 0.3, 0.06)}
        opacity={0.08}
        dopplerStrength={0.5}
        shimmerAmp={0.05}
        shimmerFreq1={0.8}
        shimmerFreq2={1.9}
      />
    </group>
  );
}

// ============================================================
// §5. SECONDARY PHOTON RING — Faint ghost arc from extra half-orbit
// ============================================================

function SecondaryPhotonRing({ visible, ringRadius = 5.5, tiltDeg = 75 }) {
  const groupRef = useRef();
  const tiltRad = (tiltDeg * Math.PI) / 180;

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={groupRef} rotation={[tiltRad, 0, 0]} visible={visible}>
      <PhotonRingLayer
        radius={ringRadius * 1.35}
        tubeRadius={0.0035}
        color={new THREE.Color(1.5, 1.2, 0.6)}
        opacity={0.35}
        dopplerStrength={0.5}
        shimmerAmp={0.06}
        shimmerFreq1={1.2}
        shimmerFreq2={2.8}
      />
    </group>
  );
}

// ============================================================
// §6. INFALLING PARTICLES — Matter spiraling into event horizon
// ============================================================

function InfallingParticles({ visible, ringRadius = 5.5, tiltDeg = 75 }) {
  const groupRef = useRef();
  const particlesRef = useRef();
  const tiltRad = (tiltDeg * Math.PI) / 180;
  const count = 8;

  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      ph[i] = (i / count) * Math.PI * 2;
    }
    return [pos, ph];
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const phase = phases[i] + t * 0.3;
      const r = ringRadius * (1.2 + 0.3 * Math.sin(phase * 0.5));
      positions[i * 3] = r * Math.cos(phase);
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = r * Math.sin(phase);
      // Reset when reaching horizon
      if (r < ringRadius * 0.5) {
        phases[i] = Math.random() * Math.PI * 2;
      }
    }
    if (particlesRef.current) {
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} rotation={[tiltRad, 0, 0]} visible={visible}>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={count}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#ffb366"
          opacity={0.6}
          transparent
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// ============================================================
// §7. SUBTLE HOTSPOTS — Micro-turbulence flicker
// ============================================================

function SubtleHotspots({ visible, ringRadius = 5.5, tiltDeg = 75 }) {
  const meshRef = useRef();
  const tiltRad = (tiltDeg * Math.PI) / 180;

  const fragShader = /* glsl */`
    uniform float uTime;
    varying vec2 vUv;
    
    float hash(float n) { return fract(sin(n) * 43758.5453123); }
    float noise(float x) {
      float i = floor(x);
      float f = fract(x);
      return mix(hash(i), hash(i+1.0), f*f*(3.0-2.0*f));
    }
    
    void main() {
      float angle = vUv.x * 6.28318;
      
      // Three hotspots drifting slowly
      float h1 = exp(-pow(mod(angle - uTime*0.15 + 1.2, 6.28318) - 3.14159, 2.0) / 0.06);
      float h2 = exp(-pow(mod(angle + uTime*0.11 + 4.1, 6.28318) - 3.14159, 2.0) / 0.08);
      float h3 = exp(-pow(mod(angle - uTime*0.19 + 2.8, 6.28318) - 3.14159, 2.0) / 0.05);
      
      float n = noise(angle * 12.0 + uTime * 0.7);
      float hotspot = (h1 * 0.4 + h2 * 0.3 + h3 * 0.35) * (0.8 + 0.2 * n);
      
      // Radial profile (only at ring radius)
      float d = abs(vUv.y - 0.5) * 2.0;
      float radial = exp(-d * d * 180.0);
      
      vec3 color = vec3(1.5, 1.2, 0.7) * hotspot * radial * 0.25;
      float alpha = hotspot * radial * 0.18;
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

  useFrame((state) => {
    if (meshRef.current?.material) {
      (meshRef.current.material).uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[tiltRad, 0, 0.05]} visible={visible}>
      <torusGeometry args={[ringRadius, 0.018, 16, 256]} />
      <shaderMaterial
        vertexShader={`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
        fragmentShader={fragShader}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

// ============================================================
// §8. VOID DUST — Ultra-sparse slow-moving particles
// ============================================================

function VoidDust({ count = 6 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  const velocities = useMemo(() => 
    Array.from({ length: count }, () => ({
      vx: (Math.random() - 0.5) * 0.02,
      vy: (Math.random() - 0.5) * 0.015,
      vz: (Math.random() - 0.5) * 0.01,
    })), [count]
  );

  useFrame(() => {
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      positions[idx] += velocities[i].vx;
      positions[idx + 1] += velocities[i].vy;
      positions[idx + 2] += velocities[i].vz;
      
      // Wrap around bounds
      if (Math.abs(positions[idx]) > 12) positions[idx] *= -0.9;
      if (Math.abs(positions[idx + 1]) > 8) positions[idx + 1] *= -0.9;
      if (Math.abs(positions[idx + 2]) > 5) positions[idx + 2] *= -0.9;
    }
    
    if (ref.current) {
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#8a7555"
        opacity={0.3}
        transparent
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ============================================================
// §9. CAMERA DRIFT — Subliminal Lissajous
// ============================================================

function CameraDrift() {
  const initialPos = useRef(null);

  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime;

    if (!initialPos.current) {
      initialPos.current = camera.position.clone();
    }

    // Lissajous drift — subliminal amplitude
    camera.position.x = initialPos.current.x + Math.sin(t * 0.1) * 0.03;
    camera.position.y = initialPos.current.y + Math.cos(t * 0.07) * 0.02;

    // Very subtle roll
    camera.rotation.z = Math.sin(t * 0.05) * 0.002;

    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ============================================================
// §6. POST-PROCESSING — Bloom + Shadow Mask + Lens + Vignette
// ============================================================

function PostProcessing({ shadowCenter, shadowRadius, shadowEllipseY, enableLensing }) {
  const shadowMask = useMemo(
    () =>
      new ShadowMaskEffect({
        center: shadowCenter,
        radius: shadowRadius,
        feather: 0.01,
        ellipseY: shadowEllipseY,
      }),
    [shadowCenter, shadowRadius, shadowEllipseY]
  );

  const gravitationalLens = useMemo(
    () =>
      enableLensing
        ? new GravitationalLensEffect({
            center: shadowCenter,
            mass: 0.006,
            shadowRadius: shadowRadius,
          })
        : null,
    [enableLensing, shadowCenter, shadowRadius]
  );

  return (
    <EffectComposer disableNormalPass>
      {/* Bloom: moderate intensity, only HDR elements trigger */}
      <Bloom
        intensity={1.1}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.03}
        mipmapBlur={true}
      />

      {/* Shadow mask: enforce void AFTER bloom */}
      <primitive object={shadowMask} />

      {/* Gravitational lensing (optional — enable once core looks right) */}
      {gravitationalLens && <primitive object={gravitationalLens} />}

      {/* Film grain: breaks dark gradient banding */}
      <Noise opacity={0.012} blendFunction={BlendFunction.OVERLAY} />

      {/* Vignette: draws eye inward, darkens edges */}
      <Vignette offset={0.15} darkness={1.2} />

      {/* ACES Filmic: graceful HDR → LDR compression */}
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}

// ============================================================
// §7. ENTRANCE SEQUENCE — Staged reveal
// ============================================================

function useEntranceSequence() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),   // Stars fade in
      setTimeout(() => setPhase(2), 1400),  // Ring appears
      setTimeout(() => setPhase(3), 2800),  // Title
      setTimeout(() => setPhase(4), 4200),  // Subtitle
      setTimeout(() => setPhase(5), 5500),  // Enter button
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return phase;
}

// ============================================================
// §8. SUB-BASS DRONE — Web Audio API (optional, on user click)
// ============================================================

function useAmbientDrone() {
  const ctxRef = useRef(null);
  const gainRef = useRef(null);

  const start = useCallback(() => {
    if (ctxRef.current) return;

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
    gainRef.current = masterGain;

    // Two detuned oscillators → 0.5Hz beating
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 55;

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 55.5;

    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.25;

    osc1.connect(oscGain);
    osc2.connect(oscGain);
    oscGain.connect(masterGain);

    // Brown noise through low-pass for texture
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const lpf = ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 160;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.12;

    noise.connect(lpf);
    lpf.connect(noiseGain);
    noiseGain.connect(masterGain);

    osc1.start();
    osc2.start();
    noise.start();

    // Fade in over 3 seconds
    masterGain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 3);
  }, []);

  const stop = useCallback(() => {
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 1.5);
      setTimeout(() => {
        ctxRef.current?.close();
        ctxRef.current = null;
        gainRef.current = null;
      }, 2000);
    }
  }, []);

  return { start, stop };
}

// ============================================================
// §9. SCENE — Assembles everything inside the Canvas
// ============================================================

function Scene({ phase }) {
  return (
    <>
      {/* Camera drift — subliminal Lissajous */}
      <CameraDrift />

      {/* Star field — three parallax layers */}
      <StarField visible={phase >= 1} />

      {/* Void dust — ultra-sparse slow particles */}
      <VoidDust count={6} />

      {/* Photon ring — multi-layer with Doppler beaming */}
      {/* Adjust tiltDeg to control how much of the ellipse is visible */}
      {/* 75° = moderate tilt (current), 70° = more face-on, 80° = more edge-on */}
      <PhotonRing visible={phase >= 2} ringRadius={5.5} tiltDeg={75} />

      {/* Secondary photon ring — faint ghost arc from extra half-orbit */}
      <SecondaryPhotonRing visible={phase >= 2} ringRadius={5.5} tiltDeg={75} />

      {/* Subtle hotspots — micro-turbulence flicker */}
      <SubtleHotspots visible={phase >= 2} ringRadius={5.5} tiltDeg={75} />

      {/* Infalling particles — matter spiraling into event horizon */}
      <InfallingParticles visible={phase >= 2} ringRadius={5.5} tiltDeg={75} />

      {/* Post-processing chain */}
      {/* CRITICAL: Shadow mask renders AFTER bloom to prevent bloom bleed into void */}
      <PostProcessing
        shadowCenter={[0.5, 0.5]}    // Adjust if ring isn't centered on screen
        shadowRadius={0.22}            // Screen-space radius of void — tune to match ring
        shadowEllipseY={0.55}          // Ellipse ratio — match ring tilt
        enableLensing={true}           // Gravitational lensing enabled at mass: 0.005
      />
    </>
  );
}

// ============================================================
// §10. HTML OVERLAY — Typography + Enter button
// ============================================================

function TitleOverlay({ phase, onEnter }) {
  const titleText = 'AEO TRIVECTOR';

  return (
    <div style={styles.overlay}>
      {/* Title — character-by-character reveal */}
      <h1 style={styles.titleContainer}>
        {titleText.split('').map((char, i) => (
          <span
            key={i}
            style={{
              ...styles.titleChar,
              animationDelay: `${2800 + i * 45}ms`,
              opacity: phase >= 3 ? undefined : 0,
              animation: phase >= 3 ? `charReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards` : 'none',
              animationDelay: phase >= 3 ? `${i * 45}ms` : undefined,
            }}
          >
            {char === ' ' ? '\u00A0\u00A0' : char}
          </span>
        ))}
      </h1>

      {/* Subtitle */}
      <p
        style={{
          ...styles.subtitle,
          opacity: phase >= 4 ? 0.45 : 0,
          transition: 'opacity 1.8s ease-out',
        }}
      >
        ATTRACTOR ARCHITECTURE
      </p>

      {/* Enter button */}
      <div
        style={{
          ...styles.enterContainer,
          opacity: phase >= 5 ? 1 : 0,
          transition: 'opacity 1.2s ease-out',
        }}
      >
        <span style={styles.enterLabel}>ENTER</span>
        <button style={styles.enterButton} onClick={onEnter}>
          CROSS THE EVENT HORIZON
        </button>
      </div>
    </div>
  );
}

// ============================================================
// §11. MAIN COMPONENT — Canvas + Overlay
// ============================================================

export default function BlackHoleEntrance({ onEnter }) {
  const phase = useEntranceSequence();
  const { start: startDrone, stop: stopDrone } = useAmbientDrone();
  const [audioStarted, setAudioStarted] = useState(false);

  const handleEnter = useCallback(() => {
    if (!audioStarted) {
      startDrone();
      setAudioStarted(true);
    }
    onEnter?.();
  }, [audioStarted, startDrone, onEnter]);

  // Start drone on first user interaction anywhere
  const handleFirstInteraction = useCallback(() => {
    if (!audioStarted) {
      startDrone();
      setAudioStarted(true);
    }
  }, [audioStarted, startDrone]);

  return (
    <div style={styles.container} onClick={handleFirstInteraction}>
      <Canvas
        camera={{ position: [0, 2, 12], fov: 50, near: 0.1, far: 5000 }}
        gl={{
          antialias: true,
          toneMapping: THREE.NoToneMapping, // Let postprocessing handle it
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        style={styles.canvas}
      >
        <color attach="background" args={['#000000']} />
        <Scene phase={phase} />
      </Canvas>

      <TitleOverlay phase={phase} onEnter={handleEnter} />

      {/* Keyframe injection */}
      <style>{keyframes}</style>
    </div>
  );
}

// ============================================================
// §12. STYLES
// ============================================================

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: '#000000',
    overflow: 'hidden',
    cursor: 'default',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '12vh',
    pointerEvents: 'none',
    zIndex: 10,
  },
  titleContainer: {
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'nowrap',
  },
  titleChar: {
    display: 'inline-block',
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 300,
    fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)',
    letterSpacing: '0.12em',
    color: 'rgba(255, 255, 255, 0.85)',
    textShadow: `
      0 0 7px rgba(255, 255, 255, 0.25),
      0 0 14px rgba(255, 255, 255, 0.15),
      0 0 28px rgba(200, 210, 255, 0.1),
      0 0 42px rgba(160, 180, 255, 0.06)
    `,
    opacity: 0,
    transform: 'translateY(18px)',
    userSelect: 'none',
  },
  subtitle: {
    fontFamily: "'Raleway', sans-serif",
    fontWeight: 200,
    fontSize: 'clamp(0.6rem, 1.3vw, 0.85rem)',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.45)',
    marginTop: '14px',
    userSelect: 'none',
    transition: 'opacity 1.8s ease-out',
  },
  enterContainer: {
    position: 'absolute',
    bottom: '12vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    pointerEvents: 'auto',
  },
  enterLabel: {
    fontFamily: "'Raleway', sans-serif",
    fontWeight: 200,
    fontSize: '0.6rem',
    letterSpacing: '0.35em',
    textTransform: 'uppercase',
    color: 'rgba(255, 200, 120, 0.45)',
    marginBottom: '6px',
  },
  enterButton: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 300,
    fontSize: '0.8rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.6)',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid rgba(255, 200, 120, 0.2)',
    padding: '10px 28px',
    cursor: 'pointer',
    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    pointerEvents: 'auto',
  },
};

// ============================================================
// §13. KEYFRAMES
// ============================================================

const keyframes = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Raleway:wght@200;300&display=swap');

@keyframes charReveal {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 0.85;
    transform: translateY(0);
  }
}

/* Enter button hover effects — needs to be in global CSS or styled-components */
button:hover {
  color: rgba(255, 255, 255, 0.95) !important;
  text-shadow: 0 0 20px rgba(255, 200, 120, 0.3);
  border-bottom-color: rgba(255, 200, 120, 0.6) !important;
}
`;
