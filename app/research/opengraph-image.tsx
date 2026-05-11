export { runtime } from '@/lib/og-image'
export { ogSize as size } from '@/lib/og-image'
import { generateOgImage } from '@/lib/og-image'

export default function Image() {
  return generateOgImage({
    title: 'Research',
    anchor:
      'Open research on self-encoding dynamics, non-commutative geometry, and Clifford algebra. Preprints, code, and reproducibility materials.',
  })
}
