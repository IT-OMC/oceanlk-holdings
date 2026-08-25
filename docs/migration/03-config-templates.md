# 03 — Configuration Templates

Drop-in files for `apps/frontend/`. Every value is derived from the current repo — check the annotations before changing anything.

---

## 1. `next.config.ts`

Two versions. Use the first through Phases 1–2, swap to the second at Phase 3.

### Phase 1–2 — minimal

```ts
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
```

Deliberately **absent**, and why:

- `output: 'export'` — would disable rewrites, headers, and SSR. You need all three.
- `manualChunks` — no equivalent, and none wanted. Next's router splits per route; the hand-tuned `react-vendor`/`router`/`ui`/`3d`/`maps` groups would work against it.
- `webpack` — Turbopack is the default in Next 16, and a `webpack` key makes `next build` **fail** rather than be ignored.
- `experimental.turbopack` — promoted to the top-level `turbopack` key in Next 16. You have nothing to put in it.

### Phase 3–5 — full

```ts
import type { NextConfig } from 'next'

const backend = process.env.API_BASE_URL ?? 'http://localhost:8080'
const backendHost = new URL(backend).hostname

/**
 * Security headers ported from apps/frontend/nginx.conf.
 *
 * ⚠️ CSP CHANGE: nginx used `script-src 'self'`. Next.js injects inline
 * bootstrap scripts and inline RSC payloads, so `'self'` alone renders a
 * blank page. `'unsafe-inline'` is the pragmatic starting point; tighten
 * to a per-request nonce generated in proxy.ts once the site is stable.
 *
 * Kept as Report-Only, matching the current nginx soak. Flip the header
 * name to `Content-Security-Policy` only after a clean soak period.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",  // 'unsafe-eval' only if a dep needs it — try removing it
  "style-src 'self' 'unsafe-inline'",                  // fonts.googleapis.com no longer needed with next/font
  "font-src 'self' data:",                             // fonts.gstatic.com no longer needed with next/font
  "img-src 'self' data: blob: https:",
  `connect-src 'self' https://ocean.lk https://www.ocean.lk https://generativelanguage.googleapis.com`,
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

  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${backend}/api/:path*` },
      { source: '/uploads/:path*', destination: `${backend}/uploads/:path*` },
    ]
  },

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

  images: {
    // Media served by the Spring backend via getMediaUrl() in src/utils/api.ts
    remotePatterns: [
      { protocol: 'https', hostname: backendHost, pathname: '/uploads/**' },
      // Add the Blob/CDN host here once public/videos and
      // public/ecosystem-images are offloaded (Risk R-04).
    ],
    formats: ['image/avif', 'image/webp'],
    // Next 16 default is [75] only. Add values you actually pass as `quality`;
    // anything not listed is coerced to the nearest allowed value.
    qualities: [75, 90],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  productionBrowserSourceMaps: false,

  // Only if the /admin/pages/* ↔ /admin/content/* duplication is consolidated.
  // async redirects() {
  //   return [
  //     { source: '/admin/pages/leadership', destination: '/admin/content/leadership', permanent: true },
  //     { source: '/admin/pages/stats',      destination: '/admin/content/stats',      permanent: true },
  //     { source: '/admin/pages/partners',   destination: '/admin/content/partners',   permanent: true },
  //   ]
  // },
}

export default nextConfig
```

**Dropped from the nginx config on purpose:**

| nginx directive | Why it's gone |
|---|---|
| `X-XSS-Protection` | Deprecated and removed from modern browsers; the CSP supersedes it |
| `gzip on` + `gzip_types` | Vercel compresses (brotli/gzip) at the edge automatically |
| `location ~* \.(jpg\|css\|js…)` cache headers | Next fingerprints its assets and sets immutable caching itself |
| `location / { try_files … /index.html }` | SPA fallback — the App Router replaces it |
| `location /actuator { deny all }` | Frontend and backend are separate origins on Vercel; enforce this in Spring |
| `location /api/ { proxy_pass … }` | Now `rewrites()` |
| `location /health` | Optional Route Handler — see `02-implementation-guide.md` §8 |

---

## 2. `tsconfig.json`

Diffed against the current file: `references` removed, six compiler options added, `include`/`exclude` reworked. Formatting matches the repo's 4-space style.

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "useDefineForClassFields": true,
        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        "module": "ESNext",
        "moduleResolution": "bundler",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "preserve",

        "esModuleInterop": true,
        "allowJs": true,
        "skipLibCheck": true,
        "incremental": true,
        "forceConsistentCasingInFileNames": true,

        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true,

        "plugins": [{ "name": "next" }],

        "paths": {
            "@/*": ["./src/*"]
        }
    },
    "include": [
        "next-env.d.ts",
        "app/**/*.ts",
        "app/**/*.tsx",
        "src/**/*.ts",
        "src/**/*.tsx",
        ".next/types/**/*.ts"
    ],
    "exclude": ["node_modules"]
}
```

Notes on the non-obvious choices:

- **`"jsx": "preserve"`, not `"react-jsx"`.** Next handles the JSX transform itself. Next will rewrite this key on first run if you leave it as `react-jsx`; setting it directly avoids a confusing uncommitted diff.
- **`allowImportingTsExtensions` removed.** It only existed for `main.tsx`'s `import App from './App.tsx'`, and `main.tsx` is deleted.
- **`references` to `tsconfig.node.json` removed** along with the file itself.
- **`.next/types/**/*.ts` in `include`** is what makes the generated `PageProps` / `LayoutProps` helpers resolve. Run `npx next typegen` (or just `next dev` once) to populate it.
- **`noUnusedLocals` / `noUnusedParameters` kept.** They're strict, they're already passing, and they'll catch leftover React Router imports during Phase 2. Don't relax them to get through the migration.

---

## 3. `eslint.config.mjs`

`next lint` was **removed** in Next 16 and `next build` no longer lints. ESLint 9 uses flat config; the current `.eslintrc.cjs` won't be read.

```js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import next from '@next/eslint-plugin-next'

export default tseslint.config(
  { ignores: ['.next/**', 'dist/**', 'node_modules/**', 'next-env.d.ts'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      '@next/next': next,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,

      // Carried over from .eslintrc.cjs
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
)
```

Then:

```bash
rm .eslintrc.cjs
npm uninstall -D eslint-plugin-react-refresh   # Vite HMR-specific, meaningless in Next
```

There's a codemod if you'd rather not hand-write it:

```bash
npx @next/codemod@canary next-lint-to-eslint-cli .
```

The two rules worth knowing about from `core-web-vitals`: `@next/next/no-img-element` (nudges you toward `next/image` — expect noise until Phase 4) and `@next/next/no-html-link-for-pages` (catches `<a href="/x">` that should be `<Link>`).

---

## 4. Environment files

### `.env.example` — committed

```bash
# ─── Backend API ────────────────────────────────────────────────
# Public URL, inlined into the client bundle at build time.
# Visible in page source — never put a secret behind NEXT_PUBLIC_.
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# Server-only. Read at request time by Server Components and rewrites().
# May be an internal hostname unreachable from the public internet.
# Falls back to NEXT_PUBLIC_API_BASE_URL when unset.
API_BASE_URL=http://localhost:8080

# ─── Site ───────────────────────────────────────────────────────
# Absolute origin, used by sitemap.ts, robots.ts and Open Graph URLs.
NEXT_PUBLIC_SITE_URL=http://localhost:5173

# ─── Removed in the Next.js migration ───────────────────────────
# VITE_API_BASE_URL          → NEXT_PUBLIC_API_BASE_URL
# VITE_ENV                   → use NODE_ENV (set automatically)
# VITE_GOOGLE_MAPS_API_KEY   → deleted; both Maps packages were unused
```

### `.env.local` — gitignored, developer machine

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_SITE_URL=http://localhost:5173
```

> `apps/frontend/.env.local` already exists with a `VERCEL_OIDC_TOKEN` written by the Vercel CLI. Leave that line alone and append these below it.

### Vercel project settings — Production

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `https://<backend-host>` |
| `API_BASE_URL` | `https://<backend-host>` (or an internal address) |
| `NEXT_PUBLIC_SITE_URL` | `https://ocean.lk` |

Set the same three for the Preview environment, pointing at staging. **`NEXT_PUBLIC_*` values are baked in at build time** — changing one in the Vercel dashboard requires a redeploy, not just a restart.

### Precedence

`.env.local` beats `.env.development` / `.env.production`, which beat `.env`. `.env.local` is not loaded during `next build` in the `test` environment. Vercel-set variables override files.

---

## 5. `package.json`

```json
{
  "name": "oceanlk",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@react-three/drei": "^10.7.8",
    "@react-three/fiber": "^9.7.0",
    "framer-motion": "^13.1.1",
    "i18next": "^26.4.0",
    "i18next-browser-languagedetector": "^8.2.0",
    "lucide-react": "^1.33.0",
    "moment": "^2.30.1",
    "next": "^16.3.2",
    "react": "19.2.8",
    "react-big-calendar": "^1.20.0",
    "react-dom": "19.2.8",
    "react-hot-toast": "^2.6.0",
    "react-i18next": "^17.0.12",
    "react-markdown": "^10.1.0",
    "react-syntax-highlighter": "^16.1.1",
    "remark-gfm": "^4.0.0",
    "three": "^0.185.1",
    "three-stdlib": "^2.36.1"
  },
  "devDependencies": {
    "@next/eslint-plugin-next": "^16.3.2",
    "@types/node": "^25.0.10",
    "@types/react": "^19.2.0",
    "@types/react-big-calendar": "^1.16.3",
    "@types/react-dom": "^19.2.0",
    "@types/react-syntax-highlighter": "^15.5.11",
    "@types/three": "^0.185.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^9.39.5",
    "eslint-config-next": "^16.3.2",
    "eslint-plugin-react-hooks": "^7.0.0",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.19",
    "typescript": "^5.9.3",
    "typescript-eslint": "^8.0.0"
  }
}
```

Three deliberate pins:

- **`react` / `react-dom` are exact, not caret.** `@react-three/fiber@9`'s peer range is `>=19 <19.3`. A caret would let a patch install pull React 19.3 and silently break the peer contract.
- **`typescript` stays on 5.9.3.** TypeScript 7 is `latest` on npm — it's the native Go rewrite and a migration of its own. Next 16 needs only ≥5.1.
- **`tailwindcss` stays on 3.4.19.** Tailwind 4 is a CSS-first rewrite. Separate project.

`"type": "module"` is removed — Next resolves `next.config.ts` regardless, and the field creates avoidable friction with the CommonJS-flavored config files some tooling still emits.

`@types/three` moves to `^0.185` to match `three` — the current repo has `@types/three@^0.182` paired with `three@^0.165`, which is a pre-existing skew worth fixing while you're here.

---

## 6. `tailwind.config.js`

Only `content` changes. Everything else — the brand palette, Saira font stack, buoyancy animations, `backdropBlur.xs` — is untouched.

```js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    // …theme and plugins exactly as they are today…
}
```

`"./index.html"` is removed — the file no longer exists. `postcss.config.js` needs no change.

After Phase 4's `next/font` migration, update the font stack:

```js
fontFamily: {
    sans: ['var(--font-saira)', 'sans-serif'],
},
```

---

## 7. Vercel configuration

### `apps/frontend/vercel.json`

```json
{
  "installCommand": "npm install --include=dev",
  "buildCommand": "npm run build",
  "framework": "nextjs"
}
```

`outputDirectory` is **removed** — Next.js manages `.next` and specifying an output directory conflicts with the framework preset.

### Root `vercel.json`

```json
{
  "installCommand": "npm install --include=dev",
  "buildCommand": "npm run build",
  "framework": "nextjs"
}
```

Note that `rootDirectory` in the current root `vercel.json` is not a valid `vercel.json` key — it's a **Project Setting**. Set "Root Directory" to `apps/frontend` in the Vercel dashboard (it may already be set, given the deploys work today) and drop the key from the file.

Also change the project's **Framework Preset** from *Vite* to *Next.js* in the dashboard. This is a manual step no config file performs, and forgetting it produces a successful build that serves nothing.

### `.github/workflows/deploy-frontend.yml`

The existing workflow needs two edits — a lint step, because `next build` no longer lints, and a Node version bump to satisfy Next 16's `>=20.9`:

```yaml
    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.9'          # was '20' — Next 16 requires >= 20.9
        cache: 'npm'
        cache-dependency-path: apps/frontend/package-lock.json

    - name: Install dependencies
      run: cd apps/frontend && npm ci

    - name: Lint
      run: cd apps/frontend && npm run lint    # NEW — next build no longer lints

    - name: Run TypeScript Check
      run: cd apps/frontend && npx tsc --noEmit

    - name: Build Frontend
      run: cd apps/frontend && npm run build
```

The `vercel-action` deploy job needs no change.

---

## 8. Files to delete at cutover

```bash
# Vite (Phase 1)
apps/frontend/index.html
apps/frontend/vite.config.ts
apps/frontend/tsconfig.node.json
apps/frontend/src/main.tsx
apps/frontend/src/vite-env.d.ts
apps/frontend/.vite/
apps/frontend/dist/
apps/frontend/.eslintrc.cjs

# React Router (Phase 2)
apps/frontend/src/App.tsx
apps/frontend/src/components/ScrollToTop.tsx
apps/frontend/src/components/ProtectedRoute.tsx     # → src/components/AuthGate.tsx
apps/frontend/src/components/ErrorBoundary.tsx      # → app/error.tsx
apps/frontend/app/[[...slug]]/                      # the temporary SPA catch-all

# Docker/nginx — Vercel-only hosting (Phase 5)
apps/frontend/Dockerfile
apps/frontend/nginx.conf
# and the `frontend:` service block in docker-compose.yml (lines 82–111)

# Housekeeping (Phase 0)
apps/frontend/lint_output.txt
apps/frontend/lint_output_2.txt
apps/frontend/lint_output_3.txt
apps/frontend/public/vite.svg
apps/frontend/src/pages/admin/MyPendingChanges.tsx      # unrouted — confirm first
apps/frontend/src/pages/admin/SuperAdminApproval.tsx    # unrouted — confirm first
```

Update `docs/DEPLOYMENT.md` and `docs/oracle-cloud-deployment.md` — both describe the nginx-based frontend deployment that no longer exists.
