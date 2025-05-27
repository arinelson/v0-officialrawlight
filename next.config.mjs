/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações para Netlify
  output: process.env.NETLIFY === 'true' ? "standalone" : undefined,
  
  // Configurações gerais
  images: {
    domains: ['localhost', 'officialrawlight.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: process.env.NETLIFY === 'true', // Unoptimized images for Netlify
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configurações de segurança
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Configuração para tratar corretamente rotas dinâmicas durante a exportação
  trailingSlash: false,
}

export default nextConfig;
