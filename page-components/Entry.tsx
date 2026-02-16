'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { EntranceScene } from '@/components/entrance/EntranceScene';

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

export default function Entry() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);

  // Cursor
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Horizon position in normalized coordinates (0..1), near bottom
  const horizonY = 0.86;

  const [isHoveringEnter, setIsHoveringEnter] = useState(false);
  const [isCrossing, setIsCrossing] = useState(false);

  // Compute proximity to horizon: closer => stronger gravity
  const gravity = useTransform(my, (v) => {
    // v is px; map to normalized using element height
    const el = rootRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const yNorm = clamp01(v / rect.height);

    const d = Math.abs(yNorm - horizonY); // 0 at horizon
    // Nonlinear "pull": only ramps near horizon
    const g = clamp01(1 - d / 0.25);
    return Math.pow(g, 2.2);
  });

  // Time dilation: near horizon, slow down star drift
  const timeScale = useTransform(gravity, (g) => 1 - 0.65 * g);

  // UI warps: subtle scale/spacing changes near horizon
  const titleLetterSpacing = useTransform(gravity, (g) => `${0.02 + 0.06 * g}em`);
  const uiLift = useTransform(gravity, (g) => -10 * g);

  // Ring intensity: base + hover + click flare
  const ringIntensity = useTransform(gravity, (g) => {
    const base = 0.75 + 0.25 * g;
    const hover = isHoveringEnter ? 0.15 : 0;
    const crossing = isCrossing ? 0.45 : 0;
    return clamp01(base + hover + crossing);
  });

  // Fade/vignette on crossing
  const overlayOpacity = useMotionValue(0);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      // rAF throttle to avoid rerender storms
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        mx.set(e.clientX - rect.left);
        my.set(e.clientY - rect.top);
      });
    };

    el.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', onMove as any);
    };
  }, [mx, my]);

  async function cross() {
    if (isCrossing) return;
    setIsCrossing(true);

    // Fast "ring flare + inward pull"
    animate(overlayOpacity, 1, { duration: 0.22, ease: 'easeOut' });

    // Hard cut after a short beat
    window.setTimeout(() => {
      router.push('/manifold');
    }, 240);
  }

  // For Canvas props: framer-motion MotionValue -> number
  // We'll sample via useState + rAF to avoid re-rendering too often
  const [timeScaleNum, setTimeScaleNum] = useState(1);
  const [ringIntensityNum, setRingIntensityNum] = useState(0.85);

  useEffect(() => {
    const unsub1 = timeScale.on('change', (v) => setTimeScaleNum(v));
    const unsub2 = ringIntensity.on('change', (v) => setRingIntensityNum(v));
    return () => {
      unsub1();
      unsub2();
    };
  }, [timeScale, ringIntensity]);

  return (
    <div ref={rootRef} style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* WebGL Background */}
      <EntranceScene timeScale={timeScaleNum} ringIntensity={ringIntensityNum} />

      {/* Dark veil for readability (keeps minimal aesthetic) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'radial-gradient(80% 60% at 50% 30%, rgba(0,0,0,0.25), rgba(0,0,0,0.92) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Gravitational gradient below horizon - creates depth/curvature cue */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50vh',
          zIndex: 1,
          background:
            'radial-gradient(ellipse 120% 80% at 50% 150%, transparent 0%, rgba(0,0,0,0.65) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Atmospheric scatter above ring - photon accumulation */}
      <div
        style={{
          position: 'absolute',
          bottom: '15vh',
          left: 0,
          right: 0,
          height: '10vh',
          zIndex: 1,
          background:
            'radial-gradient(ellipse 60% 100% at 50% 100%, rgba(255,215,0,0.03) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Crossing overlay */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          background: 'rgba(0,0,0,1)',
          opacity: overlayOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* UI */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '8vh',
          y: uiLift,
        }}
      >
        <motion.h1
          style={{
            letterSpacing: titleLetterSpacing,
            textShadow: '0 0 12px rgba(255,215,0,0.25)',
          }}
          className="text-5xl md:text-6xl font-[var(--font-cormorant)] text-[#FFD700]/80"
        >
          AEO TRIVECTOR
        </motion.h1>

        <div className="mt-3 text-[#60A5FA] font-[var(--font-jetbrains)] tracking-[0.28em] text-xs md:text-sm">
          ATTRACTOR ARCHITECTURE
        </div>

        {/* Place ENTER anchored to ring apex - ChatGPT: 4-8% below ring */}
        <div style={{ marginTop: 'auto', marginBottom: '20vh' }}>
          <motion.button
            onClick={cross}
            onPointerEnter={() => setIsHoveringEnter(true)}
            onPointerLeave={() => setIsHoveringEnter(false)}
            className="px-7 py-3 rounded-full border border-[#FFD700]/35 text-[#FFD700] font-[var(--font-jetbrains)] text-sm backdrop-blur-xl"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: 'rgba(10,10,12,0.35)',
              boxShadow: '0 0 18px rgba(255,215,0,0.12)',
            }}
          >
            ENTER
          </motion.button>

          {/* Hint appears after a beat, stays subtle */}
          <div className="mt-4 text-[10px] tracking-[0.42em] text-white/40 font-[var(--font-jetbrains)] text-center">
            CROSS THE EVENT HORIZON
          </div>
        </div>
      </motion.div>
    </div>
  );
}
