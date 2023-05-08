INSERT INTO organisation(
    id, created_at, created_by, last_modified_by, modified_at, version, contact_email, contact_firstname, contact_image,
    contact_lastname, contact_phone, contact_position, description, external_id, keycloak_group_id, address_city,
    address_country, address_state, address_street, address_street_no, address_zip_code, location_coordinate,
    location_url, logo_path, name, privacy_consent, location_online, image_path, impact_area, organisation_type,
    source, import_process_id, address_supplement, address_name, initiator, project_sustainability_winner, private_location)
SELECT 0, now(), null, null, now(), 0, 'dan@organistaion.io', 'Dan', null, 'Organisation', null, null, 'DanOrganisation',
       null, 0, null, null, null, null, null, null, null, null, null, 'DanOrganisation', true, null, null,
       'WORLD', 'OTHER', 'IMPORT', null, null, null, false, false, null
    WHERE NOT EXISTS (
     SELECT 1 FROM organisation WHERE id = 0
   );
