import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://aeotrivector.com'
  const now = new Date()
  return [
    { url: `${base}/`,            lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${base}/manifold`,    lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/research`,    lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/mathematics`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/about`,       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`,     lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${base}/faq`,         lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]
}
