-- WPGWN-136

CREATE TABLE IF NOT EXISTS organisation_membership
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

    organisation_id                  int8,

    email                            varchar(255) not null,

    status                           varchar(255) not null,
    user_type                        varchar(255) not null,
    closed_at                        timestamp,
    expires_at                       timestamp,
    email_sent                       boolean,

    PRIMARY KEY (id),
    FOREIGN KEY (organisation_id) REFERENCES organisation
);

alter table organisation_membership
    add constraint user_organisation_unique_membership_constraint unique (email, organisation_id);
