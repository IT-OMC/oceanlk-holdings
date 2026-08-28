# OceanLK Holdings — Monorepo

Two independently deployed apps:
- `apps/frontend` — Next.js 16 (App Router), deployed to Vercel. See `apps/frontend/CLAUDE.md`.
- `apps/backend` — Spring Boot 3.5 / Java 17 REST API, deployed via Docker (`docker-compose.yml`). See `apps/backend/CLAUDE.md`.

## How the two talk to each other

The frontend has no `app/api` routes and no Server Actions — every read and mutation goes
through `fetch()` calls to the backend's REST API, defined in
`apps/frontend/src/utils/api.ts` (`NEXT_PUBLIC_API_BASE_URL`). Treat the backend as the
single source of truth for data; don't invent a Next.js-side data layer.

## Data & infra

- **Database:** PostgreSQL via Supabase. Schema is managed by hand-written SQL migrations,
  not Hibernate — `spring.jpa.hibernate.ddl-auto` must stay `validate`/`none` in every
  environment, including local dev.
- **Redis:** only used for distributed rate-limit token buckets (`RateLimitFilter`); no
  persistence, not a general-purpose cache.
- **Auth:** JWT, issued by the backend. The backend refuses to start without `JWT_SECRET`
  set — there's no fallback.

## Skill docs available in this repo

- `.claude/skills/nextjs-expert/SKILL.md`, `.claude/skills/springboot-expert/SKILL.md` —
  stack conventions, tailored to this project's actual architecture. Read the inline notes
  before following the generic advice: a couple of points are deliberately overridden for
  this repo.
- `.claude/skills/supabase/SKILL.md`, `.claude/skills/supabase-postgres-best-practices/SKILL.md`
  — pointers into `.agents/skills/` (installed/tracked via `skills-lock.json`) — Supabase/
  Postgres guidance, relevant to any backend schema or query work.
