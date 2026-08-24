import type { NextConfig } from 'next'

const backend = process.env.API_BASE_URL ?? 'http://localhost:8080'
const backendUrl = new URL(backend)

/**
 * Security headers ported from apps/frontend/nginx.conf (now deleted --
 * Vercel is the only host as of Phase 5).
 *
 * CSP changes from the nginx version:
 * - script-src needs 'unsafe-inline': Next injects inline bootstrap scripts
 *   and inline RSC payloads that a bare 'self' blocks outright (R-05). A
 *   per-request nonce via proxy.ts is the correct long-term answer; deferred
 *   (see 04-pitfalls-and-checklist.md Part C).
 * - fonts.googleapis.com / fonts.gstatic.com dropped from style-src/font-src:
 *   Saira is self-hosted via next/font/google as of Phase 4.
 * - maps.googleapis.com / www.googleapis.com dropped from connect-src: the
 *   Google Maps packages were removed as dead code in Phase 0.
 * - X-XSS-Protection dropped: deprecated, removed from modern browsers, and
 *   superseded by the CSP.
 *
 * Kept as Report-Only, matching the pre-migration nginx/SecurityConfig.java
 * soak period -- flip the header name to Content-Security-Policy only after
 * a clean soak on the production domain.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://ocean.lk https://www.ocean.lk https://generativelanguage.googleapis.com",
  "media-src 'self' blob: https://www.youtube.com https://www.youtube-nocookie.com",
  "frame-src https://www.youtube-nocookie.com https://www.google.com",
  "worker-src 'self' blob:",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ')

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Media (getMediaUrl() in src/utils/api.ts) resolves to an absolute
  // backend URL rather than the same-origin /api rewrite, so next/image
  // needs the backend host allowlisted. The backend serves files under
  // /api/files/** -- there's no /uploads prefix in this API.
  images: {
    // Only needed to optimize images from a loopback backend during local
    // development -- a real (non-loopback) API_BASE_URL in production
    // doesn't trip this check, so it must not be unconditional here.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
    remotePatterns: [
      {
        protocol: backendUrl.protocol.replace(':', '') as 'http' | 'https',
        hostname: backendUrl.hostname,
        port: backendUrl.port,
        pathname: '/api/files/**',
      },
      // Hardcoded decorative stock photo in UpcomingEvents.tsx.
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  // Replaces vite.config.ts server.proxy — works in dev AND production,
  // which keeps the API same-origin and removes CORS entirely.
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${backend}/api/:path*` },
      { source: '/uploads/:path*', destination: `${backend}/uploads/:path*` },
    ]
  },

  // Replaces nginx.conf's add_header directives (nginx itself is retired --
  // Vercel is the only host as of Phase 5).
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy-Report-Only', value: csp },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), camera=(), microphone=(), payment=(), usb=(), interest-cohort=()',
          },
        ],
      },
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
