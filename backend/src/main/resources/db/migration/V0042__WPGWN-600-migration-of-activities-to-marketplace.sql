-- offer EDUCATIONAL_OFFERS

-- PARTICIPATION_PROCESS --> OFFER (VOLUNTEERING)
-- FUNDING_PROGRAM --> OFFER (FUNDING_PROGRAMMES_AND_GRANTS)
-- PROJECT_PROGRESS --> BEST_PRACTISE (PROJECT_REPORT)

ALTER TABLE marketplace
    ADD COLUMN old_activity_id int8;

INSERT INTO marketplace (created_at, created_by, last_modified_by, modified_at, version, contact_email,
                         contact_firstname, contact_image, contact_lastname, contact_phone, contact_position,
                         description, address_city, address_country, address_name, address_state, address_street,
                         address_street_no, address_supplement, address_zip_code, location_coordinate,
                         location_online, marketplace_type, name, offer_category, best_practise_category,
                         location_url, image_path, organisation_id, old_activity_id)
SELECT created_at,
       created_by,
       last_modified_by,
       modified_at,
       version,
       contact_email,
       contact_firstname,
       contact_image,
       contact_lastname,
       contact_phone,
       contact_position,
       description,
       address_city,
       address_country,
       address_name,
       address_state,
       address_street,
       address_street_no,
       address_supplement,
       address_zip_code,
       location_coordinate,
       location_online,
       'OFFER',
       name,
       'VOLUNTEERING',
       null,
       location_url,
       image_path,
       organisation_id,
       a.id
FROM activity a
WHERE a.activity_type = 'PARTICIPATION_PROCESS';

INSERT INTO marketplace_thematic_focus (marketplace_item_id, thematic_focus)
SELECT mp.id, tf.thematic_focus
FROM marketplace as mp
         join activity_thematic_focus as tf on mp.old_activity_id = tf.activity_id
where mp.old_activity_id is not null;

-- delete all entries related to the activities
DELETE
FROM contact_invite contact
    USING activity a
WHERE a.id = contact.activity_id
  and a.activity_type = 'PARTICIPATION_PROCESS';

DELETE
FROM activity_social_media_contact social
    USING activity a
WHERE a.id = social.activity_id
  and a.activity_type = 'PARTICIPATION_PROCESS';

DELETE
FROM activity_subscription sub
    USING activity a
WHERE a.id = sub.activity_id
  and a.activity_type = 'PARTICIPATION_PROCESS';

DELETE
FROM activity_sustainable_development_goals sdg
    USING activity a
WHERE a.id = sdg.activity_id
  and a.activity_type = 'PARTICIPATION_PROCESS';

DELETE
FROM activity_thematic_focus foc
    USING activity a
WHERE a.id = foc.activity_id
  and a.activity_type = 'PARTICIPATION_PROCESS';

DELETE
FROM activity_work_in_progress_social_media_contact wipSocial
    USING activity a, activity_work_in_progress wip
WHERE a.id = wip.activity_id
  and wipSocial.activity_work_in_progress_id = wip.id
  and a.activity_type = 'PARTICIPATION_PROCESS';

DELETE
FROM activity_work_in_progress_sustainable_development_goals wipSdg
    USING activity a, activity_work_in_progress wip
WHERE a.id = wip.activity_id
  and wipSdg.activity_work_in_progress_id = wip.id
  and a.activity_type = 'PARTICIPATION_PROCESS';

DELETE
FROM activity_work_in_progress_thematic_focus wipTf
    USING activity a, activity_work_in_progress wip
WHERE a.id = wip.activity_id
  and wipTf.activity_work_in_progress_id = wip.id
  and a.activity_type = 'PARTICIPATION_PROCESS';

DELETE
FROM activity_work_in_progress wip
    USING activity a
WHERE a.id = wip.activity_id
  and a.activity_type = 'PARTICIPATION_PROCESS';

DELETE
FROM activity a
WHERE a.activity_type = 'PARTICIPATION_PROCESS';

-- delete all work in progress with activity type
DELETE
FROM activity_work_in_progress_social_media_contact wipSocial
    USING activity_work_in_progress wip
WHERE wipSocial.activity_work_in_progress_id = wip.id
  and wip.activity_type = 'PARTICIPATION_PROCESS';

DELETE
FROM activity_work_in_progress_sustainable_development_goals wipSdg
    USING activity_work_in_progress wip
WHERE wipSdg.activity_work_in_progress_id = wip.id
  and wip.activity_type = 'PARTICIPATION_PROCESS';

DELETE
FROM activity_work_in_progress_thematic_focus wipTf
    USING activity_work_in_progress wip
WHERE wipTf.activity_work_in_progress_id = wip.id
  and wip.activity_type = 'PARTICIPATION_PROCESS';

DELETE
FROM activity_work_in_progress wip
WHERE wip.activity_type = 'PARTICIPATION_PROCESS';

ALTER TABLE marketplace
    drop column old_activity_id;

--- next type Offer
-- FUNDING_PROGRAM --> OFFER (FUNDING_PROGRAMMES_AND_GRANTS)

ALTER TABLE marketplace
    ADD COLUMN old_activity_id int8;

INSERT INTO marketplace (created_at, created_by, last_modified_by, modified_at, version, contact_email,
                         contact_firstname, contact_image, contact_lastname, contact_phone, contact_position,
                         description, address_city, address_country, address_name, address_state, address_street,
                         address_street_no, address_supplement, address_zip_code, location_coordinate,
                         location_online, marketplace_type, name, offer_category, best_practise_category,
                         location_url, image_path, organisation_id, old_activity_id)
SELECT created_at,
       created_by,
       last_modified_by,
       modified_at,
       version,
       contact_email,
       contact_firstname,
       contact_image,
       contact_lastname,
       contact_phone,
       contact_position,
       description,
       address_city,
       address_country,
       address_name,
       address_state,
       address_street,
       address_street_no,
       address_supplement,
       address_zip_code,
       location_coordinate,
       location_online,
       'OFFER',
       name,
       'FUNDING_PROGRAMMES_AND_GRANTS',
       null,
       location_url,
       image_path,
       organisation_id,
       a.id
FROM activity a
WHERE a.activity_type = 'FUNDING_PROGRAM';

INSERT INTO marketplace_thematic_focus (marketplace_item_id, thematic_focus)
SELECT mp.id, tf.thematic_focus
FROM marketplace as mp
         join activity_thematic_focus as tf on mp.old_activity_id = tf.activity_id
where mp.old_activity_id is not null;

-- delete all entries related to the activities
DELETE
FROM contact_invite contact
    USING activity a
WHERE a.id = contact.activity_id
  and a.activity_type = 'FUNDING_PROGRAM';

DELETE
FROM activity_social_media_contact social
    USING activity a
WHERE a.id = social.activity_id
  and a.activity_type = 'FUNDING_PROGRAM';

DELETE
FROM activity_subscription sub
    USING activity a
WHERE a.id = sub.activity_id
  and a.activity_type = 'FUNDING_PROGRAM';

DELETE
FROM activity_sustainable_development_goals sdg
    USING activity a
WHERE a.id = sdg.activity_id
  and a.activity_type = 'FUNDING_PROGRAM';

DELETE
FROM activity_thematic_focus foc
    USING activity a
WHERE a.id = foc.activity_id
  and a.activity_type = 'FUNDING_PROGRAM';

DELETE
FROM activity_work_in_progress_social_media_contact wipSocial
    USING activity a, activity_work_in_progress wip
WHERE a.id = wip.activity_id
  and wipSocial.activity_work_in_progress_id = wip.id
  and a.activity_type = 'FUNDING_PROGRAM';

DELETE
FROM activity_work_in_progress_sustainable_development_goals wipSdg
    USING activity a, activity_work_in_progress wip
WHERE a.id = wip.activity_id
  and wipSdg.activity_work_in_progress_id = wip.id
  and a.activity_type = 'FUNDING_PROGRAM';

DELETE
FROM activity_work_in_progress_thematic_focus wipTf
    USING activity a, activity_work_in_progress wip
WHERE a.id = wip.activity_id
  and wipTf.activity_work_in_progress_id = wip.id
  and a.activity_type = 'FUNDING_PROGRAM';

DELETE
FROM activity_work_in_progress wip
    USING activity a
WHERE a.id = wip.activity_id
  and a.activity_type = 'FUNDING_PROGRAM';

DELETE
FROM activity a
WHERE a.activity_type = 'FUNDING_PROGRAM';

-- delete all work in progress with activity type
DELETE
FROM activity_work_in_progress_social_media_contact wipSocial
    USING activity_work_in_progress wip
WHERE wipSocial.activity_work_in_progress_id = wip.id
  and wip.activity_type = 'FUNDING_PROGRAM';

DELETE
FROM activity_work_in_progress_sustainable_development_goals wipSdg
    USING activity_work_in_progress wip
WHERE wipSdg.activity_work_in_progress_id = wip.id
  and wip.activity_type = 'FUNDING_PROGRAM';

DELETE
FROM activity_work_in_progress_thematic_focus wipTf
    USING activity_work_in_progress wip
WHERE wipTf.activity_work_in_progress_id = wip.id
  and wip.activity_type = 'FUNDING_PROGRAM';

DELETE
FROM activity_work_in_progress wip
WHERE wip.activity_type = 'FUNDING_PROGRAM';

ALTER TABLE marketplace
    drop column old_activity_id;

--- next type  Best Practise
-- PROJECT_PROGRESS --> BEST_PRACTISE (PROJECT_REPORT)

ALTER TABLE marketplace
    ADD COLUMN old_activity_id int8;

INSERT INTO marketplace (created_at, created_by, last_modified_by, modified_at, version, contact_email,
                         contact_firstname, contact_image, contact_lastname, contact_phone, contact_position,
                         description, address_city, address_country, address_name, address_state, address_street,
                         address_street_no, address_supplement, address_zip_code, location_coordinate,
                         location_online, marketplace_type, name, offer_category, best_practise_category,
                         location_url, image_path, organisation_id, old_activity_id)
SELECT created_at,
       created_by,
       last_modified_by,
       modified_at,
       version,
       contact_email,
       contact_firstname,
       contact_image,
       contact_lastname,
       contact_phone,
       contact_position,
       description,
       address_city,
       address_country,
       address_name,
       address_state,
       address_street,
       address_street_no,
       address_supplement,
       address_zip_code,
       location_coordinate,
       location_online,
       'BEST_PRACTISE',
       name,
       null,
       'PROJECT_REPORT',
       location_url,
       image_path,
       organisation_id,
       a.id
FROM activity a
WHERE a.activity_type = 'PROJECT_PROGRESS';

INSERT INTO marketplace_thematic_focus (marketplace_item_id, thematic_focus)
SELECT mp.id, tf.thematic_focus
FROM marketplace as mp
         join activity_thematic_focus as tf on mp.old_activity_id = tf.activity_id
where mp.old_activity_id is not null;

-- delete all entries related to the activities
DELETE
FROM contact_invite contact
    USING activity a
WHERE a.id = contact.activity_id
  and a.activity_type = 'PROJECT_PROGRESS';

DELETE
FROM activity_social_media_contact social
    USING activity a
WHERE a.id = social.activity_id
  and a.activity_type = 'PROJECT_PROGRESS';

DELETE
FROM activity_subscription sub
    USING activity a
WHERE a.id = sub.activity_id
  and a.activity_type = 'PROJECT_PROGRESS';

DELETE
FROM activity_sustainable_development_goals sdg
    USING activity a
WHERE a.id = sdg.activity_id
  and a.activity_type = 'PROJECT_PROGRESS';

DELETE
FROM activity_thematic_focus foc
    USING activity a
WHERE a.id = foc.activity_id
  and a.activity_type = 'PROJECT_PROGRESS';

DELETE
FROM activity_work_in_progress_social_media_contact wipSocial
    USING activity a, activity_work_in_progress wip
WHERE a.id = wip.activity_id
  and wipSocial.activity_work_in_progress_id = wip.id
  and a.activity_type = 'PROJECT_PROGRESS';

DELETE
FROM activity_work_in_progress_sustainable_development_goals wipSdg
    USING activity a, activity_work_in_progress wip
WHERE a.id = wip.activity_id
  and wipSdg.activity_work_in_progress_id = wip.id
  and a.activity_type = 'PROJECT_PROGRESS';

DELETE
FROM activity_work_in_progress_thematic_focus wipTf
    USING activity a, activity_work_in_progress wip
WHERE a.id = wip.activity_id
  and wipTf.activity_work_in_progress_id = wip.id
  and a.activity_type = 'PROJECT_PROGRESS';

DELETE
FROM activity_work_in_progress wip
    USING activity a
WHERE a.id = wip.activity_id
  and a.activity_type = 'PROJECT_PROGRESS';

DELETE
FROM activity a
WHERE a.activity_type = 'PROJECT_PROGRESS';

-- delete all work in progress with activity type
DELETE
FROM activity_work_in_progress_social_media_contact wipSocial
    USING activity_work_in_progress wip
WHERE wipSocial.activity_work_in_progress_id = wip.id
  and wip.activity_type = 'PROJECT_PROGRESS';

DELETE
FROM activity_work_in_progress_sustainable_development_goals wipSdg
    USING activity_work_in_progress wip
WHERE wipSdg.activity_work_in_progress_id = wip.id
  and wip.activity_type = 'PROJECT_PROGRESS';

DELETE
FROM activity_work_in_progress_thematic_focus wipTf
    USING activity_work_in_progress wip
WHERE wipTf.activity_work_in_progress_id = wip.id
  and wip.activity_type = 'PROJECT_PROGRESS';

DELETE
FROM activity_work_in_progress wip
WHERE wip.activity_type = 'PROJECT_PROGRESS';

ALTER TABLE marketplace
    drop column old_activity_id;


-- delete all work in progress with activity type that my be left over from migration (0041)
-- EDUCATIONAL_OFFER
DELETE
FROM activity_work_in_progress_social_media_contact wipSocial
    USING activity_work_in_progress wip
WHERE wipSocial.activity_work_in_progress_id = wip.id
  and wip.activity_type = 'EDUCATIONAL_OFFER';

DELETE
FROM activity_work_in_progress_sustainable_development_goals wipSdg
    USING activity_work_in_progress wip
WHERE wipSdg.activity_work_in_progress_id = wip.id
  and wip.activity_type = 'EDUCATIONAL_OFFER';

DELETE
FROM activity_work_in_progress_thematic_focus wipTf
    USING activity_work_in_progress wip
WHERE wipTf.activity_work_in_progress_id = wip.id
  and wip.activity_type = 'EDUCATIONAL_OFFER';

DELETE
FROM activity_work_in_progress wip
WHERE wip.activity_type = 'EDUCATIONAL_OFFER';

-- delete all work in progress with activity type COMPETITION
DELETE
FROM activity_work_in_progress_social_media_contact wipSocial
    USING activity_work_in_progress wip
WHERE wipSocial.activity_work_in_progress_id = wip.id
  and wip.activity_type = 'COMPETITION';

DELETE
FROM activity_work_in_progress_sustainable_development_goals wipSdg
    USING activity_work_in_progress wip
WHERE wipSdg.activity_work_in_progress_id = wip.id
  and wip.activity_type = 'COMPETITION';

DELETE
FROM activity_work_in_progress_thematic_focus wipTf
    USING activity_work_in_progress wip
WHERE wipTf.activity_work_in_progress_id = wip.id
  and wip.activity_type = 'COMPETITION';

DELETE
FROM activity_work_in_progress wip
WHERE wip.activity_type = 'COMPETITION';

-- delete all work in progress with activity type NEWS_COVERAGE
DELETE
FROM activity_work_in_progress_social_media_contact wipSocial
    USING activity_work_in_progress wip
WHERE wipSocial.activity_work_in_progress_id = wip.id
  and wip.activity_type = 'NEWS_COVERAGE';

DELETE
FROM activity_work_in_progress_sustainable_development_goals wipSdg
    USING activity_work_in_progress wip
WHERE wipSdg.activity_work_in_progress_id = wip.id
  and wip.activity_type = 'NEWS_COVERAGE';

DELETE
FROM activity_work_in_progress_thematic_focus wipTf
    USING activity_work_in_progress wip
WHERE wipTf.activity_work_in_progress_id = wip.id
  and wip.activity_type = 'NEWS_COVERAGE';

DELETE
FROM activity_work_in_progress wip
WHERE wip.activity_type = 'NEWS_COVERAGE';

refresh materialized view v_search_result;
