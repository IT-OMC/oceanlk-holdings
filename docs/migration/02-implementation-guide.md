# 02 — Implementation Guide

Hands-on instructions. Run everything from `apps/frontend/` unless stated otherwise.

---

## 1. Phase 1 — scaffold Next.js in SPA mode

### 1.1 Install

```bash
cd apps/frontend

# React 19 + Next 16 (Phase 0 should already have done the React bump under Vite)
npm install next@16.3.2 react@19.2.8 react-dom@19.2.8
npm install -D @types/react@^19 @types/react-dom@^19 typescript@5.9.3 eslint@9.39.5 eslint-config-next@16.3.2

# Remove what's provably unused
npm uninstall @react-google-maps/api @vis.gl/react-google-maps date-fns clsx tailwind-merge
npm uninstall -D @types/google.maps terser eslint-plugin-react-refresh
```

Node 20.9+ and TypeScript 5.1+ are hard requirements of Next 16. CI already pins Node 20 — verify it's ≥20.9.

### 1.2 Create `next.config.ts`

Use the Phase-1 template in `03-config-templates.md` §1. **Do not set `output: 'export'`** — see the note in `01-migration-plan.md` §Phase 1.

### 1.3 Convert `index.html` → `app/layout.tsx`

Current `index.html` carries a favicon link, two font preconnects, a Google Fonts stylesheet, a title, and a description. Each maps to a Next.js convention:

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'OCH - Ocean Ceylon Holdings',
    template: '%s | Ocean Ceylon Holdings',
  },
  description:
    'OceanLK Holdings - A premier corporate holding company with diverse portfolio across multiple sectors',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f1e3a',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
        {children}
      </body>
    </html>
  )
}
```

Four things to notice:

1. **`data-scroll-behavior="smooth"` is not optional.** `src/index.css` sets `html { scroll-behavior: smooth }`. Without this attribute, Next.js 16 won't override it during navigation and every route change becomes a slow animated scroll. This is the replacement for `ScrollToTop.tsx`.
2. **`charset` and `viewport` are gone.** Next emits both by default. Don't re-add them.
3. **The favicon link is gone.** Copy `public/och-logo.png` to `app/icon.png` and Next wires it up automatically. Keep the original in `public/` too — it's referenced elsewhere.
4. **The stylesheet import order is preserved.** `react-big-calendar`'s CSS must load *before* `globals.css`, because `globals.css` carries the dark-theme overrides for it (there's a comment about this in the current `main.tsx`). Keep that order or the admin events calendar loses its theming.

The Google Fonts `<link>` stays as a raw `<link>` in the `<head>` for now. Phase 4 replaces it with `next/font/google`.

```bash
git mv src/index.css app/globals.css
```

### 1.4 Create the catch-all entrypoint

```tsx
// app/[[...slug]]/page.tsx
import { ClientOnly } from './client'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return <ClientOnly />
}
```

```tsx
// app/[[...slug]]/client.tsx
'use client'

import dynamic from 'next/dynamic'

const App = dynamic(() => import('../../src/App'), { ssr: false })

export function ClientOnly() {
  return <App />
}
```

`[[...slug]]` is an *optional* catch-all — it matches `/` as well as `/anything/nested`. React Router inside `App.tsx` handles the actual routing, exactly as it does today. This whole directory is deleted at the end of Phase 2.

### 1.5 Migrate environment variables

```bash
# .env.local  and  .env.example
- VITE_API_BASE_URL=http://localhost:8080
+ NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
+ API_BASE_URL=http://localhost:8080

- VITE_ENV=development                      # delete — use NODE_ENV
- VITE_GOOGLE_MAPS_API_KEY=…                # delete — no importers
```

Then the two code sites:

```ts
// src/utils/api.ts:1
- const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
+ const BASE_URL =
+   process.env.API_BASE_URL ??
+   process.env.NEXT_PUBLIC_API_BASE_URL ??
+   'http://localhost:8080';

// src/services/searchService.ts:1
- const API_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
+ const API_URL =
+   process.env.API_BASE_URL ??
+   process.env.NEXT_PUBLIC_API_BASE_URL ??
+   'http://localhost:8080';
```

`NEXT_PUBLIC_*` is statically substituted at build time, so in the browser bundle the first term compiles to `undefined` and the fallback chain resolves correctly. On the server both are live reads.

### 1.6 Update `package.json` scripts and `.gitignore`

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit"
}
```

No `--turbopack` flag — Turbopack is the default in Next 16. `next lint` was **removed** in Next 16; call the ESLint CLI directly, and note that `next build` no longer runs linting, so CI must invoke `npm run lint` explicitly.

```gitignore
# apps/frontend/.gitignore
.next
next-env.d.ts
dist
```

### 1.7 Update `tsconfig.json`

Full file in `03-config-templates.md` §2. The changes from the current file: drop the `references` to `tsconfig.node.json`, add `esModuleInterop`, `allowJs`, `incremental`, `forceConsistentCasingInFileNames`, add the `{ "name": "next" }` plugin, and extend `include` with `.next/types/**/*.ts` and `next-env.d.ts`. Also remove `allowImportingTsExtensions` — nothing needs it once `main.tsx` (which imports `./App.tsx`) is gone.

### 1.8 Delete Vite

```bash
rm index.html src/main.tsx src/vite-env.d.ts vite.config.ts tsconfig.node.json
rm -rf .vite dist
rm lint_output*.txt public/vite.svg
npm uninstall vite @vitejs/plugin-react
```

**Checkpoint:** `npm run dev` → `localhost:3000` serves the app. Every route reachable. `npm run build` succeeds. Commit and open a PR.

---

## 2. Phase 2 — the complete route map

Every route in `src/App.tsx`, mapped to its App Router file. This is the authoritative list; `/admin/*` paths that appear twice in `App.tsx` are noted.

### Root and layouts

| Concern | File |
|---|---|
| `<html>`, `<body>`, globals, `<Toaster>` | `app/layout.tsx` |
| `<ErrorBoundary>` | `app/error.tsx` + `app/global-error.tsx` |
| Navbar (fixed) + `MainLayout` + Footer | `app/(site)/layout.tsx` |
| `ProtectedRoute` + `AdminLayout` | `app/admin/(protected)/layout.tsx` |
| 404 | `app/not-found.tsx` *(new — the SPA had none)* |

### Public routes — 17

| URL | React Router element | App Router file | Phase 3 strategy |
|---|---|---|---|
| `/` | `pages/Home` | `app/(site)/page.tsx` | ISR |
| `/corporate/profile` | `pages/corporate/Profile` | `app/(site)/corporate/profile/page.tsx` | ISR |
| `/corporate/leadership` | `pages/corporate/Leadership` | `app/(site)/corporate/leadership/page.tsx` | ISR |
| `/companies` | `pages/companies/Companies` | `app/(site)/companies/page.tsx` | ISR |
| `/companies/:id` | `pages/companies/CompanySingle` | `app/(site)/companies/[id]/page.tsx` | SSG + `generateStaticParams` |
| `/careers/culture` | `pages/careers/Culture` | `app/(site)/careers/culture/page.tsx` | ISR |
| `/careers/events/:id` | `pages/careers/EventSingle` | `app/(site)/careers/events/[id]/page.tsx` | ISR |
| `/careers/opportunities` | `pages/careers/Onboard` | `app/(site)/careers/opportunities/page.tsx` | ISR, short revalidate |
| `/careers/opportunities/:id` | `pages/careers/JobApplication` | `app/(site)/careers/opportunities/[id]/page.tsx` | SSR — has a form |
| `/careers/talent-pool` | `pages/careers/TalentPool` | `app/(site)/careers/talent-pool/page.tsx` | Static — form only |
| `/news/blogs` | `pages/news/Blogs` | `app/(site)/news/blogs/page.tsx` | ISR |
| `/news/blogs/:id` | `pages/news/BlogSingle` | `app/(site)/news/blogs/[id]/page.tsx` | SSG + `generateStaticParams` |
| `/news/articles` | `pages/news/News` | `app/(site)/news/articles/page.tsx` | ISR |
| `/news/articles/:id` | `pages/news/NewsSingle` | `app/(site)/news/articles/[id]/page.tsx` | SSG + `generateStaticParams` |
| `/news/media` | `pages/news/Media` | `app/(site)/news/media/page.tsx` | ISR |
| `/news/media/:id` | `pages/news/MediaSingle` | `app/(site)/news/media/[id]/page.tsx` | SSG + `generateStaticParams` |
| `/contact` | `pages/Contact` | `app/(site)/contact/page.tsx` | Static shell + client form |

### Admin routes — 25

| URL | React Router element | App Router file |
|---|---|---|
| `/admin` | `pages/admin/AdminLogin` | `app/admin/page.tsx` *(outside the auth gate)* |
| `/admin/dashboard` | `pages/admin/AdminDashboard` | `app/admin/(protected)/dashboard/page.tsx` |
| `/admin/profile` | `pages/admin/Profile` | `app/admin/(protected)/profile/page.tsx` |
| `/admin/management` | `pages/admin/AdminManagement` | `app/admin/(protected)/management/page.tsx` |
| `/admin/companies` | `pages/admin/CompanyManagement` | `app/admin/(protected)/companies/page.tsx` |
| `/admin/pages/leadership` | `pages/admin/LeadershipManagement` | `app/admin/(protected)/pages/leadership/page.tsx` |
| `/admin/pages/partners` | `pages/admin/PartnerManagement` | `app/admin/(protected)/pages/partners/page.tsx` |
| `/admin/pages/stats` | `pages/admin/StatsManagement` | `app/admin/(protected)/pages/stats/page.tsx` |
| `/admin/media` | `pages/admin/MediaManagement` | `app/admin/(protected)/media/page.tsx` |
| `/admin/news-media/news` | `pages/admin/NewsManagement` | `app/admin/(protected)/news-media/news/page.tsx` |
| `/admin/news-media/blog` | `pages/admin/BlogManagement` | `app/admin/(protected)/news-media/blog/page.tsx` |
| `/admin/news-media/gallery` | `pages/admin/GalleryManagement` | `app/admin/(protected)/news-media/gallery/page.tsx` |
| `/admin/news-media/documents` | `pages/admin/DocumentsManagement` | `app/admin/(protected)/news-media/documents/page.tsx` |
| `/admin/contact-messages` | `pages/admin/ManageContactMessages` | `app/admin/(protected)/contact-messages/page.tsx` |
| `/admin/content/pages` | `pages/admin/PageContentManager` | `app/admin/(protected)/content/pages/page.tsx` |
| `/admin/content/leadership` | `pages/admin/LeadershipManagement` ⚠️ | `app/admin/(protected)/content/leadership/page.tsx` |
| `/admin/content/stats` | `pages/admin/StatsManagement` ⚠️ | `app/admin/(protected)/content/stats/page.tsx` |
| `/admin/content/partners` | `pages/admin/PartnerManagement` ⚠️ | `app/admin/(protected)/content/partners/page.tsx` |
| `/admin/audit-logs` | `pages/admin/AuditLogViewer` | `app/admin/(protected)/audit-logs/page.tsx` |
| `/admin/pending-changes` | `pages/admin/PendingChanges` | `app/admin/(protected)/pending-changes/page.tsx` |
| `/admin/hr/media` | `pages/admin/HRMediaManagement` | `app/admin/(protected)/hr/media/page.tsx` |
| `/admin/hr/events` | `pages/admin/EventsManagement` | `app/admin/(protected)/hr/events/page.tsx` |
| `/admin/hr/testimonials` | `pages/admin/TestimonialsManagement` | `app/admin/(protected)/hr/testimonials/page.tsx` |
| `/admin/hr/applications` | `pages/admin/ApplicationViewer` | `app/admin/(protected)/hr/applications/page.tsx` |
| `/admin/hr/jobs` | `pages/admin/JobManagement` | `app/admin/(protected)/hr/jobs/page.tsx` |

⚠️ **Three components are routed twice** — `LeadershipManagement`, `StatsManagement` and `PartnerManagement` each serve both a `/admin/pages/*` and a `/admin/content/*` URL. Both sets are preserved above so no bookmark breaks. Raise with the team whether one set should redirect to the other; if so, use `redirects()` in `next.config.ts` rather than duplicating the page files.

### Not routed

`src/pages/admin/MyPendingChanges.tsx` and `src/pages/admin/SuperAdminApproval.tsx` have no route in `App.tsx`. Confirm they're dead, then delete them in Phase 0.

### Creating the tree

```bash
# public
mkdir -p app/\(site\)/{contact,companies/\[id\],corporate/{profile,leadership}}
mkdir -p app/\(site\)/careers/{culture,talent-pool,events/\[id\],opportunities/\[id\]}
mkdir -p app/\(site\)/news/{blogs/\[id\],articles/\[id\],media/\[id\]}

# admin
mkdir -p app/admin/\(protected\)/{dashboard,profile,management,companies,media,contact-messages,audit-logs,pending-changes}
mkdir -p app/admin/\(protected\)/pages/{leadership,partners,stats}
mkdir -p app/admin/\(protected\)/news-media/{news,blog,gallery,documents}
mkdir -p app/admin/\(protected\)/content/{pages,leadership,stats,partners}
mkdir -p app/admin/\(protected\)/hr/{media,events,testimonials,applications,jobs}
```

Each `page.tsx` in Phase 2 is a three-line re-export of the existing component:

```tsx
// app/(site)/companies/page.tsx
'use client'
export { default } from '@/pages/companies/Companies'
```

That keeps the diff tiny and the page components untouched. In Phase 3 you'll inline and un-client the public ones.

---

## 3. Converting React Router APIs

27 files import `react-router-dom`. Work through this table; it covers every symbol in use.

| React Router | Next.js App Router | Count | Notes |
|---|---|---|---|
| `<Link to="/x">` | `<Link href="/x">` from `next/link` | 40 | Attribute rename only |
| `useNavigate()` → `navigate('/x')` | `useRouter()` from **`next/navigation`** → `router.push('/x')` | 22 | ⚠️ `next/navigation`, **not** `next/router` |
| `navigate('/x', { replace: true })` | `router.replace('/x')` | — | |
| `navigate(-1)` | `router.back()` | — | |
| `useParams<{id:string}>()` | `useParams()` (client) or `await props.params` (server) | 12 | See below |
| `useLocation().pathname` | `usePathname()` | 8 | |
| `useLocation().search` | `useSearchParams()` | — | ⚠️ Requires a `<Suspense>` boundary |
| `<NavLink className={({isActive})=>…}>` | `<Link>` + `usePathname() === href` | 3 | No `isActive` render prop |
| `<Outlet />` | `{children}` in `layout.tsx` | 1 | `AdminLayout.tsx` |
| `<Navigate to="/x" replace />` | `redirect('/x')` from `next/navigation` | — | |
| `<BrowserRouter>` / `<Routes>` / `<Route>` | *(deleted — the filesystem is the router)* | — | |

Find them all:

```bash
grep -rn "react-router-dom" src/
```

### `useParams` — the one that bites

In **Client** Components, `useParams()` from `next/navigation` is synchronous and works like the React Router version:

```tsx
'use client'
import { useParams } from 'next/navigation'

const { id } = useParams<{ id: string }>()
```

In **Server** Components, `params` is a **Promise** — this is a hard breaking change in Next.js 16, not a deprecation:

```tsx
export default async function Page(props: PageProps<'/news/blogs/[id]'>) {
  const { id } = await props.params
  // …
}
```

`PageProps` / `LayoutProps` / `RouteContext` are globally available type helpers generated by `npx next typegen`. Use them instead of hand-writing prop types.

### `NavLink` replacement

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Link href={href} className={isActive ? 'text-secondary' : 'text-white'}>
      {children}
    </Link>
  )
}
```

### `useSearchParams` needs Suspense

```tsx
// page.tsx
import { Suspense } from 'react'
import Results from './results'

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <Results />   {/* the client component calling useSearchParams */}
    </Suspense>
  )
}
```

Without the boundary, `next build` fails with *"useSearchParams() should be wrapped in a suspense boundary"*. It's a build error, not a warning.

---

## 4. Layouts, auth, and error boundaries

### `app/(site)/layout.tsx`

```tsx
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MainLayout from '@/layouts/MainLayout'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <MainLayout>{children}</MainLayout>
      <Footer />
    </>
  )
}
```

Structurally identical to the `/*` branch in `App.tsx`. `Navbar` and `Footer` both use `framer-motion`, so both need `'use client'` at the top of their own files — the layout itself stays a Server Component.

### `src/components/AuthGate.tsx` — replacing `ProtectedRoute`

Same logic as `ProtectedRoute.tsx`, with the navigation call swapped:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_ENDPOINTS } from '@/utils/api'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [status, setStatus] = useState<'checking' | 'ok' | 'denied'>('checking')

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken')
    if (!token) {
      setStatus('denied')
      router.replace('/admin')
      return
    }
    fetch(API_ENDPOINTS.VALIDATE_TOKEN, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.ok) return setStatus('ok')
        sessionStorage.removeItem('adminToken')
        sessionStorage.removeItem('adminUser')
        setStatus('denied')
        router.replace('/admin')
      })
      .catch(() => {
        setStatus('denied')
        router.replace('/admin')
      })
  }, [router])

  if (status !== 'ok') {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    )
  }
  return <>{children}</>
}
```

Two differences worth noting from the original: `router.replace()` rather than `push()`, so the protected URL doesn't stay in history; and a single `status` state instead of two booleans, which removes the ambiguous `isLoading=false, isAuthenticated=false` window.

### `app/admin/(protected)/layout.tsx`

```tsx
import AuthGate from '@/components/AuthGate'
import AdminLayout from '@/layouts/AdminLayout'

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <AdminLayout>{children}</AdminLayout>
    </AuthGate>
  )
}
```

`AdminLayout.tsx` currently renders `<Outlet />`; change it to accept and render `children`.

### `app/error.tsx` — replacing `ErrorBoundary`

```tsx
'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-navy text-white">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <button onClick={reset} className="px-4 py-2 rounded bg-secondary text-navy">
        Try again
      </button>
    </div>
  )
}
```

Also add `app/global-error.tsx` with its own `<html>`/`<body>` — it catches failures in the root layout itself, which `error.tsx` cannot. Then delete `src/components/ErrorBoundary.tsx`.

---

## 5. Phase 3 — server-rendering a public page

The pattern, using `/companies` as the worked example. Today it's a client component that fetches in `useEffect`.

**Split the page into two files.** The Server Component fetches; the Client Component animates.

```tsx
// app/(site)/companies/page.tsx        — Server Component
import type { Metadata } from 'next'
import CompaniesView from './companies-view'
import { API_ENDPOINTS } from '@/utils/api'

export const revalidate = 3600  // ISR: regenerate at most once an hour

export const metadata: Metadata = {
  title: 'Our Companies',
  description: 'The Ocean Ceylon Holdings portfolio of companies.',
}

export default async function Page() {
  const res = await fetch(API_ENDPOINTS.COMPANIES, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`Companies fetch failed: ${res.status}`)
  const companies = await res.json()

  return <CompaniesView companies={companies} />
}
```

```tsx
// app/(site)/companies/companies-view.tsx   — Client Component
'use client'

import { motion } from 'framer-motion'
import type { Company } from '@/types'

export default function CompaniesView({ companies }: { companies: Company[] }) {
  return (
    <div>
      {companies.map((c) => (
        <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* …existing markup, unchanged… */}
        </motion.div>
      ))}
    </div>
  )
}
```

The data arrives in the HTML. The animation still runs on the client. This is the shape that resolves Risk R-02: `'use client'` moves *down* the tree, not away.

### Dynamic routes with `generateStaticParams`

```tsx
// app/(site)/news/blogs/[id]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { API_ENDPOINTS } from '@/utils/api'

export const revalidate = 3600

export async function generateStaticParams() {
  const res = await fetch(API_ENDPOINTS.MEDIA_BLOGS)
  const blogs = await res.json()
  return blogs.map((b: { id: string | number }) => ({ id: String(b.id) }))
}

export async function generateMetadata(props: PageProps<'/news/blogs/[id]'>): Promise<Metadata> {
  const { id } = await props.params
  const res = await fetch(API_ENDPOINTS.MEDIA_SINGLE(id), { next: { revalidate: 3600 } })
  if (!res.ok) return { title: 'Blog' }
  const blog = await res.json()
  return {
    title: blog.title,
    description: blog.excerpt ?? blog.summary,
    openGraph: { title: blog.title, images: blog.imageUrl ? [blog.imageUrl] : [] },
  }
}

export default async function Page(props: PageProps<'/news/blogs/[id]'>) {
  const { id } = await props.params
  const res = await fetch(API_ENDPOINTS.MEDIA_SINGLE(id), { next: { revalidate: 3600 } })
  if (res.status === 404) notFound()
  if (!res.ok) throw new Error(`Blog ${id} fetch failed: ${res.status}`)
  return <BlogView blog={await res.json()} />
}
```

**`params` is a Promise.** Forgetting the `await` is the most common Next 16 error and the type checker will catch it — run `npx next typegen` so `PageProps` exists.

`generateMetadata` is what makes shared links show real titles instead of "OCH - Ocean Ceylon Holdings" everywhere. It's the highest-leverage SEO change in the whole migration.

### Caching cheat sheet

| Need | Directive |
|---|---|
| Rebuild at most every N seconds | `export const revalidate = N` |
| Always fresh, every request | `export const dynamic = 'force-dynamic'` |
| Per-fetch control | `fetch(url, { next: { revalidate: N } })` |
| Never cache this fetch | `fetch(url, { cache: 'no-store' })` |
| Purge by tag from a Server Action | `revalidateTag('companies', 'max')` |

⚠️ **`revalidateTag` takes two arguments in Next 16.** The single-argument form is deprecated and produces a TypeScript error. For read-your-writes semantics after a mutation, use `updateTag(tag)` instead.

---

## 6. CSS and styling

The easiest part of this migration. There are no CSS Modules, no Sass, no CSS-in-JS, and exactly one stylesheet.

| Item | Action |
|---|---|
| `src/index.css` | `git mv` to `app/globals.css`; import once in `app/layout.tsx` |
| `react-big-calendar` CSS | Import in `app/layout.tsx` **before** `globals.css` — the overrides in `globals.css` depend on the order |
| `tailwind.config.js` | Change `content` to `["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"]`; drop `"./index.html"` |
| `postcss.config.js` | Unchanged (Tailwind 3 syntax) |
| Brand tokens, animations, `backdropBlur` | Unchanged |
| `@tailwind base/components/utilities` | Unchanged |

**Stay on Tailwind 3.4.19.** Tailwind 4 replaces the JS config with CSS-first `@theme` directives and swaps the PostCSS plugin for `@tailwindcss/postcss`. Doing that at the same time as the framework migration means two independent sources of "why did the styling break".

If you *do* add CSS Modules later, Next requires the `.module.css` suffix and only permits plain `.css` imports from `app/layout.tsx` — worth knowing before someone tries to import a component-level stylesheet.

---

## 7. Static assets

Files in `public/` are served from the root and their URLs don't change: `public/och-logo.png` stays `/och-logo.png`. No code changes needed for `<img src="/hero-bg.png">`.

**Do rename the folders with spaces** (Phase 0). `public/company logos/` and `public/company images for hero section/` require percent-encoding in URLs and interact badly with `next/image`'s path matching. Rename to `company-logos/` and `hero-company-images/`, then:

```bash
grep -rn "company logos\|company images for hero section" src/ app/
```

### `next/image` (Phase 4)

Swapping `<img>` for `<Image>` gets you automatic WebP/AVIF, responsive `srcset`, and lazy loading. Two rules:

- Local images from `public/` need explicit `width`/`height`, or `fill` with a positioned parent.
- Remote images — anything served by the Spring backend under `/uploads` via `getMediaUrl()` — need their host allowlisted in `images.remotePatterns`.

Next 16 changed several `images` defaults. The ones that will surprise you:

| Setting | Next 15 | Next 16 |
|---|---|---|
| `qualities` | any | `[75]` only — other values are coerced to the nearest allowed |
| `minimumCacheTTL` | 60s | 14400s (4h) |
| `imageSizes` | includes 16 | 16 removed |
| `maximumRedirects` | unlimited | 3 |
| `domains` | supported | **deprecated** — use `remotePatterns` |

### `next/font` (Phase 4)

```tsx
import { Saira_Semi_Condensed } from 'next/font/google'

const saira = Saira_Semi_Condensed({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-saira',
})

// <html className={saira.variable}>
```

Then point `tailwind.config.js` at `var(--font-saira)` and delete the `<link>` tags and both `preconnect`s. Self-hosting removes two DNS lookups from the critical path, removes the font-swap flash, and lets you drop `fonts.googleapis.com` and `fonts.gstatic.com` from the CSP.

---

## 8. API routes and the backend

**You almost certainly do not need Route Handlers.** The Spring Boot backend owns every endpoint in `src/utils/api.ts` — roughly 90 of them — and none of that changes. Next.js is a frontend here.

### Same-origin proxying

`vite.config.ts` proxies `/api` and `/uploads` to `localhost:8080` in dev. The `rewrites()` equivalent works in dev *and* production:

```ts
async rewrites() {
  const backend = process.env.API_BASE_URL ?? 'http://localhost:8080'
  return [
    { source: '/api/:path*', destination: `${backend}/api/:path*` },
    { source: '/uploads/:path*', destination: `${backend}/uploads/:path*` },
  ]
}
```

Keeping the API same-origin means no CORS preflights and no CORS config to maintain — a real simplification over the current setup, where production browsers call the backend host directly.

### When a Route Handler *is* justified

Three narrow cases, all optional:

1. **Hiding a third-party key.** If the chat feature (`src/components/ChatWidget.tsx`, `API_ENDPOINTS.CHAT_MESSAGE`) ever needs to call a model provider directly, a handler at `app/api/chat/route.ts` keeps the key server-side. Today it goes through Spring, so this doesn't apply.
2. **A health endpoint.** `nginx.conf` serves `/health`; if any monitor depends on it, replace it with `app/api/health/route.ts` returning `200`.
3. **Login setting an httpOnly cookie** — part of the Risk R-07 follow-up, not this migration.

```ts
// app/api/health/route.ts
export const dynamic = 'force-dynamic'
export function GET() {
  return new Response('healthy\n', { headers: { 'Content-Type': 'text/plain' } })
}
```

---

## 9. Testing and validation checkpoints

Run these at the end of each phase. Nothing merges until its gate is green.

### Every phase

```bash
npm run typecheck     # tsc --noEmit — already enforced in CI
npm run lint          # eslint . — next build no longer lints
npm run build         # must succeed
```

### Phase 1 gate
- [ ] `next dev` serves at `localhost:3000`
- [ ] All 42 routes reachable through in-app navigation
- [ ] A hard refresh on a deep link (`/news/blogs/1`) renders correctly
- [ ] No `import.meta` remains: `grep -rn "import.meta" src/ app/` returns nothing
- [ ] No `VITE_` remains: `grep -rn "VITE_" src/ app/ .env*` returns nothing
- [ ] Admin login → dashboard flow works end to end

### Phase 2 gate
- [ ] `grep -rn "react-router-dom" src/ app/` returns nothing; package uninstalled
- [ ] All 42 URLs return 200 on a preview deploy
- [ ] Browser back/forward behaves
- [ ] `/admin` (login) renders **without** the admin sidebar; `/admin/dashboard` renders **with** it
- [ ] Navigating between routes scrolls to top **instantly**, not smoothly (verifies R-06)
- [ ] Unauthenticated `/admin/dashboard` redirects to `/admin` with no flash of admin content
- [ ] An unknown URL renders `not-found.tsx`, not a blank page

### Phase 3 gate
- [ ] `curl -s https://<preview>/companies | grep -c "<article"` > 0 — real content in the source
- [ ] View-source on `/news/blogs/<id>` shows the post title in `<title>` and `og:title`
- [ ] Lighthouse SEO ≥ 95 and Performance ≥ 85 on `/`, `/companies`, `/news/articles`
- [ ] `/sitemap.xml` and `/robots.txt` resolve and list the public routes
- [ ] Language switching still works; no hydration warnings in the console (R-03)
- [ ] Backend reachable from the Vercel preview, not just localhost (R-08)

### Phase 5 gate
See the full sign-off checklist in `04-pitfalls-and-checklist.md`.

### Worth adding

There is no test framework in this repo. Before Phase 2, consider a thin Playwright suite that visits all 42 URLs and asserts a 200 plus a known heading. It takes an afternoon to write and turns the riskiest phase of the migration into a command you can run.
