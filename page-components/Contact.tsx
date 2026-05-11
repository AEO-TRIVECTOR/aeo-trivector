// Server component — content renders on SSR for crawlers and noscript visitors.
// The WebGL canvas is loaded client-side only via next/dynamic (ssr: false).
import { StickyGlassHeader } from '@/components/StickyGlassHeader'
import Footer from '@/components/Footer'
import AttractorCanvasLoader from '@/components/AttractorCanvasLoader'

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
      aria-hidden="true"
    />
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function Contact() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#000', overflow: 'hidden' }}>
      <StickyGlassHeader />

      {/* Background — client-only, decorative */}
      <AttractorCanvasLoader count={8000} opacity={0.42} speed={0.8} />
      <Vignette />

      {/* Content — server-rendered, visible immediately */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-40 pb-32">
        {/* Hero */}
        <div className="mb-20 text-center">
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
        </div>

        {/* Two mailto buttons */}
        <div className="grid gap-6 md:grid-cols-2 mb-16">
          {/* Academic */}
          <a href="mailto:jared@trivector.ai" style={{ textDecoration: 'none' }}>
            <div
              className="p-8 h-full"
              style={{
                background: 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(252,211,77,0.2)',
                boxShadow: '0 0 24px rgba(252,211,77,0.06)',
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
              className="p-8 h-full"
              style={{
                background: 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(59,130,246,0.2)',
                boxShadow: '0 0 24px rgba(59,130,246,0.06)',
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
        </div>

        {/* Footer detail */}
        <p
          className="text-center text-xs font-mono tracking-widest"
          style={{ color: 'rgba(229,229,229,0.3)' }}
        >
          AEO Trivector LLC · Bedford, NH, USA
        </p>
      </div>

      <Footer />
    </div>
  )
}
