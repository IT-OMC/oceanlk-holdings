-- ============================================================
-- Add admin: admin@demo-maritime.lk  /  DemoAdmin@2026!
-- Target: local Postgres  jdbc:postgresql://localhost:5433/oceanlk_db
--
-- Run with:
--   psql -h localhost -p 5433 -U postgres -d oceanlk_db -f add-admin.sql
--
-- The password below is a BCrypt hash (cost 10) of the literal
-- string  DemoAdmin@2026!  and matches SecurityConfig's
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
    'Demo Maritime Admin',
    'admin@demo-maritime.lk',
    '$2b$10$BEhT7RzFuwRitQbjmYSqSuG2aDnfv7/JO6iJbXNKxn6KQMHkAdh7S',
    'admin@demo-maritime.lk',
    '+94771234567',
    'ADMIN',
    NOW(),
    TRUE,
    TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM admin_users WHERE username = 'admin@demo-maritime.lk'
);

-- Verify (password column intentionally not selected)
SELECT id, name, username, email, role, active, verified, created_date
FROM admin_users
ORDER BY created_date;
