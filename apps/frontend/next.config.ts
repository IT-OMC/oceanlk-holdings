import type { NextConfig } from 'next'

const backend = process.env.API_BASE_URL ?? 'http://localhost:8080'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Replaces vite.config.ts server.proxy — works in dev AND production,
  // which keeps the API same-origin and removes CORS entirely.
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${backend}/api/:path*` },
      { source: '/uploads/:path*', destination: `${backend}/uploads/:path*` },
    ]
  },

  // Replaces terserOptions.compress.drop_console.
  // Unlike the Vite config, this keeps error/warn — dropping those
  // in production makes support tickets unanswerable.
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  // Was build.sourcemap: false. This is already the default; stated
  // explicitly because the Vite config stated it, and it's a security decision.
  productionBrowserSourceMaps: false,
}

export default nextConfig
