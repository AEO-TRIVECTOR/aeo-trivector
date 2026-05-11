import type { Metadata } from 'next'
import Research from '../../page-components/Research'

const OG_IMAGE = '/attractor-torus.png'

export const metadata: Metadata = {
  title: { absolute: 'AEO Trivector — Research' },
  description:
    'Open research on self-encoding dynamics, non-commutative geometry, and Clifford algebra. Preprints, code, and reproducibility materials.',
  openGraph: {
    title: 'AEO Trivector — Research',
    description:
      'Open research on self-encoding dynamics, non-commutative geometry, and Clifford algebra. Preprints, code, and reproducibility materials.',
    type: 'website',
    url: 'https://aeotrivector.com/research',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'AEO Trivector — Research' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AEO Trivector — Research',
    description:
      'Open research on self-encoding dynamics, non-commutative geometry, and Clifford algebra.',
    images: [OG_IMAGE],
  },
}

// ── A.5 JSON-LD: ScholarlyArticle stub (T⁸_Θ preprint) ─────────────────────
const articleLd = {
  '@context': 'https://schema.org',
  '@type': 'ScholarlyArticle',
  headline:
    'Self-Encoding Geometry on Clifford Manifolds: Dimension Selection from the Lambert W Function',
  name: 'Self-Encoding Geometry on Clifford Manifolds',
  author: {
    '@type': 'Person',
    name: 'Jared D. Dunahay',
    affiliation: 'AEO Trivector LLC',
    sameAs: 'https://orcid.org/0009-0004-5735-2872',
  },
  // 'Submitted' is the closest valid Schema.org CreativeWorkStatus for 'in revision'
  creativeWorkStatus: 'Submitted',
  about:
    'Non-commutative deformation of the graded hypertorus T⁸ indexed by Cl(3,0); dimension selection from the Lambert W function W(1) = 0.567143',
  keywords:
    'Clifford algebra, spectral triples, Lambert W function, graded hypertorus, dimension selection, non-commutative geometry',
}
// ────────────────────────────────────────────────────────────────────────────

export default function ResearchPage() {
  return (
    <>
      {/* A.5 — ScholarlyArticle JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <Research />
    </>
  )
}
