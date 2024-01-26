DO $$
BEGIN

    IF EXISTS (SELECT 1
               FROM information_schema.columns
               WHERE table_name = 'activity' AND column_name = 'source' AND data_type = 'integer') THEN

    ALTER TABLE activity ADD COLUMN source_temp VARCHAR(255);

    UPDATE activity
      SET source_temp = CASE
                          WHEN source = 0 THEN 'LANDING_PAGE'
                          WHEN source = 1 THEN 'WEB_APP'
                          WHEN source = 2 THEN 'DAN_XML'
                          WHEN source = 3 THEN 'IMPORT'
                          ELSE NULL
                        END;

    DROP VIEW IF EXISTS public.v_active_dan;

    ALTER TABLE activity DROP COLUMN source;

    ALTER TABLE activity RENAME COLUMN source_temp TO source;

ELSE
        RAISE NOTICE 'Column source does not exist or is not of type int4 in activity.';
END IF;
END $$;


DO $$
BEGIN

    IF EXISTS (SELECT 1
               FROM information_schema.columns
               WHERE table_name = 'activity_work_in_progress' AND column_name = 'source' AND data_type = 'integer') THEN

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

    ELSE
        RAISE NOTICE 'Column source does not exist or is not of type int4 in activity_work_in_progress.';
    END IF;

END $$;

