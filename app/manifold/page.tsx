import type { Metadata } from 'next'
import Manifold from '../../page-components/Manifold'

export const metadata: Metadata = {
  title: 'Vision - AEO Trivector | Attractor Architecture',
  description: 'Explore the three pillars of attractor architecture: Structure, Dynamics, and Integration. Geometric foundations for interpretable AI systems.',
  openGraph: {
    title: 'Vision - AEO Trivector | Attractor Architecture',
    description: 'Explore the three pillars of attractor architecture: Structure, Dynamics, and Integration.',
    type: 'website',
  },
}

export default function ManifoldPage() {
  return <Manifold />
}
