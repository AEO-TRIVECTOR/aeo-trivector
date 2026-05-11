'use client'

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Attractor } from '@/components/Attractor';
import { motion } from 'framer-motion';
import { StickyGlassHeader } from '@/components/StickyGlassHeader';
import Footer from '@/components/Footer';
import Link from 'next/link';

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

// ── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="mb-12"
    >
      <h2
        className="text-xs font-mono tracking-[0.25em] mb-5 uppercase"
        style={{ color: 'rgba(252,211,77,0.55)' }}
      >
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

// ── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="p-8"
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

// ── Main component ───────────────────────────────────────────────────────────
export default function About() {
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
            About
          </h1>
          <p className="text-base italic mb-3" style={{ color: 'rgba(229,229,229,0.75)' }}>
            AEO Trivector is the research vehicle of Jared D. Dunahay, an independent investigator
            in non-commutative geometry and self-encoding dynamics.
          </p>
          <p className="text-xs font-mono tracking-widest" style={{ color: 'rgba(229,229,229,0.4)' }}>
            Jared D. Dunahay · AEO Trivector LLC · Bedford, NH
          </p>
        </motion.div>

        {/* C.3a — Principal Investigator */}
        <Section title="Principal Investigator">
          <Card>
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-1">
                <h3
                  className="font-serif text-2xl mb-1"
                  style={{ color: '#FCD34D' }}
                >
                  Jared D. Dunahay
                </h3>
                <p className="text-sm font-mono mb-4" style={{ color: 'rgba(229,229,229,0.5)' }}>
                  Founder &amp; Principal Investigator
                </p>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(229,229,229,0.78)' }}>
                  Independent researcher working at the intersection of spectral geometry, Clifford
                  algebra, and geometric foundations for interpretable AI. The AEO Trivector program
                  formalises the self-encoding condition μ = W(1) = e<sup>−μ</sup> and its
                  implications for dimension selection and attractor-stable dynamics.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(229,229,229,0.65)' }}>
                  For the full academic record, see the{' '}
                  <a
                    href="https://orcid.org/0009-0004-5735-2872"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#3B82F6', textDecoration: 'none' }}
                  >
                    ORCID profile
                  </a>
                  .
                </p>
              </div>

              {/* ORCID badge */}
              <a
                href="https://orcid.org/0009-0004-5735-2872"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 self-start"
                style={{
                  border: '1px solid rgba(59,130,246,0.35)',
                  textDecoration: 'none',
                  background: 'rgba(59,130,246,0.06)',
                }}
              >
                <span className="text-xs font-mono" style={{ color: '#3B82F6' }}>
                  ORCID
                </span>
                <span className="text-xs font-mono" style={{ color: 'rgba(229,229,229,0.55)' }}>
                  0009-0004-5735-2872
                </span>
              </a>
            </div>
          </Card>
        </Section>

        {/* C.3b — Affiliation */}
        <Section title="Affiliation">
          <Card>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              {[
                { dt: 'Organisation', dd: 'AEO Trivector LLC' },
                { dt: 'Location', dd: 'Bedford, NH, USA' },
                { dt: 'Status', dd: 'Independent research programme' },
                { dt: 'Founded', dd: '2024' },
              ].map(({ dt, dd }) => (
                <div key={dt}>
                  <dt className="font-mono text-xs tracking-widest mb-1" style={{ color: 'rgba(252,211,77,0.5)' }}>
                    {dt}
                  </dt>
                  <dd style={{ color: 'rgba(229,229,229,0.78)' }}>{dd}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </Section>

        {/* C.3c — Identifiers */}
        <Section title="Identifiers">
          <Card>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              {[
                {
                  dt: 'ORCID',
                  dd: '0009-0004-5735-2872',
                  href: 'https://orcid.org/0009-0004-5735-2872',
                },
                {
                  dt: 'GitHub (research org)',
                  dd: 'AEO-TRIVECTOR',
                  href: 'https://github.com/AEO-TRIVECTOR',
                },
                {
                  dt: 'GitHub (personal)',
                  dd: 'Orion-sextant',
                  href: 'https://github.com/Orion-sextant',
                },
                {
                  dt: 'Academic email',
                  dd: 'jared@trivector.ai',
                  href: 'mailto:jared@trivector.ai',
                },
                {
                  dt: 'General email',
                  dd: 'link@trivector.ai',
                  href: 'mailto:link@trivector.ai',
                },
              ].map(({ dt, dd, href }) => (
                <div key={dt}>
                  <dt className="font-mono text-xs tracking-widest mb-1" style={{ color: 'rgba(252,211,77,0.5)' }}>
                    {dt}
                  </dt>
                  <dd>
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      style={{ color: '#3B82F6', textDecoration: 'none' }}
                    >
                      {dd}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
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
          <Link
            href="/mathematics"
            className="inline-block px-8 py-3 text-sm font-mono tracking-widest transition-all duration-300"
            style={{
              border: '1px solid rgba(252,211,77,0.45)',
              color: '#FCD34D',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(252,211,77,0.08)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            Read the mathematics →
          </Link>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
