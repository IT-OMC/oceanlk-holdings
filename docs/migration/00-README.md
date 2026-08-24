# Vite → Next.js Migration: `apps/frontend`

**Project:** Ocean Ceylon Holdings (`oceanlk-holdings`)
**Scope:** `apps/frontend` only. `apps/backend` (Spring Boot) is unchanged.
**Target:** Next.js 16 App Router, SSR/SSG for the public site, CSR for `/admin`, deployed to Vercel.
**Prepared:** 24 August 2026 — versions verified against npm on this date.

---

## The decision set this plan was written against

| Decision | Choice | Consequence |
|---|---|---|
| Router | **App Router** (`app/`) | React Server Components; ~85 files need `'use client'` |
| Rendering | **SSR/SSG public, CSR admin** | Public pages fetch on the server; `/admin/*` stays a client app |
| Hosting | **Vercel only** | Frontend `Dockerfile`, `nginx.conf` and the `frontend` service in `docker-compose.yml` are retired; nginx security headers move into `next.config.ts` |

If any of these change, the plan changes materially — re-read §Risks in `01-migration-plan.md` before deviating.

## Documents

| File | What it is | Audience |
|---|---|---|
| `01-migration-plan.md` | Phased roadmap, dependency analysis, structure map, config mapping, env strategy, risk register | Tech lead, PM |
| `02-implementation-guide.md` | Step-by-step instructions with the full 42-route mapping table and code transforms | Engineers doing the work |
| `03-config-templates.md` | Drop-in `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `.env.*`, `package.json`, `vercel.json`, CI | Engineers doing the work |
| `04-pitfalls-and-checklist.md` | Repo-specific failure modes with fixes, plus the go/no-go sign-off checklist | Everyone |

## What we're migrating (measured, not assumed)

```
apps/frontend/
├── src/
│   ├── App.tsx              42 routes in a nested React Router v6 tree
│   ├── main.tsx             ReactDOM.createRoot entrypoint
│   ├── index.css            9.5 KB — the ONLY stylesheet (Tailwind + globals)
│   ├── pages/               41 page components → 42 routes (3 are routed twice,
│   │                        2 are never routed)
│   ├── components/          57 components (28 root, 6 admin, 4 chat, 2 corporate,
│   │                        13 culture, 4 news)
│   ├── layouts/             MainLayout.tsx, AdminLayout.tsx
│   ├── hooks/               useAuth.ts, useWhatsApp.ts
│   ├── services/            searchService.ts
│   ├── utils/               api.ts — ~90 endpoint constants, single BASE_URL
│   ├── types/               api.ts, index.ts
│   ├── data/                5 static data modules
│   └── i18n/                config.ts + 13 locale JSON files
└── public/                  160 MB of static assets  ← see Risk R-04
```

**Key facts that shaped this plan**

- `framer-motion` is imported in **85 files** — the single largest source of `'use client'` churn.
- No CSS Modules, no Sass, no styled-components. One global stylesheet. Styling migration is nearly free.
- No `React.lazy` / `Suspense` anywhere — no manual code splitting to unwind.
- Only **two** `import.meta.env` reads (`src/utils/api.ts:1`, `src/services/searchService.ts:1`).
- `sessionStorage` in **30 files** — the auth token and the i18n language. Both are SSR hazards.
- `public/` is 160 MB, of which 56 MB is video and 50 MB is `ecosystem-images`. Several folders contain **spaces** in their names.
- Two page components are never routed: `src/pages/admin/MyPendingChanges.tsx` and `src/pages/admin/SuperAdminApproval.tsx`.

## Ground rules for the team

1. **One phase per PR, merged to `main` behind a preview deploy.** Every phase in `01-migration-plan.md` ends in a working, deployable app. Never leave the branch broken across a weekend.
2. **Do not stack unrelated upgrades onto this migration.** Tailwind 4 and TypeScript 7 are both available and both are separate projects. Stay on Tailwind 3.4.19 and TypeScript 5.9.3.
3. **The React 19 upgrade happens under Vite first (Phase 0), not during the framework swap.** If a library breaks, you want the old build system still working so you can bisect.
4. **`npx tsc --noEmit` must pass at the end of every phase.** It already runs in CI (`.github/workflows/deploy-frontend.yml`); keep it green.
