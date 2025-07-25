import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Permite que el build continue aunque haya warnings de ESLint
    ignoreDuringBuilds: false, // Mantén esto en false para que siga revisando
  },
  typescript: {
    // Solo para TypeScript errors, no ESLint
    ignoreBuildErrors: false,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'instagram.fscl26-1.fna.fbcdn.net',
      },
    ],
  },
};

export default nextConfig;
