ALTER TABLE activity_work_in_progress
    ADD COLUMN banner_image_mode VARCHAR(50);

ALTER TABLE activity
    ADD COLUMN banner_image_mode VARCHAR(50);

ALTER TABLE organisation_work_in_progress
    ADD COLUMN banner_image_mode VARCHAR(50);

ALTER TABLE organisation
    ADD COLUMN banner_image_mode VARCHAR(50);
