'use client'
// Updated: 2026-02-15 - Glassmorphic effect v3 - All inline styles

import { useState, useEffect, type CSSProperties } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function StickyGlassHeader() {
  const [scrolled, setScrolled] = useState(false);
  const location = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    transition: 'all 0.3s ease-out',
    background: scrolled 
      ? 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.2) 100%)' 
      : 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 100%)',
    backdropFilter: scrolled ? 'blur(35px) saturate(180%)' : 'blur(30px) saturate(180%)',
    WebkitBackdropFilter: scrolled ? 'blur(35px) saturate(180%)' : 'blur(30px) saturate(180%)',
    borderBottom: scrolled ? '1px solid rgba(255, 215, 0, 0.25)' : '1px solid rgba(255, 215, 0, 0.2)',
    boxShadow: scrolled 
      ? '0 4px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
      : '0 4px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  };

  const containerStyle: CSSProperties = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '1.25rem 3.75rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const logoStyle: CSSProperties = {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '1.5rem',
    fontWeight: 400,
    letterSpacing: '0.125em',
    color: '#FCD34D',
    cursor: 'pointer',
    transition: 'all 0.3s',
  };

  const navStyle: CSSProperties = {
    display: 'flex',
    gap: '2.5rem',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  };

  const getLinkStyle = (isActive: boolean): CSSProperties => ({
    fontSize: '0.875rem',
    fontWeight: 400,
    letterSpacing: '0.0625em',
    transition: 'all 0.3s',
    textDecoration: 'none',
    color: isActive ? '#FCD34D' : '#E5E5E5',
    opacity: isActive ? 1 : 0.7,
    filter: isActive 
      ? 'drop-shadow(0 0 15px rgba(252,211,77,0.4))' 
      : 'none',
  });

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <Link href="/manifold" style={{ textDecoration: 'none' }}>
          <div style={logoStyle}>
            AEO TRIVECTOR
          </div>
        </Link>

        <nav>
          <ul style={navStyle}>
            <li>
              <Link
                href="/manifold"
                style={getLinkStyle(location === '/manifold')}
              >
                MANIFOLD
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                style={getLinkStyle(location === '/about')}
              >
                ABOUT
              </Link>
            </li>
            <li>
              <Link
                href="/research"
                style={getLinkStyle(location === '/research')}
              >
                RESEARCH
              </Link>
            </li>
            <li>
              <Link
                href="/mathematics"
                style={getLinkStyle(location === '/mathematics')}
              >
                MATHEMATICS
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                style={getLinkStyle(location === '/contact')}
              >
                CONTACT
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
