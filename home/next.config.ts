import type { NextConfig } from "next";
import path from "path";

const projectRoot = process.env.NEXT_PRIVATE_OUTPUT_TRACE_ROOT || path.resolve(__dirname);

const nextConfig: NextConfig = {
  // output: 'export', // Commented out to allow API rewrites (CORS bypass) for Outage API
  // basePath: '/Evaluate_Satisfaction', // Removed to support Vercel root deployment and fix 404 issues
  outputFileTracingRoot: projectRoot,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: projectRoot,
  },
  async rewrites() {
    return [
      {
        source: '/API/:path*',
        destination: 'https://smartplus3-api-dev.pea.co.th/API/:path*',
      },
    ]
  },
  allowedDevOrigins: ['172.29.138.86', '172.29.138.86:3443'],
};

export default nextConfig;
