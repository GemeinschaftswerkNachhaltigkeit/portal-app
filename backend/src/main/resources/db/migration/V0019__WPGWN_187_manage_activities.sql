-- WPGWN-187

alter table activity
    add column image_path        varchar(255),
    add column logo_path         varchar(255),
    add column status            varchar(255),
    add column import_process_id int8;

alter table if exists activity_work_in_progress
    add column status varchar(255);

alter table if exists contact_invite
    add column activity_id int8;
alter table if exists contact_invite
    add constraint FKbervacgcau6khs4rvhii8nuim foreign key (activity_id) references activity;
