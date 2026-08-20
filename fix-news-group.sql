-- ============================================================
-- Fix: approved news article not showing on /news/articles
--
-- Root cause: /api/media/news queries media_items with an exact
-- match on BOTH category = 'NEWS' AND media_group = 'MEDIA_PANEL'
-- AND status = 'PUBLISHED'. NewsManagement.tsx (the admin "Add
-- News" form) never sends a "group" field, so every news article
-- created through the admin UI lands with media_group = NULL.
-- NULL never matches 'MEDIA_PANEL' in SQL, so the article is
-- PUBLISHED and sitting in the table, but invisible to the public
-- endpoint. Same bug affects Blog/Media items created the same way.
--
-- This backfills any media_items row that's missing its group,
-- inferring it from category (same mapping DataMigrationComponent
-- already uses on backend startup).
--
-- Run with:
--   Get-Content fix-news-group.sql | docker exec -i ccubes-postgres psql -U postgres -d oceanlk_db
-- ============================================================

UPDATE media_items
SET media_group = CASE
    WHEN UPPER(category) = 'LIFE_AT_OCH' THEN 'HR_PANEL'
    ELSE 'MEDIA_PANEL'
END
WHERE media_group IS NULL OR media_group = '';

-- Verify: this should now show your approved news article(s)
SELECT id, title, category, media_group, status, published_date
FROM media_items
WHERE category = 'NEWS'
ORDER BY published_date DESC;
