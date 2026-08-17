# Deployment Guide

OceanLK Holdings is a single deployable app: **Next.js 14 (App Router)** in `apps/frontend/`, deployed to **Vercel**. Content is served from **Supabase** (auth, database, storage) and **Sanity** (headless CMS for news/press posts). There is no separate backend service — the previous Spring Boot API has been retired.

## Required environment variables

Set these in the Vercel project settings (Production + Preview) and in `apps/frontend/.env.local` for local development. See `apps/frontend/.env.example` for the full template.

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable anon key>
SUPABASE_SERVICE_ROLE_KEY=<secret service role key>   # server-only, never exposed to client

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=mpoj5gw7
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-02-01
NEXT_PUBLIC_SANITY_STUDIO_URL=https://<your-deployed-studio-url>
SANITY_API_READ_TOKEN=<token, required only if the dataset is not public>

# Google Gemini (AI chat)
GEMINI_API_KEY=<key>

# Transactional email (Resend)
RESEND_API_KEY=<key>
EMAIL_FROM="OceanLK Holdings <noreply@ocean.lk>"
EMAIL_HR=hr@omc.lk
EMAIL_INFO=info@ocean.lk

# Site
NEXT_PUBLIC_SITE_URL=https://ocean.lk
```

**Never commit `.env` or `.env.local` to version control.** `SUPABASE_SERVICE_ROLE_KEY` and `SANITY_API_READ_TOKEN` in particular must stay server-only secrets — set them in Vercel's environment variable settings, not in any client-readable config.

## Deploying the frontend (Vercel)

CI is defined in `.github/workflows/deploy-frontend.yml`:
1. On every push/PR to `main`, `production`, or `development`: installs dependencies, runs `tsc --noEmit`, and runs `next build` to verify the build.
2. On push (not PR): deploys to Vercel via `amondnet/vercel-action`, using `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` GitHub Secrets. Pushes to `production` deploy with `--prod`; other branches deploy as preview builds.

To deploy manually instead:
```bash
cd apps/frontend
npm ci
npx vercel --prod
```

## Sanity Studio

The CMS studio lives in `apps/studio-oceanceylonholdings/`. Deploy it separately (e.g. `npx sanity deploy` from that directory, or host it wherever `NEXT_PUBLIC_SANITY_STUDIO_URL` points). Content editors publish news/press articles there; the live site reads them via `next-sanity` — no separate publish step is needed on the frontend once a post is published in Sanity (subject to the page's `revalidate` window, currently 60s).

## Supabase

Database schema lives in `apps/frontend/supabase/migrations/`. Apply migrations via the Supabase CLI or dashboard SQL editor against your project. Admin access is gated by a `profiles.role` column (`superadmin` | `admin` | `hr`) checked in `apps/frontend/src/middleware.ts` — see `apps/frontend/src/lib/supabase/admin-roles.ts` for the single source of truth on allowed roles.

## Local development

```bash
cd apps/frontend
npm install
cp .env.example .env.local   # then fill in real values
npm run dev
```

Runs at `http://localhost:3000`.

## Production checklist

- [ ] All environment variables set in Vercel (Production + Preview)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` and `SANITY_API_READ_TOKEN` are server-only secrets, not exposed via `NEXT_PUBLIC_*`
- [ ] Sanity Studio deployed and reachable at `NEXT_PUBLIC_SANITY_STUDIO_URL`
- [ ] At least one Sanity `post` published and visible on `/news`
- [ ] Supabase RLS policies reviewed for `profiles`, `companies`, `job_opportunities`, etc.
- [ ] Custom domain + HTTPS configured in Vercel
- [ ] `NEXT_PUBLIC_SITE_URL` matches the production domain
