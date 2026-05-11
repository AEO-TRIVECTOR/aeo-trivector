'use client'

import dynamic from 'next/dynamic'

// This thin client wrapper owns the dynamic import so that ssr:false is legal.
// The actual accordion logic lives in FaqAccordion.tsx.
const FaqAccordion = dynamic(() => import('@/components/FaqAccordion'), {
  ssr: false,
  loading: () => (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-14 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        />
      ))}
    </div>
  ),
})

export default function FaqAccordionLoader({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>
}) {
  return <FaqAccordion faqs={faqs} />
}
