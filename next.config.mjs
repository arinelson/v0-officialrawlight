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
  
  // Configurações de internacionalização - Usando o App Router, removemos a configuração i18n aqui
  // pois ela é específica para o Pages Router
  
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
  
  // Configuração experimental para melhorar a exportação estática
  experimental: {
    // Habilita a geração estática aprimorada
    appDir: true,
    // Desabilita a otimização de fontes para evitar problemas durante a exportação
    optimizeFonts: false,
  },
}

export default nextConfig;
