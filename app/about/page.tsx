import type { Metadata } from 'next'
import About from '../../page-components/About'

export const metadata: Metadata = {
  title: 'About - AEO Trivector',
  description: 'Meet the founder of AEO Trivector. Research at the intersection of spectral geometry, category theory, and geometric foundations for interpretable AI.',
  openGraph: {
    title: 'About - AEO Trivector',
    description: 'Meet the founder of AEO Trivector. Research at the intersection of spectral geometry, category theory, and geometric foundations for interpretable AI.',
    type: 'website',
  },
}

export default function AboutPage() {
  return <About />
}
