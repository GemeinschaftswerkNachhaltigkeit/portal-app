create table marketplace
(
    id                     bigserial    not null,
    created_at             timestamp    not null,
    created_by             varchar(255),
    last_modified_by       varchar(255),
    modified_at            timestamp,
    version                int8         not null,
    contact_email          varchar(255) not null,
    contact_firstname      varchar(255) not null,
    contact_image          varchar(255),
    contact_lastname       varchar(255) not null,
    contact_phone          varchar(255),
    contact_position       varchar(255),
    description            text,
    description_tsvec      tsvector GENERATED ALWAYS AS (to_tsvector('german', description)) STORED,
    address_city           varchar(255),
    address_country        varchar(255),
    address_name           varchar(255),
    address_state          varchar(255),
    address_street         varchar(255),
    address_street_no      varchar(40),
    address_supplement     varchar(255),
    address_zip_code       varchar(6),
    location_coordinate    geometry(POINT),
    location_online        boolean,
    marketplace_type       varchar(60)  not null,
    name                   varchar(255),
    offer_category         varchar(255),
    best_practise_category varchar(255),
    location_url           varchar(255),
    name_tsvec             tsvector GENERATED ALWAYS AS (to_tsvector('german', name)) STORED,
    image_path             varchar(255),
    organisation_id        int8,
    primary key (id),
    foreign key (organisation_id) references organisation
);
create table marketplace_thematic_focus
(
    marketplace_item_id       int8 not null,
    thematic_focus varchar(255),
    foreign key (marketplace_item_id) references marketplace
);


create table marketplace_work_in_progress
(
    id                               bigserial   not null,
    created_at                       timestamp   not null,
    created_by                       varchar(255),
    last_modified_by                 varchar(255),
    modified_at                      timestamp,
    version                          int8        not null,
    contact_email                    varchar(255),
    contact_firstname                varchar(255),
    contact_image                    varchar(255),
    contact_lastname                 varchar(255),
    contact_phone                    varchar(255),
    contact_position                 varchar(255),
    description                      text,
    image_path                       varchar(255),
    address_city                     varchar(255),
    address_country                  varchar(255),
    address_name                     varchar(255),
    address_state                    varchar(255),
    address_street                   varchar(255),
    address_street_no                varchar(40),
    address_supplement               varchar(255),
    address_zip_code                 varchar(6),
    location_coordinate              geometry(POINT),
    location_online                  boolean,
    location_url                     varchar(255),
    marketplace_type                 varchar(60) not null,
    name                             varchar(255),
    offer_category                   varchar(255),
    best_practise_category           varchar(255),
    random_unique_id_generation_time timestamp   not null,
    random_unique_id                 uuid unique not null,
    marketplace_id                         int8,
    organisation_id                  int8,
    primary key (id),
    foreign key (organisation_id) references organisation,
    foreign key (marketplace_id) references marketplace
);

create table marketplace_work_in_progress_thematic_focus
(
    marketplace_work_in_progress_id int8 not null,
    thematic_focus            varchar(255),
    foreign key (marketplace_work_in_progress_id) references marketplace_work_in_progress
);
