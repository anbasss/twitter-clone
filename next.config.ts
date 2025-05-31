import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Basic configuration without problematic options
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
};

export default nextConfig;
