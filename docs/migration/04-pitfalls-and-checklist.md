# 04 — Pitfalls and Validation Checklist

---

## Part A — Pitfalls, with the fix

Each entry names the files in *this* repo that carry the problem. The ones marked ⚠️ are near-certain to hit you.

---

### P-01 ⚠️ `sessionStorage` / `window` / `document` at module scope

**Where:** `sessionStorage` in 30 files, `window.` in 14, `document.` in 10. Chief offenders: `src/hooks/useAuth.ts` (reads `sessionStorage` in the `useState` initializer), `src/utils/api.ts` (`getAuthHeaders`), `src/i18n/config.ts`.

**Symptom:** `ReferenceError: sessionStorage is not defined` during `next build`, or a hydration mismatch where the server renders the logged-out state and the client renders logged-in.

**Why:** Client Components are still **prerendered on the server**. `'use client'` does not mean "browser only" — it means "hydrates on the client". Module-scope and first-render browser API access still runs in Node.

**Fix:** Move every browser API read into `useEffect`, or guard it.

```tsx
// ❌ src/hooks/useAuth.ts as written — runs during SSR
const [authState, setAuthState] = useState<AuthState>({
  token: sessionStorage.getItem('adminToken'),
  // …
})

// ✅ start empty, hydrate in an effect
const [authState, setAuthState] = useState<AuthState>({
  token: null, username: null, name: null, role: null, isAuthenticated: false,
})

useEffect(() => {
  const token = sessionStorage.getItem('adminToken')
  setAuthState({
    token,
    username: sessionStorage.getItem('adminUsername'),
    name: sessionStorage.getItem('adminName'),
    role: sessionStorage.getItem('adminRole'),
    isAuthenticated: !!token,
  })
}, [])
```

`getAuthHeaders()` in `src/utils/api.ts` is only ever called from event handlers and effects, so it's safe as-is — but add a `typeof window === 'undefined'` guard so a future server-side caller fails loudly rather than at build time.

For a component that genuinely cannot render on the server, opt out explicitly:

```tsx
const Widget = dynamic(() => import('@/components/ChatWidget'), { ssr: false })
```

---

### P-02 ⚠️ `useRouter` imported from the wrong module

**Symptom:** `Error: NextRouter was not mounted` — with a stack trace that points nowhere useful.

**Why:** `next/router` is the Pages Router API. The App Router's is `next/navigation`. The import names are identical, so autocomplete will happily pick the wrong one.

**Fix:**

```tsx
import { useRouter } from 'next/navigation'   // ✅ App Router
import { useRouter } from 'next/router'       // ❌ Pages Router — will not work
```

Also note the API differs: App Router's `useRouter` has `push`/`replace`/`back`/`refresh` and **no** `query`, `pathname`, or `asPath`. Use `usePathname()` and `useSearchParams()` for those.

Add a guard so it can't come back:

```bash
grep -rn "from 'next/router'" app/ src/   # must return nothing
```

---

### P-03 ⚠️ `params` is a Promise

**Symptom:** `Route "/news/blogs/[id]" used params.id. params should be awaited before using its properties.` Or a TypeScript error on `props.params.id`.

**Why:** Next.js 15 made `params`, `searchParams`, `cookies()`, `headers()` and `draftMode()` async with a synchronous compatibility shim. **Next.js 16 removed the shim.** This affects all 6 dynamic routes in this repo.

**Fix:**

```tsx
// ❌
export default function Page({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)
}

// ✅
export default async function Page(props: PageProps<'/news/blogs/[id]'>) {
  const { id } = await props.params
  const post = await getPost(id)
}
```

Run `npx next typegen` so `PageProps` resolves. If you inherit any Next 15 code, the codemod handles it: `npx @next/codemod@canary next-async-request-api .`

Client Components are unaffected — `useParams()` from `next/navigation` stays synchronous.

---

### P-04 ⚠️ `useSearchParams` without a Suspense boundary

**Symptom:** `next build` fails hard: *"useSearchParams() should be wrapped in a suspense boundary at page /x"*. Dev mode gives no warning, so this only surfaces at build.

**Why:** `useSearchParams` forces client-side rendering of everything above it. Next requires an explicit boundary so the rest of the page can still be prerendered.

**Fix:** Wrap the consuming component, not the hook.

```tsx
export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <SearchResults />
    </Suspense>
  )
}
```

Relevant to the 8 files using `useLocation()` today — any that read `.search` will need this.

---

### P-05 ⚠️ Every `framer-motion` file needs `'use client'`

**Where:** 85 files.

**Symptom:** `You're importing a component that needs useState/createContext. It only works in a Client Component.`

**Fix:** Add `'use client'` as the **first line** of the file — before imports, before comments that aren't the directive.

The trap isn't adding the directive; it's adding it in the wrong place. Marking `page.tsx` as `'use client'` makes the entire subtree client-rendered and you lose all of Phase 3's benefit. Mark the **leaf** component instead, and keep `page.tsx` a Server Component that fetches data and passes it down. The worked example is in `02-implementation-guide.md` §5.

A useful rule: if a file imports `framer-motion`, `lucide-react` (fine either way, but often paired), `useState`, `useEffect`, or an event handler, it's a client component. If it only fetches and composes, it's a server component.

---

### P-06 ⚠️ Hydration mismatch from i18n language detection

**Where:** `src/i18n/config.ts` — `detection: { order: ['sessionStorage', 'navigator'], caches: ['sessionStorage'] }`.

**Symptom:** `Hydration failed because the server rendered HTML didn't match the client.` Visible as a flash of English before the page snaps to the user's language.

**Why:** Neither `sessionStorage` nor `navigator` exists on the server. The server always renders the fallback language.

**Fix:** Switch to a cookie, which travels with the request so the server can read it:

```ts
detection: {
  order: ['cookie', 'navigator'],
  caches: ['cookie'],
  lookupCookie: 'i18nextLng',
}
```

Then in a Server Component, `const lang = (await cookies()).get('i18nextLng')?.value ?? 'en'` and initialize with the same value.

Secondary problem in the same file: all 13 locale JSON files are statically imported, so every visitor downloads all 13 translations. Replace the static imports with `i18next-resources-to-backend` and dynamic imports.

---

### P-07 Static images imported as modules return an object

**Symptom:** `src` renders as `[object Object]`, or a TypeScript error on the import.

**Why:** Vite returns a URL string from an image import; Next returns `{ src, width, height, blurDataURL }`.

**Fix:** Either use `.src`, or use `next/image`:

```tsx
import logo from '../public/och-logo.png'

<img src={logo.src} />          // ✅ minimal change
<Image src={logo} alt="OCH" />  // ✅ better — automatic width/height
```

Low risk in this repo: images are referenced by public path (`/och-logo.png`), not imported. Watch for it in new code.

---

### P-08 Absolute imports from `/public` break

**Symptom:** `Module not found: Can't resolve '/hero-bg.png'`.

**Fix:** In Vite, `import img from '/hero-bg.png'` resolves from the public root. In Next, either use a relative import (`'../public/hero-bg.png'`) or just reference the URL string `"/hero-bg.png"` in `src`. String references need no change at all.

---

### P-09 ⚠️ Smooth scroll on every navigation

**Where:** `src/index.css` → `html { scroll-behavior: smooth; }`.

**Symptom:** After deleting `ScrollToTop.tsx`, every route change animates a long scroll to the top.

**Why:** Next.js used to force `scroll-behavior: auto` during navigation. **Next.js 16 stopped doing that** — it was expensive on every navigation.

**Fix:** `<html lang="en" data-scroll-behavior="smooth">` in `app/layout.tsx`. That opts back into the override: instant on route change, smooth for in-page anchors. Only then delete `ScrollToTop.tsx`.

---

### P-10 ⚠️ The nginx CSP renders a blank page

**Where:** `apps/frontend/nginx.conf` → `script-src 'self'`.

**Symptom:** White screen, console full of *"Refused to execute inline script"*.

**Why:** Next.js injects inline bootstrap scripts and inline RSC payload scripts. `'self'` alone blocks them.

**Fix:** Use the reworked CSP in `03-config-templates.md` §1. Keep it as `Content-Security-Policy-Report-Only` (as it is today) through the entire migration; flip to enforcing only after a clean soak. Nonce-based `script-src` via `proxy.ts` is the correct long-term answer.

---

### P-11 A stray `webpack` key fails the build outright

**Symptom:** `next build` refuses to run, reporting that a webpack configuration was found.

**Why:** Turbopack is the default in Next 16. Rather than silently ignoring a webpack config, Next fails so you can't ship a misconfigured build. A plugin can inject one even if you didn't write one.

**Fix:** Remove it, port it to `turbopack.rules`, or escape with `next build --webpack`. This repo has no webpack config today, so this only bites if someone adds a plugin.

---

### P-12 `next lint` doesn't exist

**Symptom:** `Unknown command "lint"` in CI; or lint errors reaching production because nothing runs the linter.

**Why:** `next lint` was **removed** in Next 16, and `next build` no longer lints.

**Fix:** `"lint": "eslint ."` in `package.json`, plus an explicit lint step in `.github/workflows/deploy-frontend.yml`. The `eslint` key in `next.config.ts` is also removed — don't add it.

---

### P-13 `revalidateTag` needs a second argument

**Symptom:** TypeScript error on `revalidateTag('companies')`.

**Fix:** `revalidateTag('companies', 'max')`. For read-your-writes semantics after a mutation — where the user should see their change immediately rather than stale data — use `updateTag('companies')` in a Server Action instead.

---

### P-14 `next/image` defaults changed in Next 16

**Symptom:** Image quality silently differs from what you asked for; remote images 400 on a redirect chain; `images.domains` warns.

**Fix:** Next 16 restricts `qualities` to `[75]` by default (other values coerce to the nearest allowed), raises `minimumCacheTTL` from 60s to 4 hours, drops `16` from `imageSizes`, and caps redirects at 3. `images.domains` is deprecated — use `remotePatterns`. Declare any quality value you actually pass. All configured in `03-config-templates.md` §1.

---

### P-15 Spaces in `public/` folder names

**Where:** `public/company logos/`, `public/company images for hero section/`.

**Symptom:** 404s on the Vercel CDN, or `next/image` refusing to match a `remotePatterns` / `localPatterns` entry.

**Fix:** Rename to kebab-case in Phase 0 — while the Vite app still runs and you can verify visually — then `grep -rn "company logos\|company images for hero" src/ app/` to catch every reference.

---

### P-16 Deployment size and cold builds

**Where:** `public/` is 160 MB — 56 MB videos, 50 MB `ecosystem-images`, 18 MB `images`, 6.7 MB of leadership PNGs.

**Symptom:** Slow builds, slow deploys, and no image optimization (files in `public/` are served verbatim; `next/image` never touches them).

**Fix:** Phase 4 — move `public/videos/` and `public/ecosystem-images/` to Vercel Blob or object storage; add the host to `images.remotePatterns`. Convert the leadership headshots to WebP. Both are independently shippable.

---

### P-17 Layout files can't use hooks

**Symptom:** `You're importing a component that needs usePathname. It only works in a Client Component.` in `layout.tsx`.

**Why:** Layouts are Server Components by default, and marking a layout `'use client'` forces the whole subtree client-side.

**Fix:** Keep the layout as a Server Component and extract the hook-using part into a client child. `AdminSidebar.tsx` will need this — it's a client component rendered *by* a server layout, which is fine.

---

### P-18 `serverRuntimeConfig` / `publicRuntimeConfig` are gone

**Symptom:** `getConfig()` returns undefined; the config keys are ignored.

**Fix:** Both were **removed in Next 16**. Use environment variables. If you need a server value read at request time rather than baked in at build time, `await connection()` from `next/server` before reading `process.env`.

---

### P-19 Route group collisions

**Symptom:** `You cannot have two parallel pages that resolve to the same path.`

**Why:** Route groups `(name)` don't add URL segments, so `app/(a)/about/page.tsx` and `app/(b)/about/page.tsx` both claim `/about`.

**Fix:** The structure in this plan avoids it: `app/admin/page.tsx` handles `/admin`, and `app/admin/(protected)/*` handles everything below. Don't add an `app/admin/layout.tsx` — it would wrap the login page in the auth gate.

---

### P-20 `middleware.ts` is now `proxy.ts`

Only relevant if you add one (the R-07 auth follow-up would). Next 16 renamed the convention: the file is `proxy.ts` and the exported function is `proxy`. Config flags renamed too — `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`. **The `edge` runtime is not supported in `proxy`**; it runs on Node and that isn't configurable.

---

## Part B — Sign-off checklist

Run against a **Vercel preview deployment pointed at the production backend** — not `localhost`. Anything unchecked is a blocker.

### Build and tooling

- [ ] `npm run build` succeeds with no warnings you haven't triaged
- [ ] `npm run typecheck` clean
- [ ] `npm run lint` clean
- [ ] `grep -rn "import.meta" src/ app/` → nothing
- [ ] `grep -rn "VITE_" src/ app/ .env*` → nothing
- [ ] `grep -rn "react-router-dom" src/ app/` → nothing
- [ ] `grep -rn "from 'next/router'" src/ app/` → nothing
- [ ] `vite`, `@vitejs/plugin-react`, `react-router-dom`, `terser`, `@react-google-maps/api`, `@vis.gl/react-google-maps`, `date-fns`, `clsx`, `tailwind-merge` all absent from `package.json`
- [ ] `index.html`, `vite.config.ts`, `main.tsx`, `vite-env.d.ts`, `tsconfig.node.json`, `.eslintrc.cjs` all deleted
- [ ] CI (`.github/workflows/deploy-frontend.yml`) passes with the lint step added and Node ≥ 20.9

### Routing — all 42

- [ ] All 17 public URLs return 200 (see the table in `02-implementation-guide.md` §2)
- [ ] All 25 admin URLs return 200 when authenticated
- [ ] Every URL works on a **hard refresh**, not just via in-app navigation
- [ ] Browser back and forward behave correctly, including after form submissions
- [ ] All 6 dynamic routes (`companies/[id]`, `careers/events/[id]`, `careers/opportunities/[id]`, `news/blogs/[id]`, `news/articles/[id]`, `news/media/[id]`) render real records
- [ ] A nonexistent ID renders `not-found.tsx`, not a crash or an infinite spinner
- [ ] An unknown path renders `not-found.tsx`
- [ ] Route changes scroll to top **instantly** (P-09)
- [ ] No URL from the current production site 404s — crawl and compare
- [ ] Both `/admin/pages/*` and `/admin/content/*` variants resolve (or redirect, if consolidated)

### Rendering and SEO

- [ ] `curl -s <preview>/companies` contains company names in the HTML source
- [ ] `curl -s <preview>/news/articles` contains article titles in the HTML source
- [ ] Each dynamic page's `<title>` and `og:title` show the **record's** title, not the site default
- [ ] `/sitemap.xml` resolves and lists all public routes
- [ ] `/robots.txt` resolves and allows the public site while disallowing `/admin`
- [ ] Lighthouse on `/`, `/companies`, `/news/articles`: SEO ≥ 95, Performance ≥ 85, Accessibility ≥ 90
- [ ] LCP, CLS and TTFB are no worse than the Vite baseline recorded in Phase 0

### Functionality

- [ ] Admin login succeeds and lands on `/admin/dashboard`
- [ ] Unauthenticated `/admin/dashboard` redirects to `/admin` with **no flash** of admin content
- [ ] Logout clears `sessionStorage` and blocks re-entry via back button
- [ ] Contact form submits and the message appears in `/admin/contact-messages`
- [ ] Talent-pool CV upload works end to end
- [ ] Job application submit works
- [ ] Admin media upload works and the uploaded file renders on the public site
- [ ] Search modal returns results
- [ ] Chat widget sends and renders markdown responses
- [ ] Events calendar (`/admin/hr/events`) renders **with dark theming** — verifies the `react-big-calendar` CSS import order
- [ ] Language switcher changes language and the choice persists across navigation
- [ ] No hydration warnings in the console on any public page (P-06)
- [ ] `ThreeGlobe` and `InteractiveWaterCanvas` render and animate (verifies the R3F v9 upgrade)
- [ ] Toasts appear top-right with the navy styling
- [ ] All 13 languages load without a console error

### Assets and media

- [ ] Every image on Home, Companies, Leadership and Culture loads — no broken images
- [ ] Videos on the Culture page play
- [ ] Backend-served media (`/uploads/*`) renders on both public and admin pages
- [ ] Favicon appears in the browser tab
- [ ] Saira Semi Condensed renders — no fallback-font flash

### Security and configuration

- [ ] Response headers include `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`, `Permissions-Policy`
- [ ] CSP is present as **Report-Only** and the browser console shows no violations from Next's own scripts (P-10)
- [ ] No secret is exposed under a `NEXT_PUBLIC_` variable
- [ ] `.env.local` is gitignored and uncommitted
- [ ] Production environment variables are set in Vercel for **both** Production and Preview
- [ ] Vercel Framework Preset is **Next.js**, not Vite
- [ ] Vercel Root Directory is `apps/frontend`
- [ ] Backend accepts server-to-server requests from Vercel — verified from a preview deploy, not localhost (R-08)

### Cutover and rollback

- [ ] Previous Vite production deployment is pinned in Vercel for instant rollback
- [ ] Rollback has been **rehearsed** on the preview environment, not just documented
- [ ] `docs/DEPLOYMENT.md` and `docs/oracle-cloud-deployment.md` updated to drop the nginx frontend
- [ ] `frontend` service removed from `docker-compose.yml`; the remaining compose file still starts the backend
- [ ] Analytics and error tracking confirmed reporting from the new deployment
- [ ] Team briefed: `npm run dev` now serves port **3000**, not 5173

---

## Part C — Deferred work

Log these so they don't get lost in the migration's slipstream.

| Item | Why deferred | Priority |
|---|---|---|
| Move admin JWT from `sessionStorage` to an httpOnly cookie + `proxy.ts` | Needs backend coordination; fixes both the XSS exposure and the auth flash | **High** |
| Lazy-load the 13 i18n locale bundles | Every visitor currently downloads all 13 | High |
| Offload `public/videos` + `public/ecosystem-images` (106 MB) | Independent of the framework migration | Medium |
| Playwright smoke suite over all 42 routes | Would have de-risked Phase 2; still valuable | Medium |
| Tailwind 3 → 4 | CSS-first rewrite; a project of its own | Low |
| TypeScript 5.9 → 7 | Native rewrite; wait for the ecosystem | Low |
| Nonce-based CSP, flip Report-Only → enforcing | Needs a soak period first | Medium |
| Server-render `/admin` | Only after the cookie-auth work lands | Low |
