alter table organisation_work_in_progress_feedback_history_entry
    alter column feedback_request type text using feedback_request::text;
