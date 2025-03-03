import type { WebpackConfigContext } from 'next/dist/server/config-shared';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    esmExternals: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (
    config: any,
    { isServer }: WebpackConfigContext
  ): any => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...(config.resolve?.fallback || {}),
          fs: false,
        },
      };
    }
    return config;
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME: process.env.NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME,
  },
};

export default nextConfig;
