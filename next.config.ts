import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Note: CORS is now handled in middleware.ts
};

export default nextConfig;
