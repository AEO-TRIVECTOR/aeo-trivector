export { runtime } from '@/lib/og-image'
export { ogSize as size } from '@/lib/og-image'
import { generateOgImage } from '@/lib/og-image'

export default function Image() {
  return generateOgImage({
    title: 'Mathematics',
    anchor:
      'The mathematical spine: self-encoding dynamics, the constraint hierarchy, and dimension selection on the graded hypertorus T⁸.',
  })
}
