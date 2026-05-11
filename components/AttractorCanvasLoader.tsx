'use client'

import dynamic from 'next/dynamic'

// This thin client wrapper owns the dynamic import so that ssr:false is legal.
// The actual canvas logic lives in AttractorCanvas.tsx.
const AttractorCanvas = dynamic(() => import('@/components/AttractorCanvas'), {
  ssr: false,
  loading: () => null,
})

export default function AttractorCanvasLoader({
  count,
  opacity,
  speed,
}: {
  count?: number
  opacity?: number
  speed?: number
}) {
  return <AttractorCanvas count={count} opacity={opacity} speed={speed} />
}
