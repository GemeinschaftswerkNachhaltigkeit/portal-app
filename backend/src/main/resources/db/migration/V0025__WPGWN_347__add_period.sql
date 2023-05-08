DROP VIEW v_search_result;
CREATE VIEW v_search_result AS
SELECT *
FROM (SELECT FLOOR((ROW_NUMBER() OVER(ORDER BY o1.id)-1)/2)*2 AS cluster_number, 'ORGANISATION' AS result_type,
             o1.name, o1.description, o1.id AS organisation_id, NULL AS activity_id, o1.organisation_type,  NULL as activity_type,
             o1.impact_area, o1.location_coordinate, o1.location_url, o1.location_online,
             NULL AS period_start, NULL AS period_end,
             o1.address_street, o1.address_street_no, o1.address_zip_code, o1.address_city, o1.address_state, o1.address_country,
             STRING_AGG (otf.thematic_focus, ', ') thematic_focus,
             STRING_AGG (osdg.sustainable_development_goals::varchar, ', ') sustainable_development_goals
      FROM organisation o1
               LEFT JOIN organisation_thematic_focus otf ON o1.id = otf.organisation_id
               LEFT JOIN organisation_sustainable_development_goals osdg ON o1.id = osdg.organisation_id
      GROUP BY o1.id
      UNION ALL
      SELECT (FLOOR((ROW_NUMBER() OVER(ORDER BY a1.id)-1)/2)*2)+1 AS cluster_number, 'ACTIVITY' AS result_type,
             a1.name, a1.description, NULL AS organisation_id, a1.id AS activity_id, NULL as organisation_type,  a1.activity_type,
             a1.impact_area, a1.location_coordinate, a1.location_url, a1.location_online,
             a1.period_start, a1.period_end,
             a1.address_street, a1.address_street_no, a1.address_zip_code, a1.address_city, a1.address_state, a1.address_country,
             STRING_AGG (atf.thematic_focus, ', ') thematic_focus,
             STRING_AGG (asdg.sustainable_development_goals::varchar, ', ') sustainable_development_goals
      FROM activity a1
               LEFT JOIN activity_thematic_focus atf ON a1.id = atf.activity_id
               LEFT JOIN activity_sustainable_development_goals asdg ON a1.id = asdg.activity_id
      GROUP BY a1.id
     ) AS SEARCH_RES
ORDER BY cluster_number, organisation_id, activity_id
