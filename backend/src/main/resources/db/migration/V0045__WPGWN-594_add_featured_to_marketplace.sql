ALTER table marketplace
    ADD COLUMN featured bool NOT NULL DEFAULT false,
    ADD COLUMN featured_text varchar(255);
ALTER table marketplace_work_in_progress
    ADD COLUMN featured bool NOT NULL DEFAULT false,
    ADD COLUMN featured_text varchar(255);
