'use client'

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Attractor } from '@/components/Attractor';
import { motion } from 'framer-motion';
import { StickyGlassHeader } from '@/components/StickyGlassHeader';
import Footer from '@/components/Footer';

// ── Attractor background ─────────────────────────────────────────────────────
function AttractorBackground() {
  return (
    <group>
      <Attractor count={8000} opacity={0.42} speed={0.8} />
    </group>
  );
}

// ── Vignette ─────────────────────────────────────────────────────────────────
function Vignette() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        background:
          'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.72) 100%)',
      }}
    />
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function Contact() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#000', overflow: 'hidden' }}>
      <StickyGlassHeader />

      {/* Background */}
      <div className="fixed inset-0 z-0">
        {mounted && (
          <Canvas camera={{ position: [0, 0, 12], fov: 80 }}>
            <AttractorBackground />
          </Canvas>
        )}
      </div>
      <Vignette />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-40 pb-32">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="mb-20 text-center"
        >
          <h1
            className="font-serif text-5xl md:text-6xl mb-5 tracking-[0.12em]"
            style={{ color: '#FCD34D', textShadow: '0 0 40px rgba(252,211,77,0.28)' }}
          >
            Contact
          </h1>
          <p className="text-base italic mb-3" style={{ color: 'rgba(229,229,229,0.75)' }}>
            Academic correspondence and general inquiries.
          </p>
          <p className="text-xs font-mono tracking-widest" style={{ color: 'rgba(229,229,229,0.4)' }}>
            Jared D. Dunahay · AEO Trivector LLC · Bedford, NH
          </p>
        </motion.div>

        {/* Two mailto buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid gap-6 md:grid-cols-2 mb-16"
        >
          {/* Academic */}
          <a href="mailto:jared@trivector.ai" style={{ textDecoration: 'none' }}>
            <div
              className="p-8 h-full transition-all duration-300 cursor-pointer"
              style={{
                background: 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(252,211,77,0.2)',
                boxShadow: '0 0 24px rgba(252,211,77,0.06)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(252,211,77,0.45)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(252,211,77,0.04)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(252,211,77,0.2)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.45)';
              }}
            >
              <p
                className="text-xs font-mono tracking-[0.25em] mb-3 uppercase"
                style={{ color: 'rgba(252,211,77,0.55)' }}
              >
                Academic
              </p>
              <p className="font-mono text-lg mb-2" style={{ color: '#FCD34D' }}>
                jared@trivector.ai
              </p>
              <p className="text-sm" style={{ color: 'rgba(229,229,229,0.55)' }}>
                Research collaboration, preprint feedback, and peer review correspondence.
              </p>
            </div>
          </a>

          {/* General */}
          <a href="mailto:link@trivector.ai" style={{ textDecoration: 'none' }}>
            <div
              className="p-8 h-full transition-all duration-300 cursor-pointer"
              style={{
                background: 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(59,130,246,0.2)',
                boxShadow: '0 0 24px rgba(59,130,246,0.06)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.45)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.04)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.2)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.45)';
              }}
            >
              <p
                className="text-xs font-mono tracking-[0.25em] mb-3 uppercase"
                style={{ color: 'rgba(59,130,246,0.65)' }}
              >
                General
              </p>
              <p className="font-mono text-lg mb-2" style={{ color: '#3B82F6' }}>
                link@trivector.ai
              </p>
              <p className="text-sm" style={{ color: 'rgba(229,229,229,0.55)' }}>
                Press, speaking, and all other inquiries.
              </p>
            </div>
          </a>
        </motion.div>

        {/* Footer detail */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-xs font-mono tracking-widest"
          style={{ color: 'rgba(229,229,229,0.3)' }}
        >
          AEO Trivector LLC · Bedford, NH, USA
        </motion.p>
      </div>

      <Footer />
    </div>
  );
}
