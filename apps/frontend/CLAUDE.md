@AGENTS.md

# Frontend (`apps/frontend`)

Next.js 16, App Router, React 19, Tailwind. Dev server runs on **port 5173, not 3000**
(`next dev -p 5173` — a leftover from the pre-migration Vite setup, kept so bookmarks/scripts
don't break). Deployed to Vercel only; there's no Docker image or nginx for this app anymore
(see `docs/migration/` for the Phase 0–5 history if you need the "why").

## Data layer

There are no `app/api` routes and no Server Actions here. Every read/mutation goes through
`fetch()` against the separate Spring Boot backend, via the URL builders in
`src/utils/api.ts` (`NEXT_PUBLIC_API_BASE_URL`). Prefer fetching in Server Components/layouts
and passing data down; reach for `useEffect` fetching in a Client Component only when the
data is genuinely client-only. When multiple client components need the same server data
(nav, hero, a listing page), fetch it once server-side in the nearest layout and share it via
a small React Context seeded with that initial value — see `CompaniesProvider`
(`src/components/CompaniesProvider.tsx`, wired in `app/(site)/layout.tsx`) as the reference
implementation. A plain per-component `useEffect` fetch causes duplicate network calls *and*
a blank-then-pop-in flash on first paint, since the server-rendered HTML has no data yet.

There's also a `rewrites()` in `next.config.ts` proxying `/api/*` and `/uploads/*` to the
backend same-origin — but the existing convention across this codebase is to call the
backend via the absolute `NEXT_PUBLIC_API_BASE_URL` helpers instead (relying on the backend's
CORS allowlist), not that same-origin proxy. Don't assume a `/api/...` fetch already goes
through it unless you check.

## Media/logo URLs — easy to get wrong

Two different resolution rules exist and are **not interchangeable**:
- Blog/news/media `imageUrl`/`videoUrl` are real backend-hosted files — always resolve them
  through `getMediaUrl()` (`src/utils/api.ts`), which prefixes the backend host.
- Company `logoUrl`/`image` are **not** run through `getMediaUrl()`. The backend returns
  legacy, space-named folder paths (`/company logos/...`,
  `/company images for hero section/...`) that don't correspond to anything the backend
  actually serves. They must be string-replaced to the hyphenated folder names checked into
  this app's own `public/` folder instead:
  `logoUrl?.replace('company logos', 'company-logos')` and
  `image?.replace('company images for hero section', 'hero-company-images')`. Skip this and
  the image 404s. See `Companies.tsx`, `CompanySingle.tsx`, `Hero.tsx`, or `Navbar.tsx` for
  the pattern to copy at any new render site.

`next/image` also needs the backend host allowlisted in `next.config.ts`'s
`images.remotePatterns` (currently just `/api/files/**`) — extend that list if a new external
image host is introduced.

## Loading states for media cards

Don't render a thumbnail as a bare CSS `background-image` div or a `<video>` with no
`poster`/loading state — both pop in abruptly once the network request finishes. Use
`MediaImage`/`MediaVideo` from `src/components/MediaThumbnail.tsx` (pulsing skeleton →
fade-in on `onLoad`/`onLoadedData`), as done in `Blogs.tsx`, `News.tsx`, and `Media.tsx`.

## Layout / routing

- `app/(site)/...` — the public site. `app/(site)/layout.tsx` wraps every page here in
  `CompaniesProvider` (and `SocialLinksProvider`), plus the persistent `Navbar`/`Footer`.
- `app/admin/(protected)/...` — the admin panel, a separate auth boundary. Auth is a JWT
  bearer token kept in `sessionStorage` (`adminToken`); use `getAuthHeaders()`
  (`src/utils/api.ts`) when calling admin endpoints, not a manual header object.

## i18n

`react-i18next` with lazily-loaded locale bundles and a cookie-persisted locale (added in the
Phase 4 migration). Don't hardcode user-facing strings in new public-site components without
checking whether the surrounding component already goes through `t(...)`.

## Security headers

`next.config.ts` currently ships the CSP as `Content-Security-Policy-Report-Only` (an
intentional soak period, not an oversight) — a violation won't actually be blocked yet. Check
the browser console / report endpoint before assuming a CSP issue is enforced or fixed.

## Commands

Run from this directory:
```bash
npm run dev        # port 5173
npm run build
npm run typecheck   # tsc --noEmit
npm run lint
```
