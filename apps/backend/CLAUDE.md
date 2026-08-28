# Backend (`apps/backend`)

Spring Boot 3.5, Java 17, Maven (no wrapper checked in — use a system `mvn`). Build/run from
this directory, not the repo root:

```bash
mvn spring-boot:run            # local dev
mvn clean package -DskipTests  # what CI runs
```

## Layout

Standard layered architecture — `controller` → `service` → `repository`, with `dto`/`model`
kept separate (controllers never return raw entities). See
`.skills/springboot-expert/SKILL.md` at the repo root for the conventions this codebase
already follows.

## Things that will break if you get them wrong

- **Schema is not Hibernate-managed.** `spring.jpa.hibernate.ddl-auto` is `${DDL_AUTO:none}`,
  and production forces `validate`. The actual schema lives in hand-written SQL migrations
  against Supabase Postgres — add or alter tables there, not by changing an `@Entity` and
  expecting Hibernate to catch up.
- **`JWT_SECRET` has no fallback** (`app.jwt.secret=${JWT_SECRET}`) — the app won't start
  locally without it set in `.env`.
- **Redis is required for real rate limiting.** Without `REDIS_HOST`/`REDIS_PORT` reachable,
  `RateLimitFilter` silently degrades to per-instance in-memory buckets, which a second
  replica (or even a second browser tab hitting a different instance) bypasses.
- **API paths are unversioned** (`/api/companies`, `/api/admin/...`, etc.) — don't introduce
  a `/api/v1/...` prefix on new endpoints; match the existing convention.

See `SECURITY_SETUP.md` in this directory for JWT/CORS/rate-limit configuration details, and
`docker-compose.yml` at the repo root for how this service, Redis, and their health checks
fit together for local/prod container runs.
