ALTER TABLE IF EXISTS activity
    ADD COLUMN register_url   VARCHAR(1000);

ALTER TABLE IF EXISTS activity_work_in_progress
    ADD COLUMN register_url   VARCHAR(1000);


