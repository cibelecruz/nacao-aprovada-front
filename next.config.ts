import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['storage.googleapis.com'], // Mantenha este
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
    ],
  },

  // >>> ADICIONE ESTE BLOCO AQUI <<<
  async rewrites() {
    return [
      {
        source: '/coach_api/:path*', // Todas as requisições para /coach_api/QUALQUER_COISA
        destination: `${process.env.API_URL || 'http://localhost:8080/'}:path*`, // Serão reescritas para API_URL + path
      },
    ];
  },
  // >>> FIM DO BLOCO ADICIONADO <<<
}

export default nextConfig