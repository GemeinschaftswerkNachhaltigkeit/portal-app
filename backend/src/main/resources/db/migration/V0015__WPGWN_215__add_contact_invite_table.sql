-- WPGWN-215

CREATE TABLE IF NOT EXISTS contact_invite
(
    -- EntityBase
    id                               bigserial not null,
    -- AuditableEntityBase
    created_by                       varchar(255),
    last_modified_by                 varchar(255),
    created_at                       timestamp  not null,
    modified_at                      timestamp,
    version                          int8       not null,
    -- ContactConfirmation
    random_unique_id                 uuid not null,
    random_unique_id_generation_time timestamp,

    organisation_work_in_progress_id int8,
    organisation_id                  int8,

    contact_email                    varchar(255),
    contact_firstname                varchar(255),
    contact_image                    varchar(255),
    contact_lastname                 varchar(255),
    contact_phone                    varchar(255),
    contact_position                 varchar(255),

    status                           varchar(255) not null,
    closed_at                        timestamp,
    expires_at                       timestamp,
    email_sent                       boolean,

    PRIMARY KEY (id),
    FOREIGN KEY (organisation_work_in_progress_id) REFERENCES organisation_work_in_progress,
    FOREIGN KEY (organisation_id) REFERENCES organisation
);
