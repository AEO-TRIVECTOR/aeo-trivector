import type { Metadata } from 'next'
import Research from '../../page-components/Research'

export const metadata: Metadata = {
  title: 'Research - AEO Trivector',
  description: 'Mathematical research in spectral geometry, attractor dynamics, and geometric foundations for interpretable AI. Open source implementations and experimental code.',
  openGraph: {
    title: 'Research - AEO Trivector',
    description: 'Mathematical research in spectral geometry, attractor dynamics, and geometric foundations for interpretable AI.',
    type: 'website',
  },
}

export default function ResearchPage() {
  return <Research />
}
