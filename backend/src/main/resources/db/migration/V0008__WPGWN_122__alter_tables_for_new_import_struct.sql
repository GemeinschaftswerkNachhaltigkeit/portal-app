-- WPGWN_122

CREATE TABLE IF NOT EXISTS import_process
(
    -- EntityBase
    id                bigserial not null,
    -- AuditableEntityBase
    created_by        varchar(255),
    last_modified_by  varchar(255),
    created_at        timestamp not null,
    modified_at       timestamp,
    version           int8      not null,
    -- ImportProcess
    import_type       varchar(255),
    import_source     varchar(255),
    import_file_name  varchar(255),
    import_warnings   varchar(255),
    import_exceptions varchar(255),
    primary key (id)
);

CREATE TABLE IF NOT EXISTS import_process_import_warnings
(
    import_process_id int8 not null,
    import_warnings   varchar(255)
);

CREATE TABLE IF NOT EXISTS import_process_import_exceptions
(
    import_process_id int8 not null,
    import_exceptions varchar(255)
);

ALTER TABLE IF EXISTS activity
    ADD COLUMN organisation_id int8 not null;

ALTER TABLE IF EXISTS activity_work_in_progress
    ADD COLUMN organisation_work_in_progress_id int8,
    ADD COLUMN organisation_id                  int8,
    ADD COLUMN import_process_id                int8,
    DROP COLUMN privacy_consent,
    ALTER COLUMN random_unique_id SET not null,
    ALTER COLUMN random_unique_id TYPE uuid USING random_unique_id::uuid,
    ALTER COLUMN random_unique_id_generation_time SET NOT NULL;

ALTER TABLE IF EXISTS organisation_work_in_progress
    ADD COLUMN IF NOT EXISTS source            varchar(255),
    ADD COLUMN IF NOT EXISTS import_process_id int8;

alter table if exists activity
    add constraint FKgc0okjpgjcy39nowmhrj9g9qk foreign key (organisation_id) REFERENCES organisation;

ALTER TABLE IF EXISTS activity_work_in_progress
    ADD CONSTRAINT FK9ltybf1tkd71gadinvqt71rku FOREIGN KEY (import_process_id) REFERENCES import_process,
    ADD CONSTRAINT FK6ltd5vmn0h3q6ids9fc0pi7n2 FOREIGN KEY (organisation_id) REFERENCES organisation,
    ADD CONSTRAINT FKg0g9v8smbf8e10pjeouaglw2h FOREIGN KEY (organisation_work_in_progress_id) REFERENCES organisation_work_in_progress;


ALTER TABLE IF EXISTS import_process_import_exceptions
    ADD CONSTRAINT FKhvxx0g57cjn53uyiuk0vky2jt FOREIGN KEY (import_process_id) references import_process;
ALTER TABLE IF EXISTS import_process_import_warnings
    ADD CONSTRAINT FKjjr7414seua1ttfexd4n0tusu FOREIGN KEY (import_process_id) references import_process;
ALTER TABLE IF EXISTS organisation_work_in_progress
    ADD CONSTRAINT FK6273x9uhblex3hdbuwq0t08qv FOREIGN KEY (import_process_id) references import_process;
