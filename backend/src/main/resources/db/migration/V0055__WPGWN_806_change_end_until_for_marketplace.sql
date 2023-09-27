ALTER TABLE IF EXISTS marketplace
     ALTER COLUMN end_until TYPE timestamp;

ALTER TABLE IF EXISTS marketplace_work_in_progress
     ALTER COLUMN end_until TYPE timestamp;


