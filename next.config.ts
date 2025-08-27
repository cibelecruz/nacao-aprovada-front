import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['storage.googleapis.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
    ],
  },
  // A FUNÇÃO async rewrites() FOI REMOVIDA DAQUI
}

export default nextConfig