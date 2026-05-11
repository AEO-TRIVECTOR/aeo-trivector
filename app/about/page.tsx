import type { Metadata } from 'next'
import About from '../../page-components/About'

export const metadata: Metadata = {
  title: { absolute: 'AEO Trivector — About' },
  description:
    'AEO Trivector is the research vehicle of Jared D. Dunahay, an independent investigator in non-commutative geometry and self-encoding dynamics.',
  openGraph: {
    title: 'AEO Trivector — About',
    description:
      'AEO Trivector is the research vehicle of Jared D. Dunahay, an independent investigator in non-commutative geometry and self-encoding dynamics.',
    type: 'website',
    url: 'https://aeotrivector.com/about',
    // Dynamic OG image served by app/about/opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AEO Trivector — About',
    description:
      'AEO Trivector is the research vehicle of Jared D. Dunahay, an independent investigator in non-commutative geometry and self-encoding dynamics.',
  },
}

export default function AboutPage() {
  return <About />
}
