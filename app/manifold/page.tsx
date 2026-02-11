import type { Metadata } from 'next'
import Manifold from '../../page-components/Manifold'

export const metadata: Metadata = {
  title: 'Vision - AEO Trivector | Attractor Architecture',
  description:
    'Explore the three pillars of attractor architecture: Structure, Dynamics, and Integration. Geometric foundations for interpretable AI systems.',
  alternates: {
    canonical: '/manifold/',
  },
  openGraph: {
    title: 'Vision - AEO Trivector | Attractor Architecture',
    description: 'Explore the three pillars of attractor architecture: Structure, Dynamics, and Integration.',
    type: 'website',
    url: '/manifold/',
    images: [
      {
        url: '/images/attractor-torus.png',
        width: 1200,
        height: 630,
        alt: 'AEO Trivector manifold experience',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/attractor-torus.png'],
  },
}

export default function ManifoldPage() {
  return <Manifold />
}
