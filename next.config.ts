import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  output: 'export',
  basePath: '/seminar',
  assetPrefix: '/seminar',
};

export default nextConfig;
