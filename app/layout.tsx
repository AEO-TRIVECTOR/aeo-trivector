import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from 'next-themes'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export const metadata: Metadata = {
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
    url: 'https://aeo-trivector.vercel.app',
    siteName: 'AEO Trivector',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AEO Trivector - Attractor Architecture',
    description: 'Geometric foundations for interpretable AI.',
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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
