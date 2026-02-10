'use client'

export default function Footer() {
  return (
    <footer 
      className="relative z-20 border-t px-6 py-12"
      style={{
        background: 'transparent',
        borderColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'none',
      }}
    >
      <div className="max-w-7xl mx-auto" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {/* Always centered layout */}
        <div className="flex flex-col items-center text-center gap-8" style={{ width: '100%', maxWidth: '100%' }}>
          {/* Company Info */}
          <div className="space-y-2 flex flex-col items-center">
            <div 
              className="font-serif text-lg tracking-wider font-bold"
              style={{
                color: 'rgba(255, 215, 0, 0.9)',
                textShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
              }}
            >
              AEO TRIVECTOR LLC
            </div>
            <div className="font-mono text-xs text-gray-400">
              © 2025-2026
            </div>
            <div className="font-mono text-xs text-gray-400">
              <a 
                href="mailto:link@trivector.ai" 
                className="hover:text-[#FFD700] transition-colors duration-300"
              >
                link@trivector.ai
              </a>
            </div>
            <div className="font-mono text-xs text-gray-400">
              New Hampshire, USA
            </div>
          </div>

          {/* Links */}
          <div className="space-y-2 flex flex-col items-center">
            <div className="font-mono text-xs tracking-widest uppercase text-gray-400 space-y-2 flex flex-col items-center">
              <div>
                <a 
                  href="/about/" 
                  className="hover:text-[#FFD700] transition-colors duration-300"
                >
                  About
                </a>
              </div>
              <div>
                <a 
                  href="/research/" 
                  className="hover:text-[#FFD700] transition-colors duration-300"
                >
                  Research
                </a>
              </div>
              <div>
                <a 
                  href="/contact/" 
                  className="hover:text-[#FFD700] transition-colors duration-300"
                >
                  Contact
                </a>
              </div>
              <div>
                <a 
                  href="https://github.com/AEO-TRIVECTOR" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FFD700] transition-colors duration-300"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* ORCID Badge */}
          <div className="flex items-center justify-center">
            <a
              id="cy-effective-orcid-url"
              className="inline-flex items-center gap-2 font-mono text-xs text-gray-400 hover:text-[#FFD700] transition-colors duration-300"
              href="https://orcid.org/0009-0004-5735-2872"
              target="orcid.widget"
              rel="me noopener noreferrer"
              style={{ verticalAlign: 'top' }}
            >
              <img
                src="https://orcid.org/sites/default/files/images/orcid_16x16.png"
                style={{ width: '1em' }}
                alt="ORCID iD icon"
              />
              <span>https://orcid.org/0009-0004-5735-2872</span>
            </a>
          </div>

          {/* Tagline */}
          <div className="flex items-center justify-center">
            <div 
              className="font-mono text-xs tracking-[0.3em] uppercase"
              style={{
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
