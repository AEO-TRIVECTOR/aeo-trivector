export { runtime } from '@/lib/og-image'
export { ogSize as size } from '@/lib/og-image'
import { generateOgImage } from '@/lib/og-image'

export default function Image() {
  return generateOgImage({
    title: 'Manifold',
    anchor:
      'An independent research program in non-commutative geometry, Clifford algebra, and the mathematics of self-encoding dynamics.',
  })
}
