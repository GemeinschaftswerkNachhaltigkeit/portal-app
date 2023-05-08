ALTER table organisation_work_in_progress ADD COLUMN feedback text;
ALTER table organisation_work_in_progress ADD COLUMN feedback_sent_at timestamp;
ALTER table organisation_work_in_progress ADD COLUMN rejection_reason text;

ALTER TABLE organisation_work_in_progress ALTER COLUMN privacy_consent DROP NOT NULL;
