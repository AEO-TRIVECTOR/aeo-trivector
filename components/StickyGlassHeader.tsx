'use client'

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
        background: scrolled ? 'rgba(5, 5, 5, 0.85)' : 'rgba(5, 5, 5, 0.6)',
        backdropFilter: scrolled ? 'blur(30px) saturate(180%)' : 'blur(20px) saturate(150%)',
        WebkitBackdropFilter: scrolled ? 'blur(30px) saturate(180%)' : 'blur(20px) saturate(150%)',
        borderBottom: scrolled ? '1px solid rgba(252, 211, 77, 0.3)' : '1px solid rgba(252, 211, 77, 0.1)',
        boxShadow: scrolled ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(252, 211, 77, 0.1)' : '0 4px 16px rgba(0, 0, 0, 0.2)',
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
