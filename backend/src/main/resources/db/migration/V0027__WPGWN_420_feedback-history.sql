create table organisation_work_in_progress_feedback_history_entry
(
    id                               bigserial not null,
    created_at                       timestamp not null,
    created_by                       varchar(255),
    last_modified_by                 varchar(255),
    modified_at                      timestamp,
    version                          int8      not null,
    feedback_request                 varchar(255),
    feedback_request_sent            timestamp,
    organisation_work_in_progress_id int8,
    primary key (id)
);
alter table if exists organisation_work_in_progress_feedback_history_entry
    add constraint organisation_work_in_progress_feedback_history_entry foreign key (organisation_work_in_progress_id) references organisation_work_in_progress;
