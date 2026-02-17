'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Dynamically import both versions with no SSR
const BlackHoleEntrance = dynamic(
  () => import('@/components/entrance/BlackHoleEntrance'),
  { ssr: false }
);

const BlackHoleEntranceGR = dynamic(
  () => import('@/components/entrance/BlackHoleEntranceGR'),
  { ssr: false }
);

export default function ComparePage() {
  const router = useRouter();
  const [useGR, setUseGR] = useState(false);

  const handleEnter = () => {
    router.push('/manifold');
  };

  const toggleVersion = () => {
    setUseGR(!useGR);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {useGR ? (
        <BlackHoleEntranceGR onEnter={handleEnter} />
      ) : (
        <BlackHoleEntrance onEnter={handleEnter} />
      )}
      
      {/* Toggle button */}
      <button
        onClick={toggleVersion}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: 300,
          letterSpacing: '0.1em',
          color: '#ffffff',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          cursor: 'pointer',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        }}
      >
        {useGR ? 'PHYSICS-ACCURATE (GR)' : 'ORIGINAL VERSION'}
      </button>
      
      {/* Info panel */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 1000,
          padding: '16px',
          maxWidth: '400px',
          fontSize: '12px',
          lineHeight: '1.6',
          color: 'rgba(255, 255, 255, 0.7)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backdropFilter: 'blur(10px)',
        }}
      >
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 300, letterSpacing: '0.1em' }}>
          {useGR ? 'PHYSICS-ACCURATE VERSION' : 'ORIGINAL VERSION'}
        </h3>
        {useGR ? (
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Multi-order photon rings (n=0,1,2)</li>
            <li>Proper Doppler beaming (D³⁺ᵅ formula)</li>
            <li>Gravitational redshift color shifts</li>
            <li>Kerr asymmetry (spin effects)</li>
            <li>Turbulence micro-structure</li>
            <li>Horizon absorption falloff</li>
          </ul>
        ) : (
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Simplified ring geometry</li>
            <li>Manual Doppler approximation</li>
            <li>Basic color modulation</li>
            <li>Post-processing bloom</li>
            <li>Optimized for performance</li>
          </ul>
        )}
      </div>
    </div>
  );
}
