import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  transpilePackages: ['three'],
  // Disable trailing slashes for cleaner URLs
  trailingSlash: false,
}

export default nextConfig
