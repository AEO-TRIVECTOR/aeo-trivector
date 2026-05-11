export { runtime } from '@/lib/og-image'
export { ogSize as size } from '@/lib/og-image'
import { generateOgImage } from '@/lib/og-image'

export default function Image() {
  return generateOgImage({
    title: 'Contact',
    anchor: 'Academic correspondence and general inquiries.',
  })
}
