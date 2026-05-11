import type { Metadata } from 'next'
import Manifold from '../../page-components/Manifold'

export const metadata: Metadata = {
  // title.absolute bypasses the root layout template ('%s | AEO Trivector')
  // so the browser tab shows exactly this string with no suffix duplication.
  title: {
    absolute: 'AEO Trivector — Attractor Architecture',
  },
  description:
    'An independent research program in non-commutative geometry, Clifford algebra, and the mathematics of self-encoding dynamics. By Jared D. Dunahay, AEO Trivector LLC.',
  alternates: {
    canonical: '/manifold/',
  },
  openGraph: {
    title: 'AEO Trivector — Attractor Architecture',
    description: 'An independent research program in non-commutative geometry, Clifford algebra, and the mathematics of self-encoding dynamics.',
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
    title: 'AEO Trivector — Attractor Architecture',
    images: ['/images/attractor-torus.png'],
  },
}

export default function ManifoldPage() {
  return <Manifold />
}
