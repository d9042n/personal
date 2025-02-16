import type { WebpackConfigContext } from 'next/dist/server/config-shared';
import type { Configuration as WebpackConfig } from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    esmExternals: true,
  },
  webpack: (
    config: WebpackConfig,
    { isServer }: WebpackConfigContext
  ): WebpackConfig => {
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
};

export default nextConfig;
