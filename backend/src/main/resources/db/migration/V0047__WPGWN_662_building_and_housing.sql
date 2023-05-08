create table building_and_housing_contact
(
    id                  bigserial    not null,
    created_at          timestamp    not null,
    created_by          varchar(255),
    last_modified_by    varchar(255),
    modified_at         timestamp,
    version             int8         not null,
    name                varchar(255) not null,
    organisation        varchar(255),
    email               varchar(255) not null,
    position             varchar(255),
    station             varchar(255) not null,
    station_description varchar(255) not null,
    unique_hash         varchar(255) not null,
    privacy_consent     boolean,
    primary key (id)
);

create index if not exists unique_hash_index
    on building_and_housing_contact using btree
    (unique_hash collate pg_catalog."default" asc nulls last)
    tablespace pg_default;
