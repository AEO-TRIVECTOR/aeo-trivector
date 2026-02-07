import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  transpilePackages: ['three'],
  // Enable trailing slashes for static export compatibility
  trailingSlash: true,
}

export default nextConfig
