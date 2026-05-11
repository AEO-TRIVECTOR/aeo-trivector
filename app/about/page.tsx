import type { Metadata } from 'next'
import About from '../../page-components/About'

const OG_IMAGE = '/attractor-torus.png'

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
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'AEO Trivector — About' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AEO Trivector — About',
    description:
      'AEO Trivector is the research vehicle of Jared D. Dunahay, an independent investigator in non-commutative geometry and self-encoding dynamics.',
    images: [OG_IMAGE],
  },
}

export default function AboutPage() {
  return <About />
}
