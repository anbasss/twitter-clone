import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Basic configuration for deployment compatibility
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
  
  // Experimental features for better performance
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt']
  },

  // Webpack configuration to handle file system issues
  webpack: (config, { isServer, dev }) => {
    // Handle Prisma client properly
    if (isServer) {
      config.externals.push('@prisma/client');
    }

    // Only apply these fixes in production builds
    if (!dev && isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
        ]
      };
    }

    return config;
  },

  // Output configuration for better Vercel deployment
  output: 'standalone',
};

export default nextConfig;
