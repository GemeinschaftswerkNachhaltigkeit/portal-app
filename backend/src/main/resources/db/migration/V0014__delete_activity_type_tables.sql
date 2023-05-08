DROP TABLE activity_activity_types;
DROP TABLE activity_work_in_progress_activity_types;

ALTER TABLE activity
    ADD COLUMN activity_type VARCHAR(255);

ALTER TABLE activity_work_in_progress
    ADD COLUMN activity_type VARCHAR(255);
