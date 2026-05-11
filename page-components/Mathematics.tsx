// Server component — hero text renders on SSR for crawlers and noscript visitors.
// KaTeX math sections are in MathematicsContent (client component) due to ssr:false requirement.
// The WebGL canvas is loaded client-side only via next/dynamic (ssr: false).
import { StickyGlassHeader } from '@/components/StickyGlassHeader'
import Footer from '@/components/Footer'
import MathematicsContent from '@/components/MathematicsContent'
import AttractorCanvasLoader from '@/components/AttractorCanvasLoader'

// ── JSON-LD data ─────────────────────────────────────────────────────────────
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
])

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
})

// ── Main component ───────────────────────────────────────────────────────────
export default function Mathematics() {
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

      {/* Background — client-only, decorative */}
      <AttractorCanvasLoader count={8000} opacity={0.42} speed={1} />

      {/* Dark vignette overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 5,
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.80) 100%)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Content — hero is server-rendered; math sections are in client component */}
      <div className="relative z-10">

        {/* Hero — server-rendered */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
          <h1
            className="font-serif text-5xl md:text-6xl text-[#FCD34D] mb-4 tracking-[0.15em]"
            style={{ textShadow: '0 0 40px rgba(252, 211, 77, 0.3)' }}
          >
            The Formalism
          </h1>

          <p className="text-lg text-[#E5E5E5]/70 italic tracking-wide max-w-2xl mb-4">
            The mathematical spine: self-encoding dynamics, the constraint hierarchy,
            and dimension selection on the graded hypertorus T⁸.
          </p>

          <p className="font-mono text-sm text-[#9CA3AF] mb-10">
            Jared D. Dunahay · AEO Trivector LLC · Bedford, NH
          </p>

          <a
            href="/research"
            className="inline-block font-mono text-sm tracking-widest px-8 py-3 text-[#FCD34D] transition-all duration-300"
            style={{
              border: '1px solid rgba(252, 211, 77, 0.4)',
              background: 'rgba(252, 211, 77, 0.05)',
            }}
          >
            View Research →
          </a>
        </section>

        {/* Math content sections — client component (KaTeX requires ssr:false) */}
        <MathematicsContent />
      </div>

      <Footer />
    </div>
  )
}
