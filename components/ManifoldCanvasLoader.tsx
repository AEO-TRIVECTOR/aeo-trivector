'use client'

import dynamic from 'next/dynamic'

// This thin client wrapper owns the dynamic import so that ssr:false is legal.
// The actual canvas logic lives in ManifoldCanvas.tsx.
const ManifoldCanvas = dynamic(() => import('@/components/ManifoldCanvas'), {
  ssr: false,
  loading: () => null,
})

export default function ManifoldCanvasLoader() {
  return <ManifoldCanvas />
}
