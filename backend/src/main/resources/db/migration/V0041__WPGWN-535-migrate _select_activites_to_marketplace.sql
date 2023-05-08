-- offer EDUCATIONAL_OFFERS
-- EDUCATIONAL_OFFER --> EDUCATIONAL_OFFERS
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
       'EDUCATIONAL_OFFERS',
       null,
       location_url,
       image_path,
       organisation_id,
       a.id
FROM activity a
WHERE a.activity_type = 'EDUCATIONAL_OFFER';

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
  and a.activity_type = 'EDUCATIONAL_OFFER';

DELETE
FROM activity_social_media_contact social
    USING activity a
WHERE a.id = social.activity_id
  and a.activity_type = 'EDUCATIONAL_OFFER';

DELETE
FROM activity_subscription sub
    USING activity a
WHERE a.id = sub.activity_id
  and a.activity_type = 'EDUCATIONAL_OFFER';

DELETE
FROM activity_sustainable_development_goals sdg
    USING activity a
WHERE a.id = sdg.activity_id
  and a.activity_type = 'EDUCATIONAL_OFFER';

DELETE
FROM activity_thematic_focus foc
    USING activity a
WHERE a.id = foc.activity_id
  and a.activity_type = 'EDUCATIONAL_OFFER';

DELETE
FROM activity_work_in_progress_social_media_contact wipSocial
    USING activity a, activity_work_in_progress wip
WHERE a.id = wip.activity_id
  and wipSocial.activity_work_in_progress_id = wip.id
  and a.activity_type = 'EDUCATIONAL_OFFER';

DELETE
FROM activity_work_in_progress_sustainable_development_goals wipSdg
    USING activity a, activity_work_in_progress wip
WHERE a.id = wip.activity_id
  and wipSdg.activity_work_in_progress_id = wip.id
  and a.activity_type = 'EDUCATIONAL_OFFER';

DELETE
FROM activity_work_in_progress_thematic_focus wipTf
    USING activity a, activity_work_in_progress wip
WHERE a.id = wip.activity_id
  and wipTf.activity_work_in_progress_id = wip.id
  and a.activity_type = 'EDUCATIONAL_OFFER';

DELETE
FROM activity_work_in_progress wip
    USING activity a
WHERE a.id = wip.activity_id
  and a.activity_type = 'EDUCATIONAL_OFFER';

DELETE
FROM activity a
WHERE a.activity_type = 'EDUCATIONAL_OFFER';

ALTER TABLE marketplace
    drop column old_activity_id;

--- next type Offer
-- COMPETITION --> CONTESTS

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
       'CONTESTS',
       null,
       location_url,
       image_path,
       organisation_id,
       a.id
FROM activity a
WHERE a.activity_type = 'COMPETITION';

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
  and a.activity_type = 'COMPETITION';

DELETE
FROM activity_social_media_contact social
    USING activity a
WHERE a.id = social.activity_id
  and a.activity_type = 'COMPETITION';

DELETE
FROM activity_subscription sub
    USING activity a
WHERE a.id = sub.activity_id
  and a.activity_type = 'COMPETITION';

DELETE
FROM activity_sustainable_development_goals sdg
    USING activity a
WHERE a.id = sdg.activity_id
  and a.activity_type = 'COMPETITION';

DELETE
FROM activity_thematic_focus foc
    USING activity a
WHERE a.id = foc.activity_id
  and a.activity_type = 'COMPETITION';

DELETE
FROM activity_work_in_progress_social_media_contact wipSocial
    USING activity a, activity_work_in_progress wip
WHERE a.id = wip.activity_id
  and wipSocial.activity_work_in_progress_id = wip.id
  and a.activity_type = 'COMPETITION';

DELETE
FROM activity_work_in_progress_sustainable_development_goals wipSdg
    USING activity a, activity_work_in_progress wip
WHERE a.id = wip.activity_id
  and wipSdg.activity_work_in_progress_id = wip.id
  and a.activity_type = 'COMPETITION';

DELETE
FROM activity_work_in_progress_thematic_focus wipTf
    USING activity a, activity_work_in_progress wip
WHERE a.id = wip.activity_id
  and wipTf.activity_work_in_progress_id = wip.id
  and a.activity_type = 'COMPETITION';

DELETE
FROM activity_work_in_progress wip
    USING activity a
WHERE a.id = wip.activity_id
  and a.activity_type = 'COMPETITION';

DELETE
FROM activity a
WHERE a.activity_type = 'COMPETITION';

ALTER TABLE marketplace
    drop column old_activity_id;

--- next type  Best Practise
-- NEWS_COVERAGE --> SUSTAINABILITY_REPORTING

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
       'SUSTAINABILITY_REPORTING',
       location_url,
       image_path,
       organisation_id,
       a.id
FROM activity a
WHERE a.activity_type = 'NEWS_COVERAGE';

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
  and a.activity_type = 'NEWS_COVERAGE';

DELETE
FROM activity_social_media_contact social
    USING activity a
WHERE a.id = social.activity_id
  and a.activity_type = 'NEWS_COVERAGE';

DELETE
FROM activity_subscription sub
    USING activity a
WHERE a.id = sub.activity_id
  and a.activity_type = 'NEWS_COVERAGE';

DELETE
FROM activity_sustainable_development_goals sdg
    USING activity a
WHERE a.id = sdg.activity_id
  and a.activity_type = 'NEWS_COVERAGE';

DELETE
FROM activity_thematic_focus foc
    USING activity a
WHERE a.id = foc.activity_id
  and a.activity_type = 'NEWS_COVERAGE';

DELETE
FROM activity_work_in_progress_social_media_contact wipSocial
    USING activity a, activity_work_in_progress wip
WHERE a.id = wip.activity_id
  and wipSocial.activity_work_in_progress_id = wip.id
  and a.activity_type = 'NEWS_COVERAGE';

DELETE
FROM activity_work_in_progress_sustainable_development_goals wipSdg
    USING activity a, activity_work_in_progress wip
WHERE a.id = wip.activity_id
  and wipSdg.activity_work_in_progress_id = wip.id
  and a.activity_type = 'NEWS_COVERAGE';

DELETE
FROM activity_work_in_progress_thematic_focus wipTf
    USING activity a, activity_work_in_progress wip
WHERE a.id = wip.activity_id
  and wipTf.activity_work_in_progress_id = wip.id
  and a.activity_type = 'NEWS_COVERAGE';

DELETE
FROM activity_work_in_progress wip
    USING activity a
WHERE a.id = wip.activity_id
  and a.activity_type = 'NEWS_COVERAGE';

DELETE
FROM activity a
WHERE a.activity_type = 'NEWS_COVERAGE';

ALTER TABLE marketplace
    drop column old_activity_id;


refresh materialized view v_search_result;
