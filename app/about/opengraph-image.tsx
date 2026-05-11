export { runtime } from '@/lib/og-image'
export { ogSize as size } from '@/lib/og-image'
import { generateOgImage } from '@/lib/og-image'

export default function Image() {
  return generateOgImage({
    title: 'About',
    anchor:
      'AEO Trivector is the research vehicle of Jared D. Dunahay, an independent investigator in non-commutative geometry and self-encoding dynamics.',
  })
}
