import type { Metadata } from 'next'
import FAQ from '../../page-components/FAQ'

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
    // Dynamic OG image served by app/faq/opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AEO Trivector — FAQ',
    description:
      'Common questions about AEO Trivector: the research programme, its mathematics, and how to engage.',
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
    {
      '@type': 'Question',
      name: 'Why three spatial dimensions specifically?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The dimension selection argument operates through three interlocking mechanisms. Sphere selection: the self-encoding constraint μ = W(1) ≈ 0.567143 yields x*(μ) = 1/(φ√(1−μ²)) ≈ 3.006, which is uniquely close to the integer 3. Bridge selection: the Clifford algebra Cl(3,0) is the unique graded algebra in which the even and odd sub-algebras are isomorphic, providing a self-consistent algebraic bridge. Threshold selection: the constraint hierarchy has exactly six levels (Levels 0–5) whose combined threshold structure is compatible only with a three-dimensional base manifold. No other integer dimension satisfies all three conditions simultaneously.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the graded hypertorus T⁸?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The graded hypertorus T⁸_Θ is the geometric arena of the research programme. It is the product manifold S¹ × T³ × T³ × S¹, where the outer S¹ factors carry the grading and the inner T³ × T³ factors carry the spatial and momentum degrees of freedom. A non-commutative deformation parameter Θ (drawn from the Clifford algebra Cl(3,0)) is imposed on this torus, and the self-encoding condition μ = W(1) is then required to hold on the deformed geometry. The spectral triple (A, H, D) — algebra, Hilbert space, Dirac operator — is defined on T⁸_Θ and encodes the full geometric and algebraic structure.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I cite this work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A BibTeX entry will be provided once the arXiv preprint is posted. In the meantime, you may cite the work as: Dunahay, J. D. (2026). Self-Encoding Geometry on Clifford Manifolds: Dimension Selection from the Lambert W Function. Manuscript submitted to Journal of Mathematical Physics. ORCID: 0009-0004-5735-2872.',
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
