DROP TABLE IF EXISTS api_key;
CREATE TABLE api_key
(
    api_key          uuid         NOT NULL,
    created_at       timestamp    NOT NULL,
    created_by       varchar(255),
    keycloak_user_id varchar(255) NOT NULL UNIQUE,
    last_modified_by varchar(255),
    modified_at      timestamp,
    version          int8         NOT NULL,
    primary key (api_key)
);
