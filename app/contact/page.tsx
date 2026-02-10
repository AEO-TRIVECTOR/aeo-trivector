import type { Metadata } from 'next'
import Contact from '../../page-components/Contact'

export const metadata: Metadata = {
  title: 'Contact - AEO Trivector',
  description: 'Get in touch with AEO Trivector LLC. Based in New Hampshire, USA. Inquiries about attractor architecture research and collaboration.',
  openGraph: {
    title: 'Contact - AEO Trivector',
    description: 'Get in touch with AEO Trivector LLC. Inquiries about attractor architecture research and collaboration.',
    type: 'website',
  },
}

export default function ContactPage() {
  return <Contact />
}
