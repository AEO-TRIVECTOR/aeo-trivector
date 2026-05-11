'use client'

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Attractor } from '@/components/Attractor';
import { motion } from 'framer-motion';
import { StickyGlassHeader } from '@/components/StickyGlassHeader';
import Footer from '@/components/Footer';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Lazy-load KaTeX to keep First Load JS under 500 kB
const InlineMath = dynamic(
  () => import('react-katex').then((m) => ({ default: m.InlineMath })),
  { ssr: false, loading: () => <span className="opacity-40">…</span> }
);
const BlockMath = dynamic(
  () => import('react-katex').then((m) => ({ default: m.BlockMath })),
  { ssr: false, loading: () => <div className="opacity-40 text-center py-2">…</div> }
);
// Lazy-load the recharts chart as a single self-contained component
const DimensionPlot = dynamic(
  () => import('@/components/DimensionPlot'),
  {
    ssr: false,
    loading: () => (
      <div
        className="rounded-xl p-4 flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(252,211,77,0.15)', height: 300 }}
      >
        <span className="font-mono text-xs text-[#9CA3AF]">Loading chart…</span>
      </div>
    ),
  }
);

// ─── Attractor background (aligned with /manifold) ───────────────────────────

function AttractorBackground({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      groupRef.current.scale.set(scale, scale, scale);
      const targetRotationX = mousePosition.y * 0.1;
      const targetRotationZ = mousePosition.x * 0.1;
      groupRef.current.rotation.x +=
        (targetRotationX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.z +=
        (targetRotationZ - groupRef.current.rotation.z) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Aligned with /manifold: count=8000, opacity=0.42 */}
      <Attractor count={8000} opacity={0.42} speed={1} />
    </group>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

interface SectionProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
  id?: string;
}

function Section({ title, children, delay = 0, id }: SectionProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative rounded-2xl p-10 transition-all duration-700"
        style={{
          background: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(252, 211, 77, 0.2)',
          boxShadow: isHovered
            ? '0 0 40px rgba(252, 211, 77, 0.15), inset 0 0 60px rgba(252, 211, 77, 0.05)'
            : '0 0 25px rgba(252, 211, 77, 0.1), inset 0 0 40px rgba(252, 211, 77, 0.03)',
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        <div
          className="absolute top-0 left-0 w-32 h-32 rounded-tl-2xl pointer-events-none transition-opacity duration-700"
          style={{
            background:
              'radial-gradient(circle at top left, rgba(252, 211, 77, 0.15), transparent 70%)',
            opacity: isHovered ? 1 : 0.6,
          }}
        />
        <div className="relative">
          <h2
            className="font-serif text-3xl tracking-wide mb-8 text-[#FCD34D]"
            style={{
              textShadow: '0 0 20px rgba(252, 211, 77, 0.3)',
              letterSpacing: '0.12em',
              fontWeight: 300,
            }}
          >
            {title}
          </h2>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

// ─── JSON-LD helpers ──────────────────────────────────────────────────────────

const DEFINED_TERMS_JSON = JSON.stringify([
  {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'μ (mu) — Self-Encoding Fixed Point',
    termCode: 'mu',
    description:
      'The Lambert W(1) value ≈ 0.567143. Fixed point of x = e^(−x). Primitive constraint of the AEO Trivector framework.',
    inDefinedTermSet: 'AEO Trivector — Mathematical Constants',
    url: 'https://aeotrivector.com/mathematics#constants',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'φ (phi) — Golden Ratio',
    termCode: 'phi',
    description:
      'The golden ratio ≈ 1.618034. Governs dimension selection and the spinor complement geometry.',
    inDefinedTermSet: 'AEO Trivector — Mathematical Constants',
    url: 'https://aeotrivector.com/mathematics#constants',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'Ω (Omega) — Spinor Complement',
    termCode: 'Omega',
    description:
      'Exact value √(1 − μ²) ≈ 0.823619. Governs global integration structure in the spectral triple.',
    inDefinedTermSet: 'AEO Trivector — Mathematical Constants',
    url: 'https://aeotrivector.com/mathematics#constants',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'β (beta) — Golden Incompleteness',
    termCode: 'beta',
    description:
      'Value φ⁻¹/3 ≈ 0.206011. Controls balance between structure and dynamics; encodes golden incompleteness.',
    inDefinedTermSet: 'AEO Trivector — Mathematical Constants',
    url: 'https://aeotrivector.com/mathematics#constants',
  },
]);

const TECH_ARTICLE_JSON = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'The Mathematics of Self-Encoding Geometry',
  description:
    'Mathematical foundations of AEO Trivector: constraint hierarchy, spectral triple structure on the graded hypertorus T⁸_Θ, and dimension selection via the Lambert W function.',
  author: {
    '@type': 'Person',
    name: 'Jared D. Dunahay',
    identifier: 'https://orcid.org/0009-0004-5735-2872',
  },
  publisher: {
    '@type': 'Organization',
    name: 'AEO Trivector LLC',
    url: 'https://aeotrivector.com',
  },
  url: 'https://aeotrivector.com/mathematics',
  inLanguage: 'en',
});

// ─── Main component ───────────────────────────────────────────────────────────

export default function Mathematics() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#000', overflow: 'hidden' }}>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: TECH_ARTICLE_JSON }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: DEFINED_TERMS_JSON }}
      />

      {/* Header */}
      <StickyGlassHeader />

      {/* Attractor background — aligned with /manifold */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 12], fov: 80 }}>
          <AttractorBackground mousePosition={mousePosition} />
        </Canvas>
      </div>

      {/* Dark vignette overlay — same as /manifold for text contrast */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 5,
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.80) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div className="relative z-10">

        {/* ── Hero ── */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-5xl md:text-6xl text-[#FCD34D] mb-4 tracking-[0.15em]"
            style={{ textShadow: '0 0 40px rgba(252, 211, 77, 0.3)' }}
          >
            The Formalism
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-lg text-[#E5E5E5]/70 italic tracking-wide max-w-2xl mb-4"
          >
            The mathematical spine: self-encoding dynamics, the constraint hierarchy,
            and dimension selection on the graded hypertorus T⁸.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-mono text-sm text-[#9CA3AF] mb-10"
          >
            Jared D. Dunahay · AEO Trivector LLC · Bedford, NH
          </motion.p>

          <motion.a
            href="/research"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="inline-block font-mono text-sm tracking-widest px-8 py-3 text-[#FCD34D] transition-all duration-300"
            style={{
              border: '1px solid rgba(252, 211, 77, 0.4)',
              background: 'rgba(252, 211, 77, 0.05)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(252,211,77,0.12)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(252,211,77,0.7)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(252,211,77,0.05)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(252,211,77,0.4)';
            }}
          >
            View Research →
          </motion.a>
        </section>

        {/* ── Content sections ── */}
        <section className="max-w-4xl mx-auto px-6 pb-32 space-y-12">

          {/* B.1 — Mathematical Constants */}
          <Section title="The Four Constants" delay={0} id="constants">
            <p className="text-[#E5E5E5]/70 mb-8 leading-relaxed">
              The framework is anchored by four constants that together determine the geometry of
              self-encoding dynamics. All four are exact — not fitted parameters.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  symbol: '\\mu',
                  label: 'Self-Encoding Fixed Point',
                  value: '= W(1) = 0.567143\\ldots',
                  desc: 'Fixed point of x = e^{−x}. The primitive constraint: attractor-stable systems satisfy this relation.',
                  color: '#FCD34D',
                },
                {
                  symbol: '\\varphi',
                  label: 'Golden Ratio',
                  value: '= \\tfrac{1+\\sqrt{5}}{2} = 1.618034\\ldots',
                  desc: 'Governs dimension selection and the incompleteness parameter β.',
                  color: '#3B82F6',
                },
                {
                  symbol: '\\Omega',
                  label: 'Spinor Complement',
                  value: '= \\sqrt{1-\\mu^2} = 0.823619\\ldots',
                  desc: 'Exact. Governs global integration structure in the spectral triple.',
                  color: '#FCD34D',
                },
                {
                  symbol: '\\beta',
                  label: 'Golden Incompleteness',
                  value: '= \\varphi^{-1}/3 = 0.206011\\ldots',
                  desc: 'Controls balance between structure and dynamics; encodes the incompleteness of self-reference.',
                  color: '#3B82F6',
                },
              ].map((c, i) => (
                <div
                  key={i}
                  className="rounded-xl p-6"
                  style={{
                    border: `1px solid ${c.color}30`,
                    background: `${c.color}08`,
                  }}
                >
                  <div
                    className="text-3xl mb-2"
                    style={{ color: c.color, textShadow: `0 0 12px ${c.color}60` }}
                  >
                    <InlineMath math={c.symbol} />
                  </div>
                  <div className="font-mono text-xs text-[#9CA3AF] mb-2">{c.label}</div>
                  <div className="text-sm mb-3" style={{ color: c.color }}>
                    <InlineMath math={c.value} />
                  </div>
                  <p className="text-xs text-[#E5E5E5]/60 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* B.2 — Dimension Selection */}
          <Section title="Dimension Selection" delay={0.1} id="dimension-selection">
            <p className="text-[#E5E5E5]/70 mb-4 leading-relaxed">
              The equilibrium dimension <InlineMath math="x^*(\mu)" /> is determined by the
              balance between the golden ratio and the spinor complement:
            </p>
            <div className="my-6 text-center">
              <BlockMath math="x^*(\mu) = \frac{1}{\varphi\,\sqrt{1-\mu^2} - 1}" />
            </div>
            <p className="text-[#E5E5E5]/70 mb-2 leading-relaxed">
              At <InlineMath math="\mu = W(1) = 0.567143" />, this yields{' '}
              <InlineMath math="x^* = 3.006" /> — selecting three spatial dimensions through
              three independent mechanisms:
            </p>
            <ul className="space-y-2 mb-8 pl-4">
              {[
                'Fixed-point convergence of the self-encoding map',
                'Golden-ratio incompleteness at the spinor boundary',
                'Dimensional resonance with the Clifford algebra Cl(3,0)',
              ].map((m, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#E5E5E5]/70">
                  <span className="font-mono text-[#FCD34D]/60 mt-0.5 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {m}
                </li>
              ))}
            </ul>

            {/* Lazy-loaded recharts plot */}
            <DimensionPlot />
          </Section>

          {/* B.3 — Constraint Hierarchy (Level 0–5) */}
          <Section title="The Constraint Hierarchy" delay={0.2} id="constraint-hierarchy">
            <p className="text-[#E5E5E5]/70 mb-8 leading-relaxed">
              The framework is organised as six nested levels. Each level adds a constraint
              that the system must satisfy to achieve self-encoding stability.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(252,211,77,0.2)' }}>
                    {['Level', 'Name', 'Constraint', 'Role'].map((h) => (
                      <th
                        key={h}
                        className="text-left py-3 px-4 font-mono text-xs text-[#FCD34D]/70 tracking-widest"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      level: '0',
                      name: 'Primitive',
                      constraint: 'μ = e^{-μ}',
                      role: 'Self-encoding fixed point; attractor ground state',
                    },
                    {
                      level: '1',
                      name: 'Spinor Complement',
                      constraint: '\\Omega = \\sqrt{1-\\mu^2}',
                      role: 'Orthogonal completion; spinor boundary condition',
                    },
                    {
                      level: '2',
                      name: 'Dimensional Resonance',
                      constraint: 'x^*(\\mu) = 3.006 \\approx 3',
                      role: 'Selects three spatial dimensions via golden-ratio balance',
                    },
                    {
                      level: '3',
                      name: 'Golden Incompleteness',
                      constraint: '\\beta = \\varphi^{-1}/3',
                      role: 'Encodes irreducible incompleteness of self-reference',
                    },
                    {
                      level: '4',
                      name: 'Spectral Triple',
                      constraint: '(\\mathcal{A}, \\mathcal{H}, D)',
                      role: 'Full noncommutative geometry; Dirac operator on T⁸_Θ',
                    },
                    {
                      level: '5',
                      name: 'Attractor Stability',
                      constraint: '\\|D\\psi\\| \\leq \\mu\\|\\psi\\|',
                      role: 'Lyapunov-stable dynamics on the graded hypertorus',
                    },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                      className="transition-colors duration-200 hover:bg-white/[0.02]"
                    >
                      <td className="py-3 px-4 font-mono text-[#FCD34D]/60 text-xs">{row.level}</td>
                      <td className="py-3 px-4 font-mono text-white text-xs">{row.name}</td>
                      <td className="py-3 px-4 text-[#3B82F6]">
                        <InlineMath math={row.constraint} />
                      </td>
                      <td className="py-3 px-4 text-[#E5E5E5]/60 text-xs leading-relaxed">
                        {row.role}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* B.4 — Graded Hypertorus T⁸_Θ (with Spectral Triple folded in) */}
          <Section title="The Graded Hypertorus T⁸_Θ" delay={0.3} id="hypertorus">
            <p className="text-[#E5E5E5]/70 mb-6 leading-relaxed">
              The geometry is realised on the graded hypertorus{' '}
              <InlineMath math="T^8_\Theta = S^1 \times T^3 \times T^3 \times S^1" />, a
              noncommutative deformation of the eight-dimensional torus by the skew-symmetric
              matrix <InlineMath math="\Theta" />. The four factors encode the four constraint
              levels: primitive, architectural, dimensional, and derived.
            </p>

            {/* Spectral Triple subsection */}
            <div
              className="rounded-xl p-6 mb-6"
              style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}
            >
              <h3 className="font-mono text-base text-[#3B82F6] mb-4 tracking-wide">
                Spectral Triple Structure (A, H, D)
              </h3>
              <p className="text-sm text-[#E5E5E5]/70 mb-5 leading-relaxed">
                Following Connes–Landi{' '}
                <a
                  href="https://arxiv.org/abs/math/0011194"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3B82F6] underline underline-offset-2 hover:text-[#60A5FA]"
                >
                  (arXiv:math/0011194)
                </a>
                , the framework is formalised as a spectral triple{' '}
                <InlineMath math="(\mathcal{A}, \mathcal{H}, D)" />:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    symbol: '\\mathcal{A}',
                    name: 'Algebra',
                    desc: 'Smooth functions on the deformed torus T⁸_Θ; noncommutative algebra of observables',
                    color: '#FCD34D',
                  },
                  {
                    symbol: '\\mathcal{H}',
                    name: 'Hilbert Space',
                    desc: 'Spinor space L²(T⁸_Θ, S); representation space for the algebra action',
                    color: '#3B82F6',
                  },
                  {
                    symbol: 'D',
                    name: 'Dirac Operator',
                    desc: 'Self-adjoint operator encoding the metric geometry; spectrum bounded by μ',
                    color: '#9CA3AF',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-4"
                    style={{ border: `1px solid ${item.color}25`, background: `${item.color}06` }}
                  >
                    <div
                      className="text-2xl mb-2"
                      style={{ color: item.color }}
                    >
                      <InlineMath math={item.symbol} />
                    </div>
                    <div className="font-mono text-xs text-[#9CA3AF] mb-2">{item.name}</div>
                    <p className="text-xs text-[#E5E5E5]/60 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-[#E5E5E5]/60 leading-relaxed">
              The deformation parameter <InlineMath math="\Theta" /> is constrained by the
              four constants: its eigenvalues are functions of{' '}
              <InlineMath math="\mu, \varphi, \Omega, \beta" />, ensuring that the spectral
              triple is self-encoding — the geometry encodes its own constraint structure.
            </p>
          </Section>

          {/* B.5 — Empirical Status */}
          <Section title="Empirical Status" delay={0.4} id="empirical-status">
            <p className="text-[#E5E5E5]/70 mb-6 leading-relaxed">
              Preliminary empirical work identifies three regimes in recurrent neural network
              dynamics, corresponding to the three constraint levels below the spectral triple:
            </p>
            <div className="space-y-4">
              {[
                {
                  label: 'Regime I — Sub-threshold',
                  systems: 'Vanilla RNNs',
                  desc: 'Dynamics fail to reach the μ fixed point; attractors are unstable or degenerate.',
                  color: '#9CA3AF',
                },
                {
                  label: 'Regime II — Threshold',
                  systems: 'GRUs',
                  desc: 'Dynamics approach but do not fully satisfy the spinor complement constraint Ω; partial self-encoding.',
                  color: '#3B82F6',
                },
                {
                  label: 'Regime III — Self-Encoding',
                  systems: 'LSTMs',
                  desc: 'Dynamics satisfy all three lower-level constraints; attractors are stable and interpretable.',
                  color: '#FCD34D',
                },
              ].map((r, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-lg"
                  style={{ border: `1px solid ${r.color}25`, background: `${r.color}06` }}
                >
                  <div className="shrink-0 mt-0.5">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5"
                      style={{ background: r.color }}
                    />
                  </div>
                  <div>
                    <div className="font-mono text-xs mb-1" style={{ color: r.color }}>
                      {r.label}
                    </div>
                    <div className="text-xs text-white/80 mb-1 font-medium">{r.systems}</div>
                    <p className="text-xs text-[#E5E5E5]/60 leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#9CA3AF] mt-6 leading-relaxed">
              This taxonomy is preliminary. Formal empirical validation is the subject of
              ongoing research. See{' '}
              <a href="/research" className="text-[#3B82F6] underline underline-offset-2 hover:text-[#60A5FA]">
                /research
              </a>{' '}
              for current status.
            </p>
          </Section>

        </section>
      </div>

      <Footer />
    </div>
  );
}
