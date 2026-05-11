import type { Metadata } from 'next'
import CompareClient from './CompareClient'

export const metadata: Metadata = {
  title: { absolute: 'AEO Trivector — Design Lab' },
  description: 'Internal design comparison tool for AEO Trivector entrance animations.',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
}

export default function ComparePage() {
  return <CompareClient />
}
