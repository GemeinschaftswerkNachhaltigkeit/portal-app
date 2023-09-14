ALTER TABLE IF EXISTS marketplace
    ADD COLUMN end_until date;

ALTER TABLE IF EXISTS marketplace_work_in_progress
    ADD COLUMN end_until date;


