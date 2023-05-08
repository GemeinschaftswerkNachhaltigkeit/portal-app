create table activity
(
    id                bigserial       not null,
    created_at        timestamp       not null,
    created_by        varchar(255),
    last_modified_by  varchar(255),
    modified_at       timestamp,
    version           int8            not null,
    approved_until    date,
    contact_email     varchar(255)    not null,
    contact_firstname varchar(255)    not null,
    contact_image     varchar(255),
    contact_lastname  varchar(255)    not null,
    contact_phone     varchar(255),
    contact_position  varchar(255),
    description       text            not null,
    external_id       varchar(255),
    impact_area       varchar(255),
    address_city      varchar(255),
    address_country   varchar(255),
    address_state     varchar(255),
    address_street    varchar(255),
    address_street_no varchar(5),
    address_zip_code  varchar(15),
    coordinate        geometry(POINT) not null,
    online            boolean,
    address_url       varchar(255)    not null,
    name              varchar(255)    not null,
    period_end        timestamp,
    period_start      timestamp,
    privacy_consent   boolean         not null,
    source            int4,
    primary key (id)
);
create table activity_social_media_contact
(
    id               bigserial not null,
    created_at       timestamp not null,
    created_by       varchar(255),
    last_modified_by varchar(255),
    modified_at      timestamp,
    version          int8      not null,
    contact          varchar(255),
    type             varchar(255),
    activity_id      int8,
    primary key (id)
);
create table activity_sustainable_development_goals
(
    activity_id                   int8 not null,
    sustainable_development_goals int8
);
create table activity_thematic_focus
(
    activity_id    int8 not null,
    thematic_focus varchar(255)
);
create table activity_type
(
    activity_id int8 not null,
    type        varchar(255)
);
create table activity_work_in_progress
(
    id                               bigserial not null,
    created_at                       timestamp not null,
    created_by                       varchar(255),
    last_modified_by                 varchar(255),
    modified_at                      timestamp,
    version                          int8      not null,
    approved_until                   date,
    contact_email                    varchar(255),
    contact_firstname                varchar(255),
    contact_image                    varchar(255),
    contact_lastname                 varchar(255),
    contact_phone                    varchar(255),
    contact_position                 varchar(255),
    description                      text,
    external_id                      varchar(255),
    image_path                       varchar(255),
    impact_area                      varchar(255),
    address_city                     varchar(255),
    address_country                  varchar(255),
    address_state                    varchar(255),
    address_street                   varchar(255),
    address_street_no                varchar(5),
    address_zip_code                 varchar(6),
    location_coordinate              geometry(POINT),
    online                           boolean,
    location_url                     varchar(255),
    logo_path                        varchar(255),
    name                             varchar(255),
    period_end                       timestamp,
    period_start                     timestamp,
    privacy_consent                  boolean   not null,
    random_unique_id_generation_time timestamp,
    random_unique_id                 varchar(255),
    source                           int4,
    activity_id                      int8,
    primary key (id)
);
create table activity_work_in_progress_social_media_contact
(
    id                           bigserial not null,
    created_at                   timestamp not null,
    created_by                   varchar(255),
    last_modified_by             varchar(255),
    modified_at                  timestamp,
    version                      int8      not null,
    contact                      varchar(255),
    type                         varchar(255),
    activity_work_in_progress_id int8,
    primary key (id)
);
create table activity_work_in_progress_sustainable_development_goals
(
    activity_work_in_progress_id  int8 not null,
    sustainable_development_goals int8
);
create table activity_work_in_progress_thematic_focus
(
    activity_work_in_progress_id int8 not null,
    thematic_focus               varchar(255)
);
create table activity_work_in_progress_type
(
    activity_work_in_progress_id int8 not null,
    type                         varchar(255)
);
create table organisation
(
    id                  bigserial not null,
    created_at          timestamp not null,
    created_by          varchar(255),
    last_modified_by    varchar(255),
    modified_at         timestamp,
    version             int8      not null,
    contact_email       varchar(255),
    contact_firstname   varchar(255),
    contact_image       varchar(255),
    contact_lastname    varchar(255),
    contact_phone       varchar(255),
    contact_position    varchar(255),
    description         text,
    external_id         varchar(255),
    keycloak_group_id   varchar(255),
    address_city        varchar(255),
    address_country     varchar(255),
    address_state       varchar(255),
    address_street      varchar(255),
    address_street_no   varchar(5),
    address_zip_code    varchar(6),
    location_coordinate geometry(POINT),
    online              boolean,
    location_url        varchar(255),
    logo                varchar(255),
    name                varchar(255),
    privacy_consent     boolean,
    primary key (id)
);
create table organisation_social_media_contact
(
    id               bigserial not null,
    created_at       timestamp not null,
    created_by       varchar(255),
    last_modified_by varchar(255),
    modified_at      timestamp,
    version          int8      not null,
    contact          varchar(255),
    type             varchar(255),
    organisation_id  int8,
    primary key (id)
);
create table organisation_sustainable_development_goals
(
    organisation_id               int8 not null,
    sustainable_development_goals int8
);
create table organisation_thematic_focus
(
    organisation_id int8 not null,
    thematic_focus  varchar(255)
);
create table organisation_work_in_progress
(
    id                               bigserial not null,
    created_at                       timestamp not null,
    created_by                       varchar(255),
    last_modified_by                 varchar(255),
    modified_at                      timestamp,
    version                          int8      not null,
    approved_until                   date,
    contact_email                    varchar(255),
    contact_firstname                varchar(255),
    contact_image                    varchar(255),
    contact_lastname                 varchar(255),
    contact_phone                    varchar(255),
    contact_position                 varchar(255),
    description                      text,
    external_id                      varchar(255),
    image_path                       varchar(255),
    impact_area                      varchar(255),
    keycloak_group_id                varchar(255),
    address_city                     varchar(255),
    address_country                  varchar(255),
    address_state                    varchar(255),
    address_street                   varchar(255),
    address_street_no                varchar(5),
    address_zip_code                 varchar(6),
    location_coordinate              geometry(POINT),
    online                           boolean,
    location_url                     varchar(255),
    logo_path                        varchar(255),
    name                             varchar(255),
    import_details                   varchar(255),
    import_source                    varchar(255),
    organisation_type                varchar(255),
    privacy_consent                  boolean   not null,
    random_unique_id_generation_time timestamp,
    random_unique_id                 uuid      not null,
    status                           varchar(255),
    organisation_id                  int8,
    primary key (id)
);
create table organisation_work_in_progress_email_notification_dates
(
    owner_id                int8 not null,
    email_notification_date timestamp
);
create table organisation_work_in_progress_social_media_contact
(
    id                               bigserial not null,
    created_at                       timestamp not null,
    created_by                       varchar(255),
    last_modified_by                 varchar(255),
    modified_at                      timestamp,
    version                          int8      not null,
    contact                          varchar(255),
    type                             varchar(255),
    organisation_work_in_progress_id int8,
    primary key (id)
);
create table organisation_work_in_progress_sustainable_development_goals
(
    organisation_work_in_progress_id int8 not null,
    sustainable_development_goals    int8
);
create table organisation_work_in_progress_thematic_focus
(
    organisation_work_in_progress_id int8 not null,
    thematic_focus                   varchar(255)
);
alter table if exists activity_work_in_progress
    add constraint UK_bt9rnko9mwotu8d2lbkl30wch unique (random_unique_id);
alter table if exists organisation_work_in_progress
    add constraint UK_qt4r0uialki5nicgnhle84lmn unique (random_unique_id);
alter table if exists activity_social_media_contact
    add constraint FK9ooleadxurfms6qkwrdh3ohht foreign key (activity_id) references activity;
alter table if exists activity_sustainable_development_goals
    add constraint FKd93ow3bfkojub6yjdgryiw9le foreign key (activity_id) references activity;
alter table if exists activity_thematic_focus
    add constraint FK715id0dp84cfaq62ls6r6yx5m foreign key (activity_id) references activity;
alter table if exists activity_type
    add constraint FK8v44tm8rtbmbeatvcnd3a6548 foreign key (activity_id) references activity;
alter table if exists activity_work_in_progress
    add constraint FKfgsvfgq4ymhq2wndokxqw1iew foreign key (activity_id) references activity;
alter table if exists activity_work_in_progress_social_media_contact
    add constraint FK5gng5bhyifrla5hm2fx8kuvfa foreign key (activity_work_in_progress_id) references activity_work_in_progress;
alter table if exists activity_work_in_progress_sustainable_development_goals
    add constraint FK1s1fcj1oeop5jdi9pryqael3q foreign key (activity_work_in_progress_id) references activity_work_in_progress;
alter table if exists activity_work_in_progress_thematic_focus
    add constraint FK7d9hxwkv6i0a0ydjkn2y0qv6x foreign key (activity_work_in_progress_id) references activity_work_in_progress;
alter table if exists activity_work_in_progress_type
    add constraint FK3wwe12qox3tio2yfehdouvupq foreign key (activity_work_in_progress_id) references activity_work_in_progress;
alter table if exists organisation_social_media_contact
    add constraint FKjp7nnq9yyu3f23g3l2g4upsry foreign key (organisation_id) references organisation;
alter table if exists organisation_sustainable_development_goals
    add constraint FKfqcvqwh1ov6fb6xhdx00w82j2 foreign key (organisation_id) references organisation;
alter table if exists organisation_thematic_focus
    add constraint FKp5up9g0mwjdlc3263nusy2cjc foreign key (organisation_id) references organisation;
alter table if exists organisation_work_in_progress
    add constraint FKpbot7ctajbme9de6ax0hpw9pn foreign key (organisation_id) references organisation;
alter table if exists organisation_work_in_progress_email_notification_dates
    add constraint FK493v7r62ro48ugvud59530al8 foreign key (owner_id) references organisation_work_in_progress;
alter table if exists organisation_work_in_progress_social_media_contact
    add constraint FKto0br32pdwhq43duect4175j foreign key (organisation_work_in_progress_id) references organisation_work_in_progress;
alter table if exists organisation_work_in_progress_sustainable_development_goals
    add constraint FK226hntnauj5mewq09b9ndjqli foreign key (organisation_work_in_progress_id) references organisation_work_in_progress;
alter table if exists organisation_work_in_progress_thematic_focus
    add constraint FK7381wqueygigc3qflys66bs5w foreign key (organisation_work_in_progress_id) references organisation_work_in_progress;
