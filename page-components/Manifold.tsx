// Server component — hero text and pillar content renders on SSR for crawlers and noscript visitors.
// The WebGL canvas and interactive effects are loaded client-side only via next/dynamic (ssr: false).
import Link from 'next/link'
import Footer from '@/components/Footer'
import { StickyGlassHeader } from '@/components/StickyGlassHeader'
import ManifoldCanvasLoader from '@/components/ManifoldCanvasLoader'

// ── Pillar card ──────────────────────────────────────────────────────────────
function Pillar({ icon, title, descriptor }: { icon: string; title: string; descriptor: string }) {
  return (
    <div
      className="relative rounded-2xl p-10"
      style={{
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(28px) saturate(160%)',
        WebkitBackdropFilter: 'blur(28px) saturate(160%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 0 16px rgba(200, 168, 75, 0.08), inset 0 0 24px rgba(200, 168, 75, 0.03)',
      }}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-tr-2xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle at top right, rgba(200, 168, 75, 0.12), transparent 70%)',
          opacity: 0.5,
        }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center space-y-5" style={{ textAlign: 'center', width: '100%' }}>
        <div
          className="text-4xl"
          style={{
            color: '#C8A84B',
            filter: 'drop-shadow(0 0 6px rgba(200, 168, 75, 0.35))',
          }}
          aria-hidden="true"
        >
          {icon}
        </div>

        <h3
          className="font-serif text-xl tracking-wider uppercase"
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            letterSpacing: '0.15em',
            fontWeight: 400,
            textShadow: '0 2px 12px rgba(0,0,0,0.9)',
          }}
        >
          {title}
        </h3>

        <p
          className="text-sm leading-relaxed max-w-xs"
          style={{
            color: 'rgba(209, 213, 219, 0.85)',
            textShadow: '0 2px 8px rgba(0,0,0,0.9)',
            opacity: 0.6,
          }}
        >
          {descriptor}
        </p>
      </div>
    </div>
  )
}

// ── Pillar data ──────────────────────────────────────────────────────────────
const pillars = [
  {
    icon: '△',
    title: 'Structure',
    descriptor:
      'Topology is the invariant substrate; implementations may deform, the core does not. Stability is identity preserved under morphism.',
  },
  {
    icon: '◯',
    title: 'Dynamics',
    descriptor:
      'Vector fields evolve state through phase space; attractors compress possibility into trajectory. What converges is what survives iteration.',
  },
  {
    icon: '◇',
    title: 'Integration',
    descriptor:
      'Resonance synthesizes disparate representations into one operational geometry. The nexus is where models collapse into a coherent whole.',
  },
]

// ── Main component ───────────────────────────────────────────────────────────
export default function Manifold() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#000', overflow: 'hidden' }}>

      {/* Background canvas — client-only, decorative */}
      <ManifoldCanvasLoader />

      {/* Dark vignette overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 4,
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 20%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.75) 100%)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Subtle colour overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 5,
          background:
            'radial-gradient(circle at 50% 50%, rgba(200,168,75,0.04) 0%, rgba(45,106,159,0.03) 50%, rgba(0,0,0,0.01) 100%)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Shared navigation header */}
      <StickyGlassHeader />

      {/* Scrollable Content — server-rendered, visible immediately */}
      <div style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>

        {/* Hero Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 1.5rem',
            paddingTop: '22vh',
            paddingBottom: '3rem',
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(2.75rem, 9vw, 5.5rem)',
                letterSpacing: '0.1em',
                color: 'rgba(255, 255, 255, 0.95)',
                textShadow: '0 4px 20px rgba(0,0,0,0.95), 0 8px 40px rgba(0,0,0,0.8)',
                fontWeight: 300,
                textAlign: 'center',
                margin: 0,
              }}
            >
              AEO TRIVECTOR
            </h1>

            {/* Tagline */}
            <p
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'rgba(200, 168, 75, 0.85)',
                textShadow: '0 2px 8px rgba(0,0,0,0.95)',
                textAlign: 'center',
                marginTop: '1rem',
                opacity: 0.65,
              }}
            >
              Attractor Architecture
            </p>

            {/* Plain-English anchor */}
            <p
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)',
                letterSpacing: '0.02em',
                color: 'rgba(220, 220, 220, 0.7)',
                textShadow: '0 2px 12px rgba(0,0,0,0.95)',
                textAlign: 'center',
                marginTop: '1.5rem',
                maxWidth: '42rem',
                lineHeight: 1.7,
                fontStyle: 'italic',
                fontWeight: 300,
              }}
            >
              An independent research program in non-commutative geometry, Clifford algebra,
              and the mathematics of self-encoding dynamics.
            </p>

            {/* Byline */}
            <p
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                color: 'rgba(180, 180, 180, 0.55)',
                textShadow: '0 2px 8px rgba(0,0,0,0.95)',
                textAlign: 'center',
                marginTop: '1.25rem',
                textTransform: 'uppercase',
              }}
            >
              Jared D. Dunahay · AEO Trivector LLC · Bedford, NH
            </p>

            {/* Primary CTA */}
            <div style={{ marginTop: '2.5rem', pointerEvents: 'auto' }}>
              <Link
                href="/research"
                style={{
                  display: 'inline-block',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(200, 168, 75, 0.95)',
                  border: '1px solid rgba(200, 168, 75, 0.45)',
                  padding: '0.75rem 2.25rem',
                  textDecoration: 'none',
                  background: 'rgba(0,0,0,0.55)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  transition: 'all 0.35s ease',
                  boxShadow: '0 0 20px rgba(200, 168, 75, 0.1)',
                }}
              >
                View Research →
              </Link>
            </div>
          </div>
        </div>

        {/* Three Pillars */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '0 1.5rem',
            paddingBottom: '5rem',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem',
              width: '100%',
              maxWidth: '80rem',
              pointerEvents: 'auto',
            }}
          >
            {pillars.map((pillar) => (
              <Pillar
                key={pillar.title}
                icon={pillar.icon}
                title={pillar.title}
                descriptor={pillar.descriptor}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ pointerEvents: 'auto' }}>
          <Footer />
        </div>
      </div>
    </div>
  )
}
