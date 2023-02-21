-- WPGWN-184

CREATE TABLE IF NOT EXISTS activity_subscription
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
    activity_id             BIGINT NOT NULL,
    subscribed_user_id       VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (activity_id) REFERENCES activity ON DELETE CASCADE
);

alter table activity_subscription
    add constraint user_activity_unique_constraint unique (activity_id, subscribed_user_id);
