-- ============================================================
-- Add super admin: superadmin@demo-maritime.lk  /  DemoSuper@2026!
-- Target: local Postgres  jdbc:postgresql://localhost:5433/oceanlk_db
--   (adjust host/port below to match wherever your backend is
--    actually pointed right now, per DATABASE_URL in .env)
--
-- Run with:
--   Get-Content add-superadmin.sql | docker exec -i ccubes-postgres psql -U postgres -d oceanlk_db
-- or, if you have a native psql client:
--   psql -h localhost -p 5433 -U postgres -d oceanlk_db -f add-superadmin.sql
--
-- The password below is a BCrypt hash (cost 10) of the literal
-- string  DemoSuper@2026!  and matches SecurityConfig's
-- BCryptPasswordEncoder. Do NOT retype the plaintext here.
-- ============================================================

INSERT INTO admin_users (
    id,
    name,
    username,
    password,
    email,
    phone,
    role,
    created_date,
    active,
    verified
)
SELECT
    gen_random_uuid()::text,
    'Demo Maritime Super Admin',
    'superadmin@demo-maritime.lk',
    '$2b$10$p80JEdonj/mGdBOn7R2NjOVP29syekgl.vGhtuuUWg3kYOe9lSK4O',
    'superadmin@demo-maritime.lk',
    '+94771234567',
    'SUPER_ADMIN',
    NOW(),
    TRUE,
    TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM admin_users WHERE username = 'superadmin@demo-maritime.lk'
);

-- Verify (password column intentionally not selected)
SELECT id, name, username, email, role, active, verified, created_date
FROM admin_users
ORDER BY created_date;
