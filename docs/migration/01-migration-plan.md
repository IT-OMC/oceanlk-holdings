# 01 — Migration Plan

Vite 5 → Next.js 16 App Router for `apps/frontend`.

---

## 1. Phase roadmap

Six phases. Each ends at a **deployable checkpoint** — the app builds, type-checks, and can ship. Estimates assume two engineers familiar with the codebase; halve the parallelism, double the calendar time.

| Phase | Goal | Checkpoint | Est. |
|---|---|---|---|
| **0** | Prep & de-risk under Vite | Vite app still runs on React 19 with all libs upgraded | 3–5 days |
| **1** | Next.js scaffold, SPA mode | `next dev` serves the app, React Router still driving | 2–3 days |
| **2** | React Router → App Router | All 42 routes are files under `app/`, all client-rendered | 5–8 days |
| **3** | Server-render the public site | 17 public routes are RSC with server data fetching + metadata | 5–8 days |
| **4** | Optimize | `next/image`, `next/font`, i18n cookie strategy, asset offload | 3–5 days |
| **5** | Cutover | Vercel production, headers, redirects, rollback plan rehearsed | 2–3 days |

**Total: 4–6 calendar weeks.** Phases 0–2 are mechanical and predictable. Phase 3 carries the variance — it's where product decisions about caching and freshness surface.

---

### Phase 0 — Prep and de-risk (do this under Vite)

The single most valuable thing you can do is **decouple the dependency upgrade from the framework swap**. Next.js 16's App Router requires React 19. React 19 breaks `@react-three/fiber@8` and forces majors on several other libraries. If you do that upgrade at the same moment you replace the build tool, every failure has two possible causes.

**0.1 — Branch and baseline.** Cut `feat/nextjs-migration` from `main`. Record baseline numbers you will compare against at sign-off: Lighthouse scores for `/`, `/companies`, `/news/articles`; `dist/` bundle size from `npm run build`; TTFB and LCP from the current Vercel deployment.

**0.2 — Delete dead weight.** Removing unused code before migrating means not migrating it. Verified unused in this repo:

- `src/pages/admin/MyPendingChanges.tsx` and `src/pages/admin/SuperAdminApproval.tsx` — never imported by `App.tsx`. Confirm with the team that they aren't work-in-progress, then delete or move to a `wip/` branch.
- `lint_output.txt`, `lint_output_2.txt`, `lint_output_3.txt` — committed lint dumps. Delete.
- `public/vite.svg` — the Vite default logo.
- The dependencies listed in §2 as *Remove*.

**0.3 — Upgrade React and libraries, still on Vite.** See §2 for exact target versions. Do this as its own PR. Run the app, click through every page, fix what breaks. The 3D components (`src/components/ThreeGlobe.tsx`, `src/components/culture/InteractiveWaterCanvas.tsx`) are the highest-risk surface — R3F v8→v9 is a real API break, not a version bump.

**0.4 — Normalize asset paths.** Rename every `public/` folder that contains spaces (`company logos`, `company images for hero section`) to kebab-case, and update the references. Spaces in paths work in Vite's dev server and break in more places than you'd expect once `next/image` and the Vercel CDN are involved. Do it now, while the app still runs, so you can catch broken images visually.

**Exit criteria:** Vite app runs on React 19.2 with zero console errors, `npx tsc --noEmit` clean, all pages visually verified.

---

### Phase 1 — Next.js scaffold in SPA mode

This follows the official Vite migration path deliberately: get Next.js *booting* the existing app before changing anything about how the app works. React Router keeps driving routing. The app is one giant client component. Performance will be no better than today — that's fine, that's not the point of this phase.

1. Install `next`, create `next.config.ts`, update `tsconfig.json`, update `package.json` scripts.
2. Convert `index.html` → `app/layout.tsx` (root layout + Metadata API).
3. Create the optional catch-all `app/[[...slug]]/page.tsx` + `client.tsx` that dynamically imports `App.tsx` with `ssr: false`.
4. Rename `VITE_*` → `NEXT_PUBLIC_*`, replace both `import.meta.env` reads.
5. Delete `main.tsx`, `index.html`, `vite-env.d.ts`, `tsconfig.node.json`, `vite.config.ts`; uninstall Vite.

Full instructions in `02-implementation-guide.md` §1.

**Exit criteria:** `npm run dev` serves the app at `localhost:5173`, every route reachable, `npm run build` succeeds.

> **Note on `output: 'export'`:** the official guide sets `output: 'export'` at this step. **Skip it.** You're going to SSR in Phase 3, and `export` mode silently disables rewrites, headers, and server rendering — you'd only have to remove it later, and in the meantime it would mask configuration mistakes.

---

### Phase 2 — React Router → App Router

Move each of the 42 routes to a file under `app/`. Components move unchanged; only routing APIs change. Everything stays client-rendered — put `'use client'` at the top of each `page.tsx`. This is the "boring middle" of the migration and it is mostly find-and-replace.

Order of work:
1. Build the `app/` directory skeleton with route groups (`(site)` and `admin/(protected)`) and their layouts.
2. Move public pages first (17 routes) — they're simpler and give you early feedback.
3. Move admin pages (25 routes) behind the client auth gate.
4. Convert routing APIs across all 27 files that import `react-router-dom` (§3 of the implementation guide has the transform table).
5. Delete `App.tsx`, `src/components/ScrollToTop.tsx`, and the `[[...slug]]` catch-all. Uninstall `react-router-dom`.

**Exit criteria:** `react-router-dom` is gone from `package.json`. All 42 URLs resolve. Browser back/forward works. Deep links work on a fresh page load.

---

### Phase 3 — Server-render the public site

This is where the migration earns its keep. The 17 public routes currently render an empty shell and then fetch from the Spring backend in `useEffect` — which is why they have no meaningful SEO today. Convert them to Server Components that fetch on the server.

For each public page:
- Remove `'use client'` from `page.tsx`. Push it down to the smallest interactive leaf (usually a `framer-motion` wrapper or a form).
- Move `useEffect` + `fetch` into the async page body.
- Choose a caching strategy per route (§4 below).
- Add `generateMetadata` for dynamic routes so shared links have real titles and descriptions.
- Add `generateStaticParams` where the ID set is known at build time.

Then add `app/sitemap.ts`, `app/robots.ts`, and Open Graph images.

`/admin/*` is explicitly **out of scope** for this phase. It stays client-rendered. It's behind auth, it has no SEO value, and its `sessionStorage` token model doesn't survive server rendering without an auth rework.

**Exit criteria:** `curl https://<preview>/companies` returns rendered company markup in the HTML source, not an empty `<div>`. Lighthouse SEO ≥ 95 on all public routes.

---

### Phase 4 — Optimize

- `<img>` → `next/image` on the heaviest pages first (Home, Companies, Leadership, Culture).
- Google Fonts `<link>` → `next/font/google` for Saira Semi Condensed. Self-hosts the font, removes two DNS preconnects, eliminates the font-swap flash, and lets you drop `fonts.googleapis.com` from the CSP.
- Move i18n language detection from `sessionStorage` to a cookie so the server and client agree on language (see Risk R-03).
- Lazy-load the 13 locale bundles instead of statically importing all of them.
- Offload `public/videos/` (56 MB) and `public/ecosystem-images/` (50 MB) to Vercel Blob or object storage.

Phase 4 items are individually shippable. Cut scope here first if the schedule slips.

---

### Phase 5 — Cutover

1. Change the Vercel project framework preset from Vite to Next.js; update `vercel.json` and the root `vercel.json`.
2. Port the security headers from `apps/frontend/nginx.conf` into `next.config.ts` `headers()` — **including the CSP, which needs changes to work with Next.js** (see Risk R-05).
3. Delete `apps/frontend/Dockerfile`, `apps/frontend/nginx.conf`, and the `frontend` service block in `docker-compose.yml` (lines 82–111). Update `docs/DEPLOYMENT.md` and `docs/oracle-cloud-deployment.md`.
4. Verify no URL changed. If any did, add `redirects()` entries with `permanent: true`.
5. Deploy to a preview URL, run the checklist in `04-pitfalls-and-checklist.md`, then promote.
6. Keep the last Vite production deployment pinned in Vercel for 72 hours as an instant rollback target.

---

## 2. Dependency analysis

Versions verified on npm, 24 August 2026. Next.js 16.3.2 is the current stable release (Active LTS through October 2027).

### Stays as-is

`react-hot-toast` (2.6.0), `i18next-browser-languagedetector`, `remark-gfm`, `three-stdlib`, `moment`, `autoprefixer`, `postcss`, `eslint-plugin-react-hooks`, `@typescript-eslint/*`.

### Changes

| Package | Current | Target | Why |
|---|---|---|---|
| `react` / `react-dom` | 18.2 | **19.2.x** | Required by the Next.js 16 App Router |
| `@types/react` / `@types/react-dom` | 18.x | **19.x** | Must match React |
| `next` | — | **16.3.2** | New |
| `typescript` | 5.2.2 | **5.9.3** | Next 16 needs ≥5.1. **Do not take TypeScript 7** — it's the native rewrite and a separate migration |
| `@react-three/fiber` | 8.18 | **9.7.x** | v8 does not support React 19. Peer range is `>=19 <19.3` — pin React accordingly |
| `@react-three/drei` | 9.122 | **10.7.x** | Requires fiber ^9 and React ^19 |
| `three` | 0.165 | **0.185.x** | drei 10 needs ≥0.159. Also fixes an existing skew: `@types/three@^0.182` is already ahead of `three@^0.165` |
| `framer-motion` | 10.18 | **13.1.x** | React 19 support. Same package as `motion` now; the `framer-motion` import path still works, so no code change is required |
| `lucide-react` | 0.303 | **1.33.x** | Major version. Used in **74 files** — check for renamed icon exports |
| `react-markdown` | 9.0 | **10.1.x** | React 19 compat |
| `react-syntax-highlighter` | 15.5 | **16.1.x** | Keeps pace with react-markdown 10 |
| `i18next` / `react-i18next` | 25 / 16 | **26.x / 17.x** | React 19 compat |
| `react-big-calendar` | 1.19 | **1.20.x** | Already declares React 19 support |
| `eslint` | 8.55 | **9.39.x** | Next 16 ships flat config by default; ESLint 8 is EOL |
| `tailwindcss` | 3.4.0 | **3.4.19** | Patch only. **Stay on 3.x** — Tailwind 4 is a CSS-first rewrite and a separate project |

### Removes

| Package | Why |
|---|---|
| `vite` | Replaced |
| `@vitejs/plugin-react` | Replaced |
| `terser` | Turbopack handles minification; `drop_console` moves to `compiler.removeConsole` |
| `eslint-plugin-react-refresh` | Vite HMR–specific; Next has its own Fast Refresh rules |
| `react-router-dom` | Replaced by the App Router (Phase 2) |
| `@react-google-maps/api` | **Zero importers in `src/`** |
| `@vis.gl/react-google-maps` | **Zero importers in `src/`** |
| `@types/google.maps` | **Zero importers in `src/`** |
| `date-fns` | **Zero importers in `src/`** |
| `clsx` | **Zero importers in `src/`** |
| `tailwind-merge` | **Zero importers in `src/`** |

That's six dependencies carrying no code. Removing them and the two Google Maps packages also lets you drop `maps.googleapis.com` and `www.googleapis.com` from `connect-src` in the CSP, and delete `VITE_GOOGLE_MAPS_API_KEY` from `.env.example` and `src/vite-env.d.ts`.

### Adds

| Package | Why |
|---|---|
| `next` | The framework |
| `eslint-config-next` (dev) | Next's flat ESLint config |
| `@eslint/eslintrc` (dev) | Only if you keep any legacy `.eslintrc` shareable configs during the flat-config move |

---

## 3. Project structure reorganization

### Route groups

Two groups keep the concerns apart cleanly:

- `app/(site)/` — the public marketing site. Its layout supplies `Navbar`, `MainLayout`, `Footer`. Server-rendered.
- `app/admin/` — the admin console. `/admin` (login) sits directly in it; everything else lives in `app/admin/(protected)/`, whose layout supplies the auth gate and `AdminLayout`.

The `(protected)` sub-group is what lets `/admin` (unauthenticated login) and `/admin/dashboard` (authenticated) coexist without the login page inheriting the auth gate. Route groups don't contribute URL segments, so `app/admin/(protected)/dashboard/page.tsx` still resolves to `/admin/dashboard`.

```
apps/frontend/
├── app/
│   ├── layout.tsx                    ← from index.html: <html>/<body>, next/font, globals.css, <Toaster>
│   ├── globals.css                   ← moved from src/index.css
│   ├── error.tsx                     ← from src/components/ErrorBoundary.tsx
│   ├── not-found.tsx                 ← new: the 404 the SPA never had
│   ├── sitemap.ts                    ← new (Phase 3)
│   ├── robots.ts                     ← new (Phase 3)
│   ├── icon.png                      ← from public/och-logo.png (file-based metadata)
│   │
│   ├── (site)/
│   │   ├── layout.tsx                ← Navbar + MainLayout + Footer
│   │   ├── page.tsx                  ← /
│   │   ├── contact/page.tsx
│   │   ├── corporate/{profile,leadership}/page.tsx
│   │   ├── companies/page.tsx  +  companies/[id]/page.tsx
│   │   ├── careers/{culture,talent-pool}/page.tsx
│   │   ├── careers/events/[id]/page.tsx
│   │   ├── careers/opportunities/page.tsx  +  opportunities/[id]/page.tsx
│   │   └── news/{blogs,articles,media}/page.tsx  +  each [id]/page.tsx
│   │
│   └── admin/
│       ├── page.tsx                  ← /admin — login, no auth gate
│       └── (protected)/
│           ├── layout.tsx            ← AuthGate + AdminLayout
│           └── …25 admin routes
│
├── src/                              ← KEEP. Non-route code stays put.
│   ├── components/  hooks/  services/  utils/  types/  data/  i18n/
│   └── layouts/                      ← MainLayout/AdminLayout become layout internals
│
├── public/                           ← unchanged paths (after the Phase 0 rename)
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── tailwind.config.js
└── postcss.config.js
```

**Keep `src/` for everything that isn't a route.** Next.js supports `app/` at the project root alongside a `src/` directory, and this split — `app/` is routing, `src/` is code — keeps the 57 components and all the shared modules exactly where the team already expects them. The `@/*` path alias continues to resolve to `./src/*` with no change.

### What each existing file becomes

| Vite artifact | Becomes | Notes |
|---|---|---|
| `index.html` | `app/layout.tsx` | `<title>`/`<meta description>` become the exported `metadata` object |
| `src/main.tsx` | (deleted) | `createRoot` is the framework's job now |
| `src/App.tsx` | (deleted) | Its route table becomes the `app/` directory tree |
| `src/index.css` | `app/globals.css` | Imported once in the root layout |
| `src/layouts/MainLayout.tsx` | body of `app/(site)/layout.tsx` | Or keep the component and render it from the layout |
| `src/layouts/AdminLayout.tsx` | body of `app/admin/(protected)/layout.tsx` | Its `<Outlet />` becomes `{children}` |
| `src/components/ProtectedRoute.tsx` | `src/components/AuthGate.tsx` | Same logic, `useRouter().replace()` instead of `useNavigate()` |
| `src/components/ScrollToTop.tsx` | (deleted) | App Router scrolls to top by default — but see Risk R-06 |
| `src/components/ErrorBoundary.tsx` | `app/error.tsx` + `app/global-error.tsx` | Convention-based error boundaries |
| `src/vite-env.d.ts` | (deleted) | `next-env.d.ts` is generated |
| `vite.config.ts` | `next.config.ts` | Mapping in §4 |
| `tsconfig.node.json` | (deleted) | No Node-side config file to type |
| `apps/frontend/Dockerfile` | (deleted) | Vercel-only hosting |
| `apps/frontend/nginx.conf` | `headers()` in `next.config.ts` | The CSP needs edits — Risk R-05 |

---

## 4. Build configuration mapping

`vite.config.ts` → `next.config.ts`, setting by setting.

| Vite setting | Next.js equivalent | Notes |
|---|---|---|
| `plugins: [react()]` | *(built in)* | Delete |
| `resolve.alias['@']` | `tsconfig.json` `compilerOptions.paths` | Next reads `paths` natively — no config duplication needed |
| `build.rollupOptions.output.manualChunks` | *(no equivalent — delete)* | Next's router splits per route automatically. Hand-written chunk groups (`react-vendor`, `router`, `ui`, `3d`, `maps`) would fight the router and make things worse. The `maps` group is already dead code |
| `build.chunkSizeWarningLimit` | *(no equivalent — delete)* | Next 16 removed the `size`/`First Load JS` build metrics entirely; measure with Lighthouse instead |
| `build.minify: 'terser'` | *(default)* | Turbopack minifies. Drop `terser` from devDependencies |
| `terserOptions.compress.drop_console` | `compiler.removeConsole` | Configure to keep `error`/`warn` |
| `terserOptions.compress.drop_debugger` | *(default in production)* | Delete |
| `build.sourcemap: false` | `productionBrowserSourceMaps: false` | This is already the default; keeping it explicit documents the intent |
| `server.proxy['/api']` | `rewrites()` → `/api/:path*` | Also serves production if you want to keep the API same-origin |
| `server.proxy['/uploads']` | `rewrites()` → `/uploads/:path*` | Or switch to absolute backend URLs and add the host to `images.remotePatterns` |

Two Next-specific additions with no Vite counterpart: `images` (for `next/image`) and `headers()` (replacing nginx). Templates in `03-config-templates.md`.

**Turbopack is the default bundler in Next.js 16** for both `next dev` and `next build`. You have no custom webpack config, so nothing to port — but be aware: if any dependency injects a `webpack` option, `next build` fails outright rather than silently ignoring it. The escape hatch is `next build --webpack`.

---

## 5. Environment variables and configuration strategy

### The rename

Vite exposes `VITE_*` via `import.meta.env`. Next exposes `NEXT_PUBLIC_*` via `process.env`. Only two files read env vars, so this is a five-minute change — but the *strategy* around it deserves thought.

| Today | Becomes | Scope | Used by |
|---|---|---|---|
| `VITE_API_BASE_URL` | `NEXT_PUBLIC_API_BASE_URL` | Client bundle | `src/utils/api.ts`, `src/services/searchService.ts` |
| — | `API_BASE_URL` | **Server only** | New: Server Component `fetch` calls (Phase 3) |
| `VITE_ENV` | `NODE_ENV` | Built in | Delete the custom var |
| `VITE_GOOGLE_MAPS_API_KEY` | *(delete)* | — | No importers; both Maps packages are being removed |

### Why two API base URLs

Once public pages fetch on the server, requests originate from Vercel's infrastructure, not the visitor's browser. That's a different network path with different constraints, and conflating them is a classic migration bug:

- `NEXT_PUBLIC_API_BASE_URL` — **inlined into the JavaScript bundle at build time.** Must be the publicly reachable backend URL. Never put a secret here; anything with this prefix is visible to anyone who views source.
- `API_BASE_URL` — read at request time on the server. Can point at an internal hostname, a private network address, or a different port. Falls back to the public URL when unset.

`src/utils/api.ts` should resolve `process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL`. Because `NEXT_PUBLIC_*` values are statically replaced at build time, that expression works correctly in both environments: on the server both are defined; in the browser bundle the first term compiles to `undefined` and the fallback wins.

### File layout

| File | Committed? | Contents |
|---|---|---|
| `.env.example` | Yes | Documented placeholders for every var, no real values |
| `.env.local` | **No** — gitignored | Local development overrides |
| `.env.development` | Optional | Shared non-secret dev defaults |
| `.env.production` | **No** | Real values live in Vercel project settings |

Note that `apps/frontend/.env.local` currently exists and holds a `VERCEL_OIDC_TOKEN` written by the Vercel CLI. Confirm it's gitignored (it is, via `apps/frontend/.gitignore`) and leave it alone.

### Runtime vs. build time

`serverRuntimeConfig` and `publicRuntimeConfig` were **removed in Next.js 16** — don't reach for them. If you need a server value read at request time rather than baked in at build time, call `await connection()` from `next/server` before reading `process.env`.

---

## 6. Risk register

Ordered by expected pain. Each risk names the specific files in this repo that carry it.

### R-01 — React 19 breaks the 3D components · *High impact, high likelihood*

`@react-three/fiber@8` does not support React 19. Moving to v9 (and drei v10) is an API-breaking upgrade, and the two affected files — `src/components/ThreeGlobe.tsx` and `src/components/culture/InteractiveWaterCanvas.tsx` — are visually prominent on the Home and Culture pages.

**Mitigation:** Do this upgrade in Phase 0, under Vite, as an isolated PR. Read the R3F v9 migration notes before starting. Note that fiber v9's React peer range is `>=19 <19.3` — pin React to 19.2.x rather than floating on `^19`. If the upgrade stalls, the fallback is to lazy-load both components with `next/dynamic({ ssr: false })` and accept them rendering slightly later; they're decorative, not functional.

### R-02 — `'use client'` sprawl across 85 files · *Medium impact, certain*

`framer-motion` appears in 85 of ~100 component and page files. Every one of them must be a Client Component. Done carelessly, this means marking every route `'use client'` and getting zero benefit from Phase 3.

**Mitigation:** In Phase 2, accept the sprawl — mark route roots `'use client'` and move on. In Phase 3, push the boundary *down*: keep `page.tsx` as a Server Component that fetches data, and extract the animated presentation into a sibling client component that receives data as props. The pattern is in `02-implementation-guide.md` §5. Budget one page at a time; don't try to do all 17 in one PR.

### R-03 — i18n hydration mismatch · *High impact, high likelihood*

`src/i18n/config.ts` detects language from `sessionStorage` and `navigator`. Neither exists on the server. Under SSR the server will render English, the client will re-render in the detected language, and React will report a hydration mismatch — visible as a flash of English and, in the worst case, a client-side re-render of the whole tree.

**Mitigation:** Change the detection order to `['cookie', 'navigator']` with `caches: ['cookie']`. A cookie is sent with the request, so the server can read it via `cookies()` and initialize i18next with the same language the client will pick. Do this in Phase 4, *before* it becomes load-bearing. Interim workaround for Phase 3: keep translated subtrees inside client components.

Secondary issue: all 13 locale files are statically imported in `config.ts`, so every visitor downloads all 13. Fix with `i18next-resources-to-backend` and dynamic imports in the same pass.

### R-04 — 160 MB of static assets · *Medium impact, medium likelihood*

`public/` holds 160 MB — 56 MB of video, 50 MB in `ecosystem-images`, 18 MB in `images`. Large `public/` directories slow every deployment, count toward Vercel deployment limits, and are never optimized by `next/image` (files in `public/` are served as-is).

**Mitigation:** Phase 0, rename the space-containing folders. Phase 4, move `public/videos/` and `public/ecosystem-images/` to Vercel Blob or object storage and reference them by URL, adding the host to `images.remotePatterns`. Compress what remains — the leadership headshots alone are 6.7 MB for eleven PNGs and should be WebP.

### R-05 — The nginx CSP will break Next.js · *High impact, certain if ported verbatim*

`nginx.conf` sets `script-src 'self'`. Next.js injects inline bootstrap scripts and inline JSON payloads for RSC. A verbatim port produces a blank page with console CSP violations.

**Mitigation:** Port the header set to `next.config.ts` `headers()`, but rework `script-src` — either use a nonce generated in `proxy.ts`, or (simpler, and adequate here) allow `'unsafe-inline'` for `script-src` initially and tighten later with a nonce. Keep it as `Content-Security-Policy-Report-Only` through the whole migration exactly as it is today, and only flip to enforcing after a soak period on the preview deployment. Also: with `next/font` self-hosting Saira, you can drop `fonts.googleapis.com`/`fonts.gstatic.com`; with the Maps packages removed, drop `maps.googleapis.com`/`www.googleapis.com`.

### R-06 — Smooth-scroll behavior changed in Next 16 · *Low impact, certain*

`src/index.css` sets `html { scroll-behavior: smooth; }`, and `src/components/ScrollToTop.tsx` works around it with `behavior: 'instant'`. Next.js used to override `scroll-behavior` during navigation; **as of Next.js 16 it no longer does.** Delete `ScrollToTop.tsx` and every route change will animate a smooth scroll — slow and disorienting.

**Mitigation:** Add `data-scroll-behavior="smooth"` to the `<html>` element in `app/layout.tsx`. That restores the old override: instant on navigation, smooth for in-page anchors. Then delete `ScrollToTop.tsx`.

### R-07 — Admin auth doesn't survive server rendering · *Medium impact, contained*

The JWT lives in `sessionStorage` (30 files touch it) and `ProtectedRoute` validates it against `/api/admin/validate` in a `useEffect`. None of that works on the server, and a token in `sessionStorage` is readable by any XSS.

**Mitigation:** Accept it for this migration — `/admin/*` stays client-rendered, and `AuthGate` is a straight port of `ProtectedRoute`. Log the follow-up: move the token to an httpOnly cookie and enforce in `proxy.ts` (Next 16's rename of `middleware.ts`), which eliminates both the flash of unauthenticated content and the XSS exposure. That's a backend-coordinated change and doesn't belong in the critical path.

### R-08 — Backend must accept server-to-server traffic · *Medium impact, medium likelihood*

Today every request to Spring comes from a browser. After Phase 3, public page requests come from Vercel's servers. CORS stops applying (server-to-server), but the backend must be publicly reachable from Vercel, and any IP allowlisting, rate limiting, or WAF rule tuned for browser traffic may reject it.

**Mitigation:** Test against the real backend from a Vercel preview deployment early in Phase 3 — not from `localhost`. Check `apps/backend/SECURITY_SETUP.md` and the Spring `SecurityConfig` for allowlists. Confirm rate limits tolerate burst traffic from a small number of Vercel egress IPs.

### R-09 — `useSearchParams` build failures · *Low impact, high likelihood*

Any Client Component calling `useSearchParams()` must sit inside a `<Suspense>` boundary or `next build` fails with a hard error. `useLocation` appears in 8 files today; some of those reads are query-string reads.

**Mitigation:** Wrap the consuming component in `<Suspense fallback={…}>` in its `page.tsx`. Cheap once you know; a confusing 20-minute detour if you don't.

### R-10 — Silent URL changes · *High impact, low likelihood*

Any changed URL costs accumulated SEO. The route mapping in `02-implementation-guide.md` §2 is designed to be 1:1, but trailing slashes and case sensitivity behave differently than in a `try_files`-based SPA fallback.

**Mitigation:** Before cutover, crawl the production site, extract every URL, and assert each returns 200 on the preview deployment. Add `redirects()` for anything that moved. Keep `trailingSlash` at its default (`false`) to match current behavior.

---

## 7. What this migration does *not* fix

Worth saying out loud so nobody expects it:

- **The admin console won't get faster.** It stays a client-rendered SPA by design.
- **The backend is untouched.** Every API contract in `src/utils/api.ts` stays exactly as it is.
- **Tailwind 4 and TypeScript 7** are deliberately deferred. Both are available; neither belongs in this project.
- **Test coverage.** There is no test framework in the repo today, and this migration doesn't add one. Validation is manual, per the checklist in `04-pitfalls-and-checklist.md`. Adding Playwright before Phase 2 would materially de-risk the route migration — consider it if the schedule allows.
