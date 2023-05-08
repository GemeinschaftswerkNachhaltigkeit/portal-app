alter table activity
    alter column address_street_no type varchar(40) using address_street_no::varchar(40);

alter table activity_work_in_progress
    alter column address_street_no type varchar(40) using address_street_no::varchar(40);

alter table organisation
    alter column address_street_no type varchar(40) using address_street_no::varchar(40);

alter table organisation_work_in_progress
    alter column address_street_no type varchar(40) using address_street_no::varchar(40);
