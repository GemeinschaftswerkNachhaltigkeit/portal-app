DROP MATERIALIZED VIEW IF EXISTS public.v_map_search_v2_result;

CREATE MATERIALIZED VIEW IF NOT EXISTS v_map_search_v2_result
AS
SELECT search_res.cluster_number,
       search_res.id,
       search_res.result_type,
       search_res.name,
       search_res.description,
       search_res.name_description_tsvec,
       search_res.organisation_id,
       search_res.activity_id,
       search_res.organisation_type,
       search_res.activity_type,
       search_res.created_at,
       search_res.modified_at,
       search_res.initiator,
       search_res.project_sustainability_winner,
       search_res.impact_area,
       search_res.location_coordinate,
       search_res.location_url,
       search_res.location_online,
       search_res.private_location,
       search_res.period_start,
       search_res.period_end,
       search_res.address_name,
       search_res.address_street,
       search_res.address_street_no,
       search_res.address_supplement,
       search_res.address_zip_code,
       search_res.address_city,
       search_res.address_state,
       search_res.address_country,
       search_res.thematic_focus,
       search_res.sustainable_development_goals,
       search_res.contact_lastname,
       search_res.contact_firstname,
       search_res.contact_position
FROM ( SELECT floor(((row_number() OVER (ORDER BY o1.modified_at DESC, o1.created_at DESC) - 1) / 2)::double precision) * 3::double precision AS cluster_number,
            concat('ORG_', o1.id) AS id,
            'ORGANISATION'::text AS result_type,
            o1.name,
            o1.description,
            setweight(to_tsvector('german'::regconfig, o1.name::text), 'A'::"char")
			|| setweight(to_tsvector('german'::regconfig, o1.description), 'B'::"char")
			|| setweight(to_tsvector('german'::regconfig, coalesce(o1.address_street, '')), 'C'::"char")
			|| setweight(to_tsvector('german'::regconfig, coalesce(o1.address_city, '')), 'C'::"char")
			|| setweight(to_tsvector('german'::regconfig, coalesce(o1.address_state, '')), 'C'::"char")
			|| setweight(to_tsvector('german'::regconfig, coalesce(o1.address_zip_code, '')), 'C'::"char")
			|| setweight(to_tsvector('german'::regconfig, coalesce(o1.address_country, '')), 'C'::"char") AS  name_description_tsvec,
            o1.id AS organisation_id,
            NULL::bigint AS activity_id,
            o1.organisation_type,
            NULL::character varying AS activity_type,
            o1.created_at,
            o1.modified_at,
            o1.initiator,
            o1.project_sustainability_winner,
            o1.impact_area,
            o1.location_coordinate,
            o1.location_url,
            o1.location_online,
            o1.private_location,
            NULL::timestamp without time zone AS period_start,
            NULL::timestamp without time zone AS period_end,
            o1.address_name,
            o1.address_street,
            o1.address_street_no,
            o1.address_supplement,
            o1.address_zip_code,
            o1.address_city,
            o1.address_state,
            o1.address_country,
            string_agg(DISTINCT otf.thematic_focus::text, ','::text) AS thematic_focus,
            string_agg(DISTINCT to_char(osdg.sustainable_development_goals, 'fm00'::text), ','::text) AS sustainable_development_goals,
            o1.contact_lastname,
            o1.contact_firstname,
            o1.contact_position
       FROM organisation o1
           LEFT JOIN organisation_thematic_focus otf ON o1.id = otf.organisation_id
           LEFT JOIN organisation_sustainable_development_goals osdg ON o1.id = osdg.organisation_id
       WHERE o1.id <> 0
       GROUP BY o1.id
       UNION ALL
       SELECT floor(((row_number() OVER (ORDER BY a1.modified_at DESC, a1.created_at DESC) - 1) / 2)::double precision) * 3::double precision + 1::double precision AS cluster_number,
           concat('ACT_', a1.id) AS id,
           'ACTIVITY'::text AS result_type,
           a1.name,
           a1.description,
           setweight(to_tsvector('german'::regconfig, a1.name::text), 'A'::"char")
           || setweight(to_tsvector('german'::regconfig, a1.description), 'B'::"char")
           || setweight(to_tsvector('german'::regconfig, coalesce(a1.address_street, '')), 'C'::"char")
           || setweight(to_tsvector('german'::regconfig, coalesce(a1.address_city, '')), 'C'::"char")
           || setweight(to_tsvector('german'::regconfig, coalesce(a1.address_state, '')), 'C'::"char")
           || setweight(to_tsvector('german'::regconfig, coalesce(a1.address_zip_code, '')), 'C'::"char")
           || setweight(to_tsvector('german'::regconfig, coalesce(a1.address_country, '')), 'C'::"char") AS  name_description_tsvec,
           NULL::bigint AS organisation_id,
           a1.id AS activity_id,
           NULL::character varying AS organisation_type,
           a1.activity_type,
           a1.created_at,
           a1.modified_at,
           NULL::boolean AS initiator,
           NULL::boolean AS project_sustainability_winner,
           a1.impact_area,
           COALESCE(a1.location_coordinate, organisation.location_coordinate) AS location_coordinate,
           a1.location_url,
           a1.location_online,
           a1.private_location,
           a1.period_start,
           a1.period_end,
           a1.address_name,
           a1.address_street,
           a1.address_street_no,
           a1.address_supplement,
           a1.address_zip_code,
           a1.address_city,
           a1.address_state,
           a1.address_country,
           string_agg(DISTINCT atf.thematic_focus::text, ','::text) AS thematic_focus,
           string_agg(DISTINCT to_char(asdg.sustainable_development_goals, 'fm00'::text), ','::text) AS sustainable_development_goals,
           a1.contact_lastname,
           a1.contact_firstname,
           a1.contact_position
       FROM activity a1
           LEFT JOIN activity_thematic_focus atf ON a1.id = atf.activity_id
           LEFT JOIN activity_sustainable_development_goals asdg ON a1.id = asdg.activity_id
           LEFT JOIN organisation ON a1.organisation_id = organisation.id
       WHERE a1.activity_type::text <> 'DAN'::text
       GROUP BY a1.id, organisation.location_coordinate
       UNION ALL
       SELECT floor(((row_number() OVER (ORDER BY a1.modified_at DESC, a1.created_at DESC) - 1) / 2)::double precision) * 3::double precision + 2::double precision AS cluster_number,
           concat('DAN_', a1.id) AS id,
           'DAN'::text AS result_type,
           a1.name,
           a1.description,
           setweight(to_tsvector('german'::regconfig, a1.name::text), 'A'::"char")
           || setweight(to_tsvector('german'::regconfig, a1.description), 'B'::"char")
           || setweight(to_tsvector('german'::regconfig, coalesce(a1.address_street, '')), 'C'::"char")
           || setweight(to_tsvector('german'::regconfig, coalesce(a1.address_city, '')), 'C'::"char")
           || setweight(to_tsvector('german'::regconfig, coalesce(a1.address_state, '')), 'C'::"char")
           || setweight(to_tsvector('german'::regconfig, coalesce(a1.address_zip_code, '')), 'C'::"char")
           || setweight(to_tsvector('german'::regconfig, coalesce(a1.address_country, '')), 'C'::"char") AS  name_description_tsvec,
           NULL::bigint AS organisation_id,
           a1.id AS activity_id,
           NULL::character varying AS organisation_type,
           a1.activity_type,
           a1.created_at,
           a1.modified_at,
           NULL::boolean AS initiator,
           NULL::boolean AS project_sustainability_winner,
           a1.impact_area,
           COALESCE(a1.location_coordinate, organisation.location_coordinate) AS location_coordinate,
           a1.location_url,
           a1.location_online,
           a1.private_location,
           a1.period_start,
           a1.period_end,
           a1.address_name,
           a1.address_street,
           a1.address_street_no,
           a1.address_supplement,
           a1.address_zip_code,
           a1.address_city,
           a1.address_state,
           a1.address_country,
           string_agg(DISTINCT atf.thematic_focus::text, ','::text) AS thematic_focus,
           string_agg(DISTINCT to_char(asdg.sustainable_development_goals, 'fm00'::text), ','::text) AS sustainable_development_goals,
           a1.contact_lastname,
           a1.contact_firstname,
           a1.contact_position
       FROM activity a1
           LEFT JOIN activity_thematic_focus atf ON a1.id = atf.activity_id
           LEFT JOIN activity_sustainable_development_goals asdg ON a1.id = asdg.activity_id
           LEFT JOIN organisation ON a1.organisation_id = organisation.id
       WHERE a1.activity_type::text = 'DAN'::text
       GROUP BY a1.id, organisation.location_coordinate) search_res
ORDER BY search_res.cluster_number, search_res.modified_at DESC, search_res.created_at DESC;

refresh materialized view v_map_search_v2_result;

DROP INDEX IF EXISTS public.idx_map_search_v2;

CREATE INDEX IF NOT EXISTS idx_map_search_v2 ON v_map_search_v2_result USING gin(name_description_tsvec);


