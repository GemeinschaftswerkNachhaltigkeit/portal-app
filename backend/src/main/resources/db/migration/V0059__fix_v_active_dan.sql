CREATE OR REPLACE VIEW v_active_dan
            (name, organisation_name, organisation_type, contact_email, contact_firstname, contact_image,
            contact_lastname, contact_phone, contact_position, description, impact_area, address_city, address_country,
            address_state, address_street, address_street_no, address_zip_code, period_start, period_end,
            location_coordinate, location_url, location_online, activity_type, image_path, logo_path, status,
            address_supplement, address_name, private_location, source, sustainable_development_goals)
AS
SELECT act.name,
       org.name AS organisation_name,
       org.organisation_type,
       act.contact_email,
       act.contact_firstname,
       act.contact_image,
       act.contact_lastname,
       act.contact_phone,
       act.contact_position,
       act.description,
       act.impact_area,
       act.address_city,
       act.address_country,
       act.address_state,
       act.address_street,
       act.address_street_no,
       act.address_zip_code,
       act.period_start,
       act.period_end,
       act.location_coordinate,
       act.location_url,
       act.location_online,
       act.activity_type,
       act.image_path,
       act.logo_path,
       act.status,
       act.address_supplement,
       act.address_name,
       act.private_location,
       act.source,
       a_asdg.sustainable_development_goals
FROM activity act
         LEFT JOIN organisation org ON act.organisation_id = org.id
         LEFT JOIN (SELECT asdg.activity_id,
                           string_agg(DISTINCT to_char(asdg.sustainable_development_goals, 'fm00'::text), ','::text) AS sustainable_development_goals
                    FROM activity_sustainable_development_goals asdg
                    GROUP BY asdg.activity_id) a_asdg ON a_asdg.activity_id = act.id
WHERE act.activity_type::text = 'DAN'::text
  AND act.status::text = 'ACTIVE'::text;
