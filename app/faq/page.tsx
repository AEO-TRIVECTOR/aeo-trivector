import type { Metadata } from 'next'
import FAQ from '../../page-components/FAQ'

export const metadata: Metadata = {
  title: 'FAQ - AEO Trivector',
  description: 'Frequently asked questions about AEO Trivector, attractor architecture, and geometric foundations for interpretable AI.',
  openGraph: {
    title: 'FAQ - AEO Trivector',
    description: 'Frequently asked questions about AEO Trivector and attractor architecture.',
    type: 'website',
  },
}

export default function FAQPage() {
  return <FAQ />
}
