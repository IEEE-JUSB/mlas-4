import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  serverExternalPackages: ['@napi-rs/canvas'],
};

export default nextConfig;
