import type { Metadata } from 'next'
import Mathematics from '../../page-components/Mathematics'

export const metadata: Metadata = {
  title: {
    absolute: 'AEO Trivector — Mathematics',
  },
  description:
    'The mathematical spine of AEO Trivector: self-encoding dynamics, constraint hierarchy, dimension selection on the graded hypertorus T⁸, and spectral triple structure.',
  openGraph: {
    title: 'AEO Trivector — Mathematics',
    description:
      'Self-encoding geometry: constraint hierarchy, dimension selection via W(1), and spectral triple on the graded hypertorus T⁸_Θ.',
    type: 'website',
    url: 'https://aeotrivector.com/mathematics',
    // Dynamic OG image served by app/mathematics/opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AEO Trivector — Mathematics',
    description:
      'Self-encoding geometry: constraint hierarchy, dimension selection via W(1), and spectral triple on T⁸_Θ.',
  },
}

export default function MathematicsPage() {
  return <Mathematics />
}
