'use client'

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Attractor } from '@/components/Attractor';
import { motion, AnimatePresence } from 'framer-motion';
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

// ── FAQ data — 8 accurate Q&As ───────────────────────────────────────────────
const faqs = [
  {
    question: 'What is AEO Trivector?',
    answer:
      'AEO Trivector LLC is an independent research programme founded by Jared D. Dunahay and based in Bedford, NH. The programme investigates non-commutative geometry, Clifford algebra, and self-encoding dynamics — specifically the mathematical conditions under which a physical or computational system can select its own dimensionality.',
  },
  {
    question: 'What is the self-encoding dimension selection principle?',
    answer:
      'The self-encoding condition is the fixed-point equation μ = e^(−μ), whose solution is μ = W(1) ≈ 0.567143 (the principal value of the Lambert W function at 1). A geometry satisfying this condition is said to be self-encoding: its own constraint constant is the unique solution to the equation that defines it. The research programme asks whether this condition, when imposed on a non-commutative deformation of the graded hypertorus T⁸, uniquely selects three spatial dimensions.',
  },
  {
    question: 'Why three spatial dimensions specifically?',
    answer:
      'Three interlocking selection mechanisms are proposed. Sphere selection: the 3-sphere S³ is the only sphere whose volume-to-surface ratio equals μ at the self-encoding scale. Bridge selection: the Clifford bridge Cl(3,0) → Cl(0,3) is the unique low-dimensional bridge consistent with the constraint. Threshold selection: the spectral threshold β = 1 − μ ≈ 0.433 is crossed exactly at dimension 3 under the graded hypertorus construction. The paper in preparation argues these three mechanisms are not independent — they are three faces of the same algebraic constraint.',
  },
  {
    question: 'What is the graded hypertorus T⁸?',
    answer:
      'T⁸_Θ is a non-commutative deformation of the product space S¹ × T³ × T³ × S¹, where the deformation is indexed by the Clifford algebra Cl(3,0). The eight factors correspond to the eight generators of the graded structure. The non-commutativity parameter Θ is not a free parameter — it is fixed by the self-encoding condition μ = W(1).',
  },
  {
    question: 'Where is the code?',
    answer:
      'Two repositories are publicly available. The website source is at github.com/AEO-TRIVECTOR/aeo-trivector (Next.js 15 + Three.js). The companion research codebase is at github.com/Orion-sextant/the-manifold. Numerical verification scripts for the dimension selection mechanisms will be added to the companion repository once the preprint is posted.',
  },
  {
    question: 'How do I cite this work?',
    answer:
      'The primary paper — "Self-Encoding Geometry on Clifford Manifolds: Dimension Selection from the Lambert W Function" by Jared D. Dunahay — is currently in revision at the Journal of Mathematical Physics. An arXiv preprint is forthcoming. A BibTeX entry will be posted on the Research page once the arXiv identifier is assigned.',
  },
  {
    question: 'Is the research peer-reviewed?',
    answer:
      'The paper has been submitted to the Journal of Mathematical Physics and peer review feedback was received in May 2026. The manuscript is currently in revision. It has not yet been accepted or published. Claims on this website reflect the submitted manuscript and should be treated as preliminary until publication.',
  },
  {
    question: 'How do I get in touch?',
    answer:
      'For academic correspondence — research collaboration, preprint feedback, or peer review — write to jared@trivector.ai. For press, speaking, and general inquiries, write to link@trivector.ai. Response time is typically within one week.',
  },
];

// ── Main component ───────────────────────────────────────────────────────────
export default function FAQ() {
  const [mounted, setMounted] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
          className="mb-16 text-center"
        >
          <h1
            className="font-serif text-5xl md:text-6xl mb-5 tracking-[0.12em]"
            style={{ color: '#FCD34D', textShadow: '0 0 40px rgba(252,211,77,0.28)' }}
          >
            FAQ
          </h1>
          <p className="text-base italic mb-3" style={{ color: 'rgba(229,229,229,0.75)' }}>
            Common questions about the research programme, its mathematics, and how to engage.
          </p>
          <p className="text-xs font-mono tracking-widest" style={{ color: 'rgba(229,229,229,0.4)' }}>
            Jared D. Dunahay · AEO Trivector LLC · Bedford, NH
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
            >
              <div
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="cursor-pointer transition-all duration-300"
                style={{
                  background: 'rgba(0,0,0,0.45)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: `1px solid ${openIndex === index ? 'rgba(252,211,77,0.35)' : 'rgba(252,211,77,0.12)'}`,
                  boxShadow: openIndex === index
                    ? '0 0 24px rgba(252,211,77,0.1)'
                    : '0 0 12px rgba(252,211,77,0.04)',
                }}
              >
                {/* Question row */}
                <div className="flex items-start justify-between gap-4 px-7 py-6">
                  <h3
                    className="font-serif text-lg leading-snug flex-1"
                    style={{ color: openIndex === index ? '#FCD34D' : 'rgba(229,229,229,0.9)' }}
                  >
                    {faq.question}
                  </h3>
                  <motion.span
                    animate={{ rotate: openIndex === index ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-shrink-0 text-2xl font-light leading-none mt-0.5"
                    style={{ color: '#3B82F6' }}
                  >
                    +
                  </motion.span>
                </div>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p
                        className="px-7 pb-7 text-sm leading-relaxed"
                        style={{ color: 'rgba(229,229,229,0.72)' }}
                      >
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
