export const photonRingVertexShader = /* glsl */ `
precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

// Kerr metric parameters
uniform float uSpin;
uniform float uInclination;
uniform float uMetricPhase;

// Observer offset (for multi-view)
uniform float uObserverInclinationOffset;
uniform float uObserverAzimuthOffset;

varying vec2 vUv;
varying float vAngle;
varying float vRadius;
varying float vDistortion;

void main() {
  vUv = uv;
  
  // Angular coordinate around ring
  float angle = uv.x * 6.28318530718;
  vAngle = angle;
  
  // Kerr frame-dragging: asymmetric radius
  float effectiveInclination = uInclination + uObserverInclinationOffset;
  float eps = 0.08 * uSpin * sin(effectiveInclination);
  
  // Include slow metric precession
  float precessionAngle = angle - uMetricPhase * 0.15 + uObserverAzimuthOffset;
  float kerrOffset = 1.0 + eps * cos(precessionAngle);
  
  vRadius = kerrOffset;
  vDistortion = abs(eps * sin(precessionAngle));
  
  // Apply distortion to position
  vec3 pos = position;
  pos.xz *= kerrOffset;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const photonRingFragmentShader = /* glsl */ `
precision highp float;

varying vec2 vUv;
varying float vAngle;
varying float vRadius;
varying float vDistortion;

// Metric state (shared across all components)
uniform float uTime;
uniform float uMetricPhase;
uniform float uOrbitalPhase;
uniform float uGlobalGlow;
uniform float uGlobalRedshift;
uniform float uTurbSeed1;
uniform float uTurbSeed2;
uniform float uTurbSeed3;

// Ring parameters
uniform float uOrder;           // photon ring order (n=0,1,2)
uniform float uIntensity;
uniform float uThickness;

// Observer parameters
uniform float uObserverAzimuthOffset;
uniform float uObserverInclinationOffset;

// Doppler & redshift
uniform float uDopplerStrength;
uniform float uRedshiftStrength;

// Colors (HDR)
uniform vec3 uCoreColor;
uniform vec3 uHaloColor;
uniform vec3 uBlueShiftColor;
uniform vec3 uRedShiftColor;

// Utility: wrap angle to [-π, π]
float wrapAngle(float angle) {
  return mod(angle + 3.14159265359, 6.28318530718) - 3.14159265359;
}

// Smooth noise (for continuous turbulence)
float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

float noise1(float x) {
  float i = floor(x);
  float f = fract(x);
  return mix(hash(i), hash(i + 1.0), smoothstep(0.0, 1.0, f));
}

void main() {
  // 1. Radial profile (Gaussian cross-section)
  float d = abs(vUv.y - 0.5) / 0.5;
  float sigmaCore = uThickness * 0.25;
  float sigmaHalo = uThickness * 0.6;
  
  float core = exp(-d * d / (2.0 * sigmaCore * sigmaCore));
  float halo = exp(-d * d / (2.0 * sigmaHalo * sigmaHalo));
  
  // 2. Higher-order ring exponential decay
  float orderDecay = exp(-uOrder * 0.7);
  
  // 3. Doppler beaming (relativistic)
  // Bright side rotates with shared orbital phase + observer offset
  float preferredAngle = 1.1 + uOrbitalPhase + uObserverAzimuthOffset;
  float dPhi = wrapAngle(vAngle - preferredAngle);
  
  float dopplerRaw = 1.0 + uDopplerStrength * cos(dPhi);
  dopplerRaw = max(dopplerRaw, 0.1);
  float doppler = pow(dopplerRaw, 2.5); // I ∝ D^(3+α)
  
  // 4. Shared turbulence (all rings see same hotspot structure)
  // Large-scale hotspots (synchronized across views)
  float hotAngle1 = uTurbSeed1 + uObserverAzimuthOffset * 0.5;
  float hotAngle2 = uTurbSeed2 - uObserverAzimuthOffset * 0.3;
  float hotAngle3 = uTurbSeed3 + uObserverAzimuthOffset * 0.7;
  
  float h1 = exp(-pow(wrapAngle(vAngle - hotAngle1), 2.0) / 0.06);
  float h2 = exp(-pow(wrapAngle(vAngle - hotAngle2), 2.0) / 0.08);
  float h3 = exp(-pow(wrapAngle(vAngle - hotAngle3), 2.0) / 0.05);
  
  float hotspot = h1 * 0.4 + h2 * 0.35 + h3 * 0.25;
  
  // Medium-scale MRI turbulence
  float turbNoise = noise1(vAngle * 7.0 + uTurbSeed2 * 0.3);
  float turbulence = 1.0 + 0.25 * turbNoise + 0.4 * hotspot;
  
  // 5. Gravitational + Doppler color shift
  float approach = cos(dPhi); // +1 approaching, -1 receding
  
  // Approaching side: blue-shifted
  // Receding side: red-shifted + gravitational redshift
  float colorMix = 0.5 + 0.5 * approach;
  vec3 colorBase = mix(uRedShiftColor, uBlueShiftColor, colorMix);
  
  // Apply global redshift from metric state
  vec3 colorFinal = mix(colorBase, uCoreColor * 0.9, 1.0 - uGlobalRedshift);
  
  // 6. Combine intensity
  float baseProfile = core * 1.8 + halo * 0.5;
  float brightness = 
    uIntensity * 
    orderDecay * 
    baseProfile * 
    doppler * 
    turbulence * 
    uGlobalGlow; // synchronized breathing
  
  vec3 emissive = colorFinal * brightness;
  float alpha = baseProfile * doppler * turbulence * 0.9;
  alpha = clamp(alpha, 0.0, 1.0);
  
  if (alpha < 0.01) discard;
  
  gl_FragColor = vec4(emissive, alpha);
}
`;
