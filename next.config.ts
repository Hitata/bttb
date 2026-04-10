import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: ["darsana.trungth.com"],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
