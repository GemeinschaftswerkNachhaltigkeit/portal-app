create table duplicate_list
(
    id                               bigserial not null,
    created_at                       timestamp not null,
    created_by                       varchar(255),
    last_modified_by                 varchar(255),
    modified_at                      timestamp,
    version                          int8      not null,
    organisation_work_in_progress_id int8,
    primary key (id)
);
create table duplicate_list_item
(
    id                               bigserial not null,
    duplicate_list_id                int8      not null,
    organisation_id                  int8,
    organisation_work_in_progress_id int8,
    primary key (id)
);
create table duplicate_list_item_duplicate_for_fields
(
    duplicate_list_item_id int8 not null,
    duplicate_for_fields   varchar(255)
);
alter table if exists duplicate_list
    add constraint FK6f4p0b7et5sidsqc01ylwvo3b foreign key (organisation_work_in_progress_id) references organisation_work_in_progress;
alter table if exists duplicate_list_item
    add constraint FKp3rik00c4a7oyrso16mjts6or foreign key (duplicate_list_id) references duplicate_list;
alter table if exists duplicate_list_item
    add constraint FKbyhaw5g5nsm9n32p17x65q7ok foreign key (organisation_id) references organisation;
alter table if exists duplicate_list_item
    add constraint FKt13x9dh7u7svrr5or30e78xo6 foreign key (organisation_work_in_progress_id) references organisation_work_in_progress;
alter table if exists duplicate_list_item_duplicate_for_fields
    add constraint FK42yj5k6e5559ev8hvc5hv4yrp foreign key (duplicate_list_item_id) references duplicate_list_item;
