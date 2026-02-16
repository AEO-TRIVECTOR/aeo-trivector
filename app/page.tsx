'use client';

import dynamic from 'next/dynamic';

// Dynamically import EventHorizon with no SSR
const EventHorizon = dynamic(
  () => import('@/components/entrance/EventHorizon'),
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
  return <EventHorizon />;
}
