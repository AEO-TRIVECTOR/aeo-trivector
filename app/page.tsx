'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// Dynamically import BlackHoleEntrance with no SSR
const BlackHoleEntrance = dynamic(
  () => import('@/components/entrance/BlackHoleEntrance'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          background: '#000',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>
          Loading...
        </div>
      </div>
    ),
  }
);

export default function Page() {
  const router = useRouter();

  const handleEnter = () => {
    router.push('/manifold');
  };

  return <BlackHoleEntrance onEnter={handleEnter} />;
}
