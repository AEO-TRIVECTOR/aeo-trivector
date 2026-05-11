import type { Metadata } from 'next'
import Research from '../../page-components/Research'

export const metadata: Metadata = {
  title: 'Research - AEO Trivector',
  description: 'Mathematical research in spectral geometry, attractor dynamics, and geometric foundations for interpretable AI. Open source implementations and experimental code.',
  openGraph: {
    title: 'Research - AEO Trivector',
    description: 'Mathematical research in spectral geometry, attractor dynamics, and geometric foundations for interpretable AI.',
    type: 'website',
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
  creativeWorkStatus: 'InPreparation',
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
