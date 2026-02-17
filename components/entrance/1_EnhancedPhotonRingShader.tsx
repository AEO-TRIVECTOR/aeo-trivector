// ============================================================
// ENHANCED PHOTON RING SHADER
// Drop-in replacement for PhotonRingFragmentShader
// Adds: Turbulent hotspots + Color temperature Doppler shift
// ============================================================

const PhotonRingFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform float uDopplerStrength;
  uniform float uShimmerSpeed;
  uniform float uShimmerAmount;
  uniform vec3 uCoreColor;
  uniform vec3 uHaloColor;
  uniform float uThickness;
  uniform float uCrescentCut;
  uniform float uWobbleAmplitude;
  uniform float uWobbleSpeed;

  varying vec2 vUv;

  float hash(float n) { return fract(sin(n) * 43758.5453123); }
  float noise(float x) {
    float i = floor(x);
    float f = fract(x);
    float a = hash(i);
    float b = hash(i + 1.0);
    return mix(a, b, f * f * (3.0 - 2.0 * f));
  }

  void main() {
    float angle = vUv.x * 6.28318530718;

    // ═══ PRECESSING WOBBLE ═══
    float wobble = uWobbleAmplitude * sin(uTime * uWobbleSpeed);
    float preferred = 1.2 + wobble;
    float dAngle = mod(angle - preferred + 3.14159, 6.28318) - 3.14159;

    // ═══ RELATIVISTIC DOPPLER BEAMING ═══
    float doppler = 1.0 + uDopplerStrength * cos(dAngle);
    doppler = max(doppler, 0.05);
    doppler = pow(doppler, 3.2);

    // ═══ TURBULENT HOTSPOTS (ACCRETION DISK VARIABILITY) ═══
    float hotspot1 = exp(-pow(mod(angle - (uTime * 0.25 + 1.0) + 3.14159, 6.28318) - 3.14159, 2.0) / 0.05);
    float hotspot2 = exp(-pow(mod(angle - (-uTime * 0.18 + 3.6) + 3.14159, 6.28318) - 3.14159, 2.0) / 0.09);
    float hotspot3 = exp(-pow(mod(angle - (uTime * 0.33 + 5.2) + 3.14159, 6.28318) - 3.14159, 2.0) / 0.07);

    float hotspotNoise = noise(angle * 15.0 + uTime * 0.9);
    float hotspot = (hotspot1 * 1.8 + hotspot2 * 1.3 + hotspot3 * 1.5) * (0.7 + 0.3 * hotspotNoise);
    float hotspotBoost = 1.0 + 0.55 * hotspot;

    // ═══ COLOR TEMPERATURE DOPPLER SHIFT ═══
    float side = clamp(doppler, 0.0, 10.0);
    side = (side - 1.0) / (uDopplerStrength * 3.0 + 0.0001);
    side = clamp(side, -1.0, 1.0);

    vec3 blueTint = vec3(0.75, 0.88, 1.35);    // Approaching: blueshift
    vec3 goldTint = vec3(1.35, 1.08, 0.68);    // Receding: redshift
    float t = (side + 1.0) * 0.5;
    vec3 tempTint = mix(goldTint, blueTint, t);

    // ═══ CRESCENT MASK ═══
    float crescentMask = smoothstep(3.14159 * uCrescentCut, 0.0, abs(dAngle));

    // ═══ RING CROSS-SECTION ═══
    float d = abs(vUv.y - 0.5) / 0.5;
    float core = exp(-d * d * 220.0 / (uThickness * uThickness));
    float halo = exp(-d * d * 22.0 / (uThickness * uThickness));

    // ═══ MICRO SHIMMER ═══
    float basePhase = angle * 5.0;
    float shimmer = 1.0 + uShimmerAmount * (
      noise(basePhase + uTime * uShimmerSpeed) * 0.6 +
      noise(basePhase * 1.7 - uTime * uShimmerSpeed * 0.8) * 0.4
    );

    // ═══ COMBINE ALL FACTORS ═══
    float brightness = uIntensity * doppler * shimmer * crescentMask * hotspotBoost;
    vec3 coreColor = (uCoreColor * tempTint) * core * brightness * 3.0;
    vec3 haloColor = (uHaloColor * tempTint) * halo * brightness * 0.9;
    vec3 finalColor = coreColor + haloColor;

    float alpha = max(core, halo * 0.6) * doppler * shimmer * crescentMask;
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;
