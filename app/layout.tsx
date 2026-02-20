import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from 'next-themes'
import ErrorBoundary from '@/components/ErrorBoundary'
import './globals.css'

// Force Node.js runtime instead of Edge (WebGL needs full Node APIs)
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
