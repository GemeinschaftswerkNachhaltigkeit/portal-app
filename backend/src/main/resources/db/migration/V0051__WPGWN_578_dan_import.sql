create table if not exists import_dan_xml_process
(
    id                  bigserial    not null,
    created_at          timestamp    not null,
    created_by          varchar(255),
    last_modified_by    varchar(255),
    modified_at         timestamp,
    version             int8          not null,
    import_filename     varchar(255)  not null,
    import_id           varchar(255)  not null,
    import_status       varchar(255)  not null,
    report              text,
    constraint import_dan_xml_process_pkey primary key (id)
)

drop index if exists import_id_idx;

create index if not exists import_id_idx
    on import_dan_xml_process using btree
    (import_id  asc nulls last);


create table if not exists import_dan_xml_queue
(
    id bigserial not null default,
    created_at timestamp not null,
    created_by  varchar(255) ,
    last_modified_by  varchar(255) ,
    modified_at timestamp,
    version int8 not null,
    activity_id bigint,
    aimed  varchar(255) ,
    category  varchar(255) ,
    dan_id  varchar(255) ,
    date_end timestamp,
    date_start timestamp,
    detail_text text ,
    image  varchar(255) ,
    import_id  varchar(255) ,
    import_status  varchar(255) ,
    import_type  varchar(255) ,
    intro_text  varchar(255) ,
    latitude  varchar(255) ,
    link  varchar(255) ,
    longitude  varchar(255) ,
    name  varchar(255) ,
    organizer  varchar(255) ,
    organizer_email  varchar(255) ,
    organizer_tel  varchar(255) ,
    organizer_website  varchar(255) ,
    unique_key  varchar(255) ,
    venue  varchar(255) ,
    constraint import_dan_xml_queue_pkey primary key (id)
    )

-- Index: dan_id_queue_idx

drop index if exists dan_id_queue_idx;

create index if not exists dan_id_queue_idx
    on import_dan_xml_queue using btree
    (dan_id asc nulls last);

-- index: import_id_queue_idx

drop index if exists import_id_queue_idx;

create index if not exists import_id_queue_idx
    on import_dan_xml_queue using btree
    (import_id asc nulls last);
