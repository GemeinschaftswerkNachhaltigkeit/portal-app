ALTER TABLE import_dan_xml_queue ADD COLUMN new_column text;

UPDATE import_dan_xml_queue SET new_column = category;

ALTER TABLE import_dan_xml_queue DROP COLUMN category;

ALTER TABLE import_dan_xml_queue RENAME COLUMN new_column TO category;

