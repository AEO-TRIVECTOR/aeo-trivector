import type { NextConfig } from 'next'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      // Workaround: Next.js tries to generate Pages Router fallback error pages
      // even in pure App Router projects, causing <Html> import errors.
      const noopPath = resolve(__dirname, 'lib/noop.js')
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /next[\\/]dist[\\/]pages[\\/]_error/,
          noopPath
        ),
        new webpack.NormalModuleReplacementPlugin(
          /next[\\/]dist[\\/]pages[\\/]_document/,
          noopPath
        )
      )
    }
    return config
  },
}

export default nextConfig
