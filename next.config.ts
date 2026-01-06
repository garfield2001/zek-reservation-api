import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Note: CORS for API routes is handled in src/proxy.ts
};

export default nextConfig;
