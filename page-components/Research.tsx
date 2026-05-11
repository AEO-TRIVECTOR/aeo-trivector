'use client'

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Attractor } from '@/components/Attractor';
import { motion } from 'framer-motion';
import { StickyGlassHeader } from '@/components/StickyGlassHeader';
import Footer from '@/components/Footer';

// ── Attractor background (aligned with /manifold and /mathematics) ──────────
function AttractorBackground() {
  return (
    <group>
      <Attractor count={8000} opacity={0.42} speed={0.8} />
    </group>
  );
}

// ── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="mb-16"
    >
      <h2
        className="text-xs font-mono tracking-[0.25em] mb-6 uppercase"
        style={{ color: 'rgba(252,211,77,0.55)' }}
      >
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

// ── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`p-8 ${className}`}
      style={{
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(252,211,77,0.15)',
        boxShadow: '0 0 24px rgba(252,211,77,0.06)',
      }}
    >
      {children}
    </div>
  );
}

// ── Vignette overlay ─────────────────────────────────────────────────────────
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
export default function Research() {
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
      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-40 pb-32">
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
            Research
          </h1>
          <p className="text-base italic mb-3" style={{ color: 'rgba(229,229,229,0.75)' }}>
            Open research on self-encoding dynamics, non-commutative geometry, and Clifford algebra.
            Preprints, code, and reproducibility materials.
          </p>
          <p className="text-xs font-mono tracking-widest" style={{ color: 'rgba(229,229,229,0.4)' }}>
            Jared D. Dunahay · AEO Trivector LLC · Bedford, NH
          </p>
        </motion.div>

        {/* C.2a — In Preparation */}
        <Section title="In Preparation">
          <Card>
            {/* Status badge */}
            <span
              className="inline-block px-3 py-1 mb-5 text-xs font-mono tracking-wider"
              style={{
                background: 'rgba(59,130,246,0.1)',
                border: '1px solid rgba(59,130,246,0.3)',
                color: '#3B82F6',
              }}
            >
              In revision — peer review feedback received May 2026
            </span>

            <h3
              className="font-serif text-xl md:text-2xl mb-2 leading-snug"
              style={{ color: '#FCD34D' }}
            >
              Self-Encoding Geometry on Clifford Manifolds: Dimension Selection from the Lambert W
              Function
            </h3>

            <p className="text-sm font-mono mb-4" style={{ color: 'rgba(229,229,229,0.5)' }}>
              Jared D. Dunahay ·{' '}
              <a
                href="https://orcid.org/0009-0004-5735-2872"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#3B82F6', textDecoration: 'none' }}
              >
                ORCID 0009-0004-5735-2872
              </a>{' '}
              · AEO Trivector LLC, Bedford, NH · Target: <em>Journal of Mathematical Physics</em>
            </p>

            <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(229,229,229,0.78)' }}>
              Non-commutative deformation of the graded hypertorus T⁸ indexed by Cl(3,0). The
              self-encoding condition μ = W(1) = e<sup>−μ</sup> uniquely selects three spatial
              dimensions via three interlocking mechanisms: sphere selection, bridge selection, and
              threshold selection.
            </p>

            <p className="text-xs font-mono italic" style={{ color: 'rgba(229,229,229,0.35)' }}>
              arXiv link forthcoming.
            </p>
          </Card>
        </Section>

        {/* C.2b — Code */}
        <Section title="Code">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                repo: 'AEO-TRIVECTOR/aeo-trivector',
                desc: 'This website — Next.js 15 + Three.js + R3F.',
                url: 'https://github.com/AEO-TRIVECTOR/aeo-trivector',
              },
              {
                repo: 'Orion-sextant/the-manifold',
                desc: 'Companion codebase for the T⁸_Θ research program.',
                url: 'https://github.com/Orion-sextant/the-manifold',
              },
            ].map(({ repo, desc, url }) => (
              <a
                key={repo}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Card className="h-full transition-all duration-300 hover:border-[rgba(252,211,77,0.35)]">
                  <p
                    className="text-sm font-mono mb-2 break-all"
                    style={{ color: '#FCD34D' }}
                  >
                    github.com/{repo}
                  </p>
                  <p className="text-sm" style={{ color: 'rgba(229,229,229,0.65)' }}>
                    {desc}
                  </p>
                </Card>
              </a>
            ))}
          </div>
        </Section>

        {/* C.2c — Citations */}
        <Section title="Citations">
          <Card>
            <p className="text-sm font-mono italic" style={{ color: 'rgba(229,229,229,0.55)' }}>
              BibTeX available once arXiv preprint is posted.
            </p>
          </Card>
        </Section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-4"
        >
          <a
            href="mailto:jared@trivector.ai"
            className="inline-block px-8 py-3 text-sm font-mono tracking-widest transition-all duration-300"
            style={{
              border: '1px solid rgba(252,211,77,0.45)',
              color: '#FCD34D',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(252,211,77,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Collaborate → jared@trivector.ai
          </a>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
