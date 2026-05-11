export { runtime } from '@/lib/og-image'
export { ogSize as size } from '@/lib/og-image'
import { generateOgImage } from '@/lib/og-image'

export default function Image() {
  return generateOgImage({
    title: 'FAQ',
    anchor:
      'Common questions about the research program, its mathematics, and how to engage.',
  })
}
