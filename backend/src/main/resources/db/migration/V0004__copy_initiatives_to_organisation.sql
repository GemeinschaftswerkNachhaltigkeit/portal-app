CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


INSERT INTO organisation_work_in_progress (id,
                                           created_at,
                                           created_by,
                                           last_modified_by,
                                           modified_at,
                                           version,
                                           contact_email,
                                           description,
                                           name,
                                           privacy_consent,
                                           random_unique_id) SELECT id, created_at, created_by, last_modified_by, modified_at, version, contact_email, description, name, privacy_consent, uuid_generate_v4() FROM initiative_work_in_progress;

INSERT INTO organisation_work_in_progress_sustainable_development_goals (organisation_work_in_progress_id, sustainable_development_goals)
SELECT initiative_work_in_progress_id, sustainable_development_goals
FROM initiative_work_in_progress_sustainable_development_goals;
