-- Deletes the 17 QA/test leads created during lead-notification testing
-- (2026-09-09). Verified against production /admin/collections/leads before
-- writing this — these are the exact 17 rows whose Name contains
-- "ทดสอบ", "Test Lead", or "Retest Lead" (QA suffix). The other 4 leads in
-- the table (Doctor / aff / Laphatsanan / Ohmmmmm) are NOT touched.
--
-- Run on the production DB (same DATABASE_URI as in .env), e.g.:
--   psql "$DATABASE_URI" -f delete_test_leads.sql
-- or paste the DELETE statement directly into psql / your DB client.

BEGIN;

DELETE FROM leads
WHERE id IN (24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8);

-- sanity check: should print 0 (rows are already gone at this point)
SELECT COUNT(*) AS remaining_count FROM leads WHERE id IN (24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8);

COMMIT;
