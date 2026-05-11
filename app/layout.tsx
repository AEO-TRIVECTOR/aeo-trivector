import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from 'next-themes'
import ErrorBoundary from '@/components/ErrorBoundary'
import './globals.css'

// Force dynamic rendering - R3F/WebGL cannot be statically generated
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://aeotrivector.com'),
  title: {
    default: 'AEO Trivector - Attractor Architecture',
    template: '%s | AEO Trivector',
  },
  description: 'Geometric foundations for interpretable AI. AI systems that are interpretable because they\'re stable—geometrically inevitable, not reverse-engineered.',
  keywords: ['attractor architecture', 'spectral geometry', 'interpretable AI', 'geometric AI', 'category theory', 'Lorenz attractor', 'AEO Trivector'],
  authors: [{ name: 'Jared Dunahay', url: 'https://orcid.org/0009-0004-5735-2872' }],
  creator: 'AEO Trivector LLC',
  openGraph: {
    title: 'AEO Trivector - Attractor Architecture',
    description: 'Geometric foundations for interpretable AI. AI systems that are interpretable because they\'re stable—geometrically inevitable, not reverse-engineered.',
    url: 'https://aeotrivector.com',
    siteName: 'AEO Trivector',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/attractor-torus.png',
        width: 1200,
        height: 630,
        alt: 'AEO Trivector Lorenz-inspired attractor visual',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AEO Trivector - Attractor Architecture',
    description: 'Geometric foundations for interpretable AI.',
    images: ['/images/attractor-torus.png'],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
}

// ── A.4 JSON-LD: Organization + Person ──────────────────────────────────────
const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AEO Trivector LLC',
  alternateName: 'AEO Trivector',
  url: 'https://aeotrivector.com',
  logo: 'https://aeotrivector.com/icon.png',
  email: 'link@trivector.ai',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bedford',
    addressRegion: 'NH',
    addressCountry: 'US',
  },
  founder: {
    '@type': 'Person',
    name: 'Jared D. Dunahay',
    sameAs: 'https://orcid.org/0009-0004-5735-2872',
  },
  description:
    'An independent research program in non-commutative geometry, Clifford algebra, and the mathematics of self-encoding dynamics.',
}

const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jared D. Dunahay',
  givenName: 'Jared',
  familyName: 'Dunahay',
  additionalName: 'D.',
  url: 'https://aeotrivector.com',
  email: 'jared@trivector.ai',
  affiliation: {
    '@type': 'Organization',
    name: 'AEO Trivector LLC',
    url: 'https://aeotrivector.com',
  },
  sameAs: [
    'https://orcid.org/0009-0004-5735-2872',
    'https://github.com/AEO-TRIVECTOR',
    'https://github.com/Orion-sextant',
  ],
  identifier: [
    {
      '@type': 'PropertyValue',
      propertyID: 'ORCID',
      value: '0009-0004-5735-2872',
    },
  ],
  knowsAbout: [
    'Non-commutative geometry',
    'Clifford algebra',
    'Self-encoding dynamics',
    'Spectral triples',
    'Lambert W function',
    'Graded hypertorus',
  ],
}
// ────────────────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
        {/* A.4 — Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        {/* A.4 — Person JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
      </head>
      <body>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {children}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
