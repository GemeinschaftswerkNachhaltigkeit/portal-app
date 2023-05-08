create sequence hibernate_sequence start 1 increment 1;
create table initiative_on_map
(
    id                bigserial       not null,
    created_at        timestamp       not null,
    created_by        varchar(255),
    last_modified_by  varchar(255),
    modified_at       timestamp,
    version           int8            not null,
    approved_until    date,
    category          varchar(255),
    clearing_status   varchar(255),
    contact_email     varchar(255)    not null,
    contact_fax       varchar(255),
    contact_name      varchar(255)    not null,
    contact_phone     varchar(255),
    description       text            not null,
    external_id       varchar(255),
    address_city      varchar(255)    not null,
    address_country   varchar(255)    not null,
    address_state     varchar(255)    not null,
    address_street    varchar(255)    not null,
    address_zip_code  varchar(15)     not null,
    coordinate        geometry(POINT) not null,
    address_url       varchar(255)    not null,
    name              varchar(255)    not null,
    organisation_type varchar(255),
    organiser         varchar(255),
    period_end        timestamp,
    period_start      timestamp,
    privacy_consent   boolean         not null,
    source            int4,
    thematic_focus    varchar(255),
    primary key (id)
);
create table initiative_on_map_audit_log
(
    id                int8 not null,
    rev               int4 not null,
    revtype           int2,
    approved_until    date,
    category          varchar(255),
    clearing_status   varchar(255),
    contact_email     varchar(255),
    contact_fax       varchar(255),
    contact_name      varchar(255),
    contact_phone     varchar(255),
    description       text,
    external_id       varchar(255),
    address_city      varchar(255),
    address_country   varchar(255),
    address_state     varchar(255),
    address_street    varchar(255),
    address_zip_code  varchar(15),
    coordinate        geometry(POINT),
    address_url       varchar(255),
    name              varchar(255),
    organisation_type varchar(255),
    organiser         varchar(255),
    period_end        timestamp,
    period_start      timestamp,
    privacy_consent   boolean,
    source            int4,
    thematic_focus    varchar(255),
    primary key (id, rev)
);
create table initiative_on_map_external_categories_audit_log
(
    rev                  int4         not null,
    initiative_on_map_id int8         not null,
    external_categories  varchar(255) not null,
    revtype              int2,
    primary key (rev, initiative_on_map_id, external_categories)
);
create table initiative_on_map_rne_categories_audit_log
(
    rev                  int4         not null,
    initiative_on_map_id int8         not null,
    rne_categories       varchar(255) not null,
    revtype              int2,
    primary key (rev, initiative_on_map_id, rne_categories)
);
create table initiative_on_map_sub_goals_audit_log
(
    rev                  int4 not null,
    initiative_on_map_id int8 not null,
    subgoals             int8 not null,
    revtype              int2,
    primary key (rev, initiative_on_map_id, subgoals)
);
create table initiative_on_map_sustainable_development_goals_audit_log
(
    rev                           int4 not null,
    initiative_on_map_id          int8 not null,
    sustainable_development_goals int8 not null,
    revtype                       int2,
    primary key (rev, initiative_on_map_id, sustainable_development_goals)
);
create table initiative_work_in_progress
(
    id                               bigserial not null,
    created_at                       timestamp not null,
    created_by                       varchar(255),
    last_modified_by                 varchar(255),
    modified_at                      timestamp,
    version                          int8      not null,
    approved_until                   date,
    category                         varchar(255),
    clearing_status                  varchar(255),
    contact_email                    varchar(255),
    contact_fax                      varchar(255),
    contact_name                     varchar(255),
    contact_phone                    varchar(255),
    description                      text,
    external_id                      varchar(255),
    address_city                     varchar(255),
    address_country                  varchar(255),
    address_state                    varchar(255),
    address_street                   varchar(255),
    address_zip_code                 varchar(15),
    coordinate                       geometry(POINT),
    location_coordinate              varchar(255),
    name                             varchar(255),
    organisation_type                varchar(255),
    organiser                        varchar(255),
    period_end                       timestamp,
    period_start                     timestamp,
    privacy_consent                  boolean   not null,
    random_unique_id_generation_time timestamp,
    random_unique_id                 varchar(255),
    source                           int4,
    thematic_focus                   varchar(255),
    initiative_on_map_id             int8,
    primary key (id)
);
create table initiative_on_map_external_categories
(
    initiative_on_map_id int8 not null,
    external_categories  varchar(255)
);
create table initiative_on_map_rne_categories
(
    initiative_on_map_id int8 not null,
    rne_categories       varchar(255)
);
create table initiative_on_map_sub_goals
(
    initiative_on_map_id int8 not null,
    subgoals             int8
);
create table initiative_on_map_sustainable_development_goals
(
    initiative_on_map_id          int8 not null,
    sustainable_development_goals int8
);
create table initiative_work_in_progress_external_categories
(
    initiative_work_in_progress_id int8 not null,
    external_categories            varchar(255)
);
create table initiative_work_in_progress_rne_categories
(
    initiative_work_in_progress_id int8 not null,
    rne_categories                 varchar(255)
);
create table initiative_work_in_progress_sustainable_development_goals
(
    initiative_work_in_progress_id int8 not null,
    sustainable_development_goals  int8
);
create table revinfo
(
    rev      int4 not null,
    revtstmp int8,
    primary key (rev)
);
alter table if exists initiative_work_in_progress
    add constraint UK_lst1onn2pnxhgax50x4v0n0nq unique (random_unique_id);
alter table if exists initiative_on_map_audit_log
    add constraint FKb5h456so1o21iaxsl6fkwkh9w foreign key (rev) references revinfo;
alter table if exists initiative_on_map_external_categories_audit_log
    add constraint FKi8itgk1xyc9pmtb9u22mxhds6 foreign key (rev) references revinfo;
alter table if exists initiative_on_map_rne_categories_audit_log
    add constraint FKenxpyxkap02jt95f0nx539pkp foreign key (rev) references revinfo;
alter table if exists initiative_on_map_sub_goals_audit_log
    add constraint FKgq956f12irln5a7vriqcoornb foreign key (rev) references revinfo;
alter table if exists initiative_on_map_sustainable_development_goals_audit_log
    add constraint FKc7u3yys2sfqfvslvotpg93fhl foreign key (rev) references revinfo;
alter table if exists initiative_work_in_progress
    add constraint FKp4xyibt57v86l47vxej2v1w2x foreign key (initiative_on_map_id) references initiative_on_map;
alter table if exists initiative_on_map_external_categories
    add constraint FKgd2fiji088la49mew52gixarm foreign key (initiative_on_map_id) references initiative_on_map;
alter table if exists initiative_on_map_rne_categories
    add constraint FKf8jnl11mys00769ubw75qd6ku foreign key (initiative_on_map_id) references initiative_on_map;
alter table if exists initiative_on_map_sub_goals
    add constraint FKckqyw32l0pgypq97psthii6do foreign key (initiative_on_map_id) references initiative_on_map;
alter table if exists initiative_on_map_sustainable_development_goals
    add constraint FKa2bmkcyfpkg5wlaa1yykon5gs foreign key (initiative_on_map_id) references initiative_on_map;
alter table if exists initiative_work_in_progress_external_categories
    add constraint FKjuinwnwrqhda7ttli0eruobny foreign key (initiative_work_in_progress_id) references initiative_work_in_progress;
alter table if exists initiative_work_in_progress_rne_categories
    add constraint FKedhhmqxrbf8bjwnh6rd4wjgns foreign key (initiative_work_in_progress_id) references initiative_work_in_progress;
