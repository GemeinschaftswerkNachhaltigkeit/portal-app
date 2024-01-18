ALTER TABLE activity ADD COLUMN source_temp VARCHAR(255);
UPDATE activity
SET source_temp = CASE
                      WHEN source = 0 THEN 'LANDING_PAGE'
                      WHEN source = 1 THEN 'WEB_APP'
                      WHEN source = 2 THEN 'DAN_XML'
                      WHEN source = 3 THEN 'IMPORT'
                      ELSE NULL
    END;
ALTER TABLE activity DROP COLUMN source;
ALTER TABLE activity RENAME COLUMN source_temp TO source;

ALTER TABLE activity_work_in_progress ADD COLUMN source_temp VARCHAR(255);
UPDATE activity_work_in_progress
SET source_temp = CASE
                      WHEN source = 0 THEN 'LANDING_PAGE'
                      WHEN source = 1 THEN 'WEB_APP'
                      WHEN source = 2 THEN 'DAN_XML'
                      WHEN source = 3 THEN 'IMPORT'
                      ELSE NULL
    END;
ALTER TABLE activity_work_in_progress DROP COLUMN source;
ALTER TABLE activity_work_in_progress RENAME COLUMN source_temp TO source;
