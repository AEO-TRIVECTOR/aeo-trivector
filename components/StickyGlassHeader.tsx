'use client'
// Updated: 2026-02-15 - Glassmorphic effect v2

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function StickyGlassHeader() {
  const [scrolled, setScrolled] = useState(false);
  const location = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      // Activate glass effect after 50px scroll
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out"
      style={{
        background: scrolled 
          ? 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.2) 100%)' 
          : 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 100%)',
        backdropFilter: scrolled ? 'blur(35px) saturate(180%)' : 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: scrolled ? 'blur(35px) saturate(180%)' : 'blur(30px) saturate(180%)',
        borderBottom: scrolled ? '1px solid rgba(255, 215, 0, 0.25)' : '1px solid rgba(255, 215, 0, 0.2)',
        boxShadow: scrolled 
          ? '0 4px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
          : '0 4px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-[60px] py-5 flex justify-between items-center">
        {/* Logo */}
        <Link href="/manifold">
          <div className="font-serif text-2xl font-normal tracking-[2px] text-[#FCD34D] cursor-pointer transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(252,211,77,0.6)]">
            AEO TRIVECTOR
          </div>
        </Link>

        {/* Navigation Links */}
        <nav>
          <ul className="flex gap-10 list-none">
            <li>
              <Link
                href="/manifold"
                className={`
                  text-sm font-normal tracking-[1px] transition-all duration-300
                  ${location === '/manifold' 
                    ? 'text-[#FCD34D] opacity-100 drop-shadow-[0_0_15px_rgba(252,211,77,0.4)]' 
                    : 'text-[#E5E5E5] opacity-70 hover:text-[#FCD34D] hover:opacity-100 hover:drop-shadow-[0_0_15px_rgba(252,211,77,0.4)]'
                  }
                `}
              >
                MANIFOLD
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`
                  text-sm font-normal tracking-[1px] transition-all duration-300
                  ${location === '/about' 
                    ? 'text-[#FCD34D] opacity-100 drop-shadow-[0_0_15px_rgba(252,211,77,0.4)]' 
                    : 'text-[#E5E5E5] opacity-70 hover:text-[#FCD34D] hover:opacity-100 hover:drop-shadow-[0_0_15px_rgba(252,211,77,0.4)]'
                  }
                `}
              >
                ABOUT
              </Link>
            </li>
            <li>
              <Link
                href="/research"
                className={`
                  text-sm font-normal tracking-[1px] transition-all duration-300
                  ${location === '/research' 
                    ? 'text-[#FCD34D] opacity-100 drop-shadow-[0_0_15px_rgba(252,211,77,0.4)]' 
                    : 'text-[#E5E5E5] opacity-70 hover:text-[#FCD34D] hover:opacity-100 hover:drop-shadow-[0_0_15px_rgba(252,211,77,0.4)]'
                  }
                `}
              >
                RESEARCH
              </Link>
            </li>
            <li>
              <Link
                href="/mathematics"
                className={`
                  text-sm font-normal tracking-[1px] transition-all duration-300
                  ${location === '/mathematics' 
                    ? 'text-[#FCD34D] opacity-100 drop-shadow-[0_0_15px_rgba(252,211,77,0.4)]' 
                    : 'text-[#E5E5E5] opacity-70 hover:text-[#FCD34D] hover:opacity-100 hover:drop-shadow-[0_0_15px_rgba(252,211,77,0.4)]'
                  }
                `}
              >
                MATHEMATICS
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={`
                  text-sm font-normal tracking-[1px] transition-all duration-300
                  ${location === '/contact' 
                    ? 'text-[#FCD34D] opacity-100 drop-shadow-[0_0_15px_rgba(252,211,77,0.4)]' 
                    : 'text-[#E5E5E5] opacity-70 hover:text-[#FCD34D] hover:opacity-100 hover:drop-shadow-[0_0_15px_rgba(252,211,77,0.4)]'
                  }
                `}
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
