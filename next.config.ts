import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['storage.googleapis.com'], // Adicione o domínio aqui
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
