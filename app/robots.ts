import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/_next/'] }],
    sitemap: 'https://aeotrivector.com/sitemap.xml',
    host: 'https://aeotrivector.com',
  }
}
