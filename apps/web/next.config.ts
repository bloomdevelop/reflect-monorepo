import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://cdn.revoltusercontent.com/**")]
  },
  experimental: {
    reactCompiler: true
  }
};

export default nextConfig;
