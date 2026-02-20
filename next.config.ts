import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable dynamic rendering for R3F
  images: {
    unoptimized: true,
  },
  transpilePackages: ['three'],
}

export default nextConfig
