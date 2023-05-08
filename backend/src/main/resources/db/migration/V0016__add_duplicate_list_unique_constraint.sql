alter table if exists duplicate_list
    add constraint duplicate_list_organisation_work_in_progress_id_unique unique (organisation_work_in_progress_id);
