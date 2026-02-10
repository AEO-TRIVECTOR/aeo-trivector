import type { Metadata } from 'next'
import Mathematics from '../../page-components/Mathematics'

export const metadata: Metadata = {
  title: 'Mathematics - AEO Trivector',
  description: 'The mathematical foundations of attractor architecture. Spectral geometry, Laplacian eigenmaps, and category-theoretic frameworks for stable AI systems.',
  openGraph: {
    title: 'Mathematics - AEO Trivector',
    description: 'The mathematical foundations of attractor architecture. Spectral geometry and category-theoretic frameworks.',
    type: 'website',
  },
}

export default function MathematicsPage() {
  return <Mathematics />
}
