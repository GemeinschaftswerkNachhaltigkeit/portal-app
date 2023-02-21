ALTER TABLE organisation_membership
    ADD COLUMN IF NOT EXISTS created_new_user boolean,
    ADD COLUMN IF NOT EXISTS last_name varchar(255),
    ADD COLUMN IF NOT EXISTS first_name varchar(255);

