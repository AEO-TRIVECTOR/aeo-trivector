import type { Metadata } from 'next'
import Contact from '../../page-components/Contact'

export const metadata: Metadata = {
  title: { absolute: 'AEO Trivector — Contact' },
  description:
    'Academic and general correspondence for AEO Trivector LLC. Write to jared@trivector.ai for research inquiries.',
  openGraph: {
    title: 'AEO Trivector — Contact',
    description:
      'Academic and general correspondence for AEO Trivector LLC. Write to jared@trivector.ai for research inquiries.',
    type: 'website',
    url: 'https://aeotrivector.com/contact',
    // Dynamic OG image served by app/contact/opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AEO Trivector — Contact',
    description:
      'Academic and general correspondence for AEO Trivector LLC.',
  },
}

const contactLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact AEO Trivector',
  url: 'https://aeotrivector.com/contact',
  description: 'Academic and general correspondence for AEO Trivector LLC.',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      email: 'jared@trivector.ai',
      contactType: 'academic',
      availableLanguage: 'English',
    },
    {
      '@type': 'ContactPoint',
      email: 'link@trivector.ai',
      contactType: 'customer support',
      availableLanguage: 'English',
    },
  ],
}

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd) }}
      />
      <Contact />
    </>
  )
}
