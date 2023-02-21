alter table activity
    alter column location_url type varchar(1000) using location_url::varchar(1000);

alter table activity_work_in_progress
    alter column location_url type varchar(1000) using location_url::varchar(1000);

alter table organisation
    alter column location_url type varchar(1000) using location_url::varchar(1000);

alter table organisation_work_in_progress
    alter column location_url type varchar(1000) using location_url::varchar(1000);
