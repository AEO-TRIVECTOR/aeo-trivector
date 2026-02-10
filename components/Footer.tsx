'use client'

export default function Footer() {
  return (
    <footer 
      style={{
        position: 'relative',
        zIndex: 20,
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '3rem 1.5rem',
        background: 'transparent',
        backdropFilter: 'none',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div style={{ 
        maxWidth: '80rem', 
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center', 
          gap: '2rem',
          width: '100%'
        }}>
          {/* Company Info */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div 
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.125rem',
                letterSpacing: '0.05em',
                fontWeight: 700,
                color: 'rgba(255, 215, 0, 0.9)',
                textShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
              }}
            >
              AEO TRIVECTOR LLC
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'rgb(156, 163, 175)' }}>
              © 2025-2026
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'rgb(156, 163, 175)' }}>
              <a 
                href="mailto:link@trivector.ai" 
                style={{ color: 'rgb(156, 163, 175)', textDecoration: 'none', transition: 'color 0.3s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}
              >
                link@trivector.ai
              </a>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'rgb(156, 163, 175)' }}>
              New Hampshire, USA
            </div>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgb(156, 163, 175)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div>
                <a 
                  href="/about/" 
                  style={{ color: 'rgb(156, 163, 175)', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}
                >
                  About
                </a>
              </div>
              <div>
                <a 
                  href="/research/" 
                  style={{ color: 'rgb(156, 163, 175)', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}
                >
                  Research
                </a>
              </div>
              <div>
                <a 
                  href="/contact/" 
                  style={{ color: 'rgb(156, 163, 175)', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}
                >
                  Contact
                </a>
              </div>
              <div>
                <a 
                  href="https://github.com/AEO-TRIVECTOR/trivector-research" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'rgb(156, 163, 175)', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* ORCID Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <a
              id="cy-effective-orcid-url"
              href="https://orcid.org/0009-0004-5735-2872"
              target="orcid.widget"
              rel="me noopener noreferrer"
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                fontFamily: 'JetBrains Mono, monospace', 
                fontSize: '0.75rem', 
                color: 'rgb(156, 163, 175)', 
                textDecoration: 'none',
                transition: 'color 0.3s',
                verticalAlign: 'top'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}
            >
              <img
                src="https://orcid.org/sites/default/files/images/orcid_16x16.png"
                style={{ width: '1em' }}
                alt="ORCID iD icon"
              />
              <span>https://orcid.org/0009-0004-5735-2872</span>
            </a>
          </div>

          {/* Attractor Torus Visual */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src="/images/attractor-torus.png"
              alt="Attractor Torus - Geometric visualization of attractor architecture"
              style={{
                width: '120px',
                height: 'auto',
                opacity: 0.8,
                filter: 'drop-shadow(0 0 20px rgba(96, 165, 250, 0.3))',
                transition: 'opacity 0.5s, filter 0.5s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.filter = 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.5))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.8';
                e.currentTarget.style.filter = 'drop-shadow(0 0 20px rgba(96, 165, 250, 0.3))';
              }}
            />
          </div>

          {/* Tagline */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div 
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'rgba(96, 165, 250, 0.7)',
                textShadow: '0 0 20px rgba(96, 165, 250, 0.3)',
              }}
            >
              ATTRACTOR ARCHITECTURE
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
