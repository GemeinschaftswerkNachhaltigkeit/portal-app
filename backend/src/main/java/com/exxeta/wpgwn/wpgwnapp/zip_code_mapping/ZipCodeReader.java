package com.exxeta.wpgwn.wpgwnapp.zip_code_mapping;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;

/**
 * Komponente zum Lesen von CSV für Postleitzahleninformationen. Quelle: <a href="https://www.suche-postleitzahl.org/downloads">CSV Download</a> (zuordnung_plz_ort, csv)
 */
@Component
@RequiredArgsConstructor
public class ZipCodeReader {

    private final CsvMapper csvMapper;

    Map<String, ZipCode> readValues(Resource csvFile) throws IOException {

        final CsvSchema headerSchema = CsvSchema.emptySchema().withHeader();

        final MappingIterator<ZipCode> valuesAsList = csvMapper.readerWithSchemaFor(ZipCode.class)
                .with(headerSchema)
                .readValues(csvFile.getInputStream());

        final Map<String, ZipCode> result = new HashMap<>();
        while (valuesAsList.hasNext()) {
            final ZipCode zipCode = valuesAsList.next();

            result.put(zipCode.getZipCode(), zipCode);
        }

        return Collections.unmodifiableMap(result);
    }

}
