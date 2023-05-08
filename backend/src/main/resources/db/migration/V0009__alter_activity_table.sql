ALTER TABLE IF EXISTS activity
    ADD COLUMN location_coordinate geometry(POINT),
    ADD COLUMN location_url        VARCHAR(255),
    ADD COLUMN location_online     boolean,
    DROP COLUMN coordinate,
    DROP COLUMN address_url,
    DROP COLUMN online;

ALTER TABLE IF EXISTS activity_work_in_progress
    ADD COLUMN location_online boolean,
    DROP COLUMN online;

ALTER TABLE IF EXISTS organisation
    ADD COLUMN location_online   boolean,
    DROP COLUMN online,
    ADD COLUMN image_path        varchar(255),
    ADD COLUMN impact_area       varchar(255) not null,
    ADD COLUMN organisation_type varchar(255),
    ADD COLUMN source            varchar(255),
    ADD COLUMN import_process_id int8;

ALTER TABLE IF EXISTS organisation
    RENAME COLUMN "logo" TO "logo_path";

ALTER TABLE IF EXISTS organisation
    ALTER COLUMN location_coordinate DROP not null,
    ALTER COLUMN location_url DROP not null ;

ALTER TABLE IF EXISTS organisation
    ADD CONSTRAINT FKkhjiy7kq8845p9t8dbj47p0g4 FOREIGN KEY (import_process_id) references import_process;

ALTER TABLE IF EXISTS organisation_work_in_progress
    ADD COLUMN location_online boolean,
    DROP COLUMN online;
