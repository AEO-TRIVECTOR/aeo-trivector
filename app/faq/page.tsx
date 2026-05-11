import type { Metadata } from 'next'
import FAQ from '../../page-components/FAQ'

const OG_IMAGE = '/attractor-torus.png'

export const metadata: Metadata = {
  title: { absolute: 'AEO Trivector — FAQ' },
  description:
    'Common questions about AEO Trivector: the research programme, its mathematics, the preprint status, and how to engage.',
  openGraph: {
    title: 'AEO Trivector — FAQ',
    description:
      'Common questions about AEO Trivector: the research programme, its mathematics, the preprint status, and how to engage.',
    type: 'website',
    url: 'https://aeotrivector.com/faq',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'AEO Trivector — FAQ' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AEO Trivector — FAQ',
    description:
      'Common questions about AEO Trivector: the research programme, its mathematics, and how to engage.',
    images: [OG_IMAGE],
  },
}

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is AEO Trivector?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AEO Trivector LLC is an independent research programme founded by Jared D. Dunahay and based in Bedford, NH. The programme investigates non-commutative geometry, Clifford algebra, and self-encoding dynamics.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the self-encoding dimension selection principle?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The self-encoding condition is the fixed-point equation μ = e^(−μ), whose solution is μ = W(1) ≈ 0.567143. The research programme asks whether this condition, imposed on a non-commutative deformation of the graded hypertorus T⁸, uniquely selects three spatial dimensions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the research peer-reviewed?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The paper has been submitted to the Journal of Mathematical Physics and peer review feedback was received in May 2026. The manuscript is currently in revision and has not yet been accepted or published.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is the code?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The website source is at github.com/AEO-TRIVECTOR/aeo-trivector. The companion research codebase is at github.com/Orion-sextant/the-manifold.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I get in touch?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For academic correspondence write to jared@trivector.ai. For press and general inquiries write to link@trivector.ai.',
      },
    },
  ],
}

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <FAQ />
    </>
  )
}
