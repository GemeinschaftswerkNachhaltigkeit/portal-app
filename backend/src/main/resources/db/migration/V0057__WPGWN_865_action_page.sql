create table if not exists action_page
(
    id                 bigserial    not null,
    created_at         timestamp    not null,
    created_by         varchar(255),
    last_modified_by   varchar(255),
    modified_at        timestamp,
    version            int8         not null,
    payload            jsonb        not null,
    form_key           varchar(255) not null,
    post_construct_job varchar(255) not null,
    unique_hash        varchar(255) not null,
    primary key (id)
);

create index if not exists action_page_unique_hash_index
    on action_page using btree
    (unique_hash collate pg_catalog."default" asc nulls last)
    tablespace pg_default;
