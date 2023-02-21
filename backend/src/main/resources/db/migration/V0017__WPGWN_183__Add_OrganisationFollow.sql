-- WPGWN-183

CREATE TABLE IF NOT EXISTS organisation_subscription
(
    -- EntityBase
    id                      BIGSERIAL NOT NULL,
    -- AuditableEntityBase
    created_by              VARCHAR(255),
    last_modified_by        VARCHAR(255),
    created_at              TIMESTAMP NOT NULL,
    modified_at             TIMESTAMP,
    version                 int8 NOT NULL,
    -- ImportProcess
    organisation_id         BIGINT NOT NULL,
    subscribed_user_id       VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (organisation_id) REFERENCES organisation ON DELETE CASCADE
);

alter table organisation_subscription
    add constraint user_organisation_unique_constraint unique (organisation_id, subscribed_user_id);
