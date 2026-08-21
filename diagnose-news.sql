-- ============================================================
-- Diagnose: only the first news article shows on /news/articles
--
-- Two likely causes, both checked below:
--
-- 1. Same NULL media_group bug as before, if the backend hasn't
--    been rebuilt/restarted since the MediaItem.java fix was
--    applied. This UPDATE is idempotent -- safe to rerun even if
--    it already fixed article #1.
--
-- 2. The second article was created by an ADMIN (not SUPER_ADMIN)
--    account. Admin-created content goes into pending_changes and
--    needs a SUPER_ADMIN to approve it at /admin/pending-changes
--    before it's ever written to media_items at all. If nobody
--    approved it, it simply doesn't exist in the public table yet
--    -- this is a different situation from the NULL-group bug.
--
-- Run with:
--   Get-Content diagnose-news.sql | docker exec -i ccubes-postgres psql -U postgres -d oceanlk_db
-- ============================================================

-- Step 1: backfill any NULL/empty group (harmless if already fixed)
UPDATE media_items
SET media_group = CASE
    WHEN UPPER(category) = 'LIFE_AT_OCH' THEN 'HR_PANEL'
    ELSE 'MEDIA_PANEL'
END
WHERE media_group IS NULL OR media_group = '';

-- Step 2: what's actually in media_items right now for NEWS
-- (this is what /api/media/news can possibly return)
SELECT id, title, category, media_group, status, published_date
FROM media_items
WHERE category = 'NEWS'
ORDER BY published_date DESC;

-- Step 3: is a news item stuck waiting for SUPER_ADMIN approval?
-- If a row shows up here, that's your missing second article --
-- go approve it at /admin/pending-changes.
SELECT id, entity_type, action, submitted_by, status, submitted_at,
       LEFT(change_data, 200) AS change_data_preview
FROM pending_changes
WHERE entity_type = 'MediaItem'
ORDER BY submitted_at DESC;
