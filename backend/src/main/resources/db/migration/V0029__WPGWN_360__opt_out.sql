CREATE TABLE IF NOT EXISTS email_opt_out_entry
(
    id                                  bigserial primary key,
    email                               varChar(255) not null,
    random_unique_id_generation_time    timestamp not null,
    random_unique_id                    uuid not null,

    CONSTRAINT unique_opt_out_email UNIQUE (email),
    CONSTRAINT unique_random_unique_id UNIQUE (random_unique_id)
);

create table email_opt_out_entry_email_opt_out_options
(
    email_opt_out_entry_id              bigserial not null,
    email_opt_out_options               varChar(127) not null,

    CONSTRAINT foreign_key_email_opt_out_entry
        FOREIGN KEY (email_opt_out_entry_id) REFERENCES email_opt_out_entry
);
