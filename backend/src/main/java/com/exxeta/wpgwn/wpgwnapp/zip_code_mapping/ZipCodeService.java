package com.exxeta.wpgwn.wpgwnapp.zip_code_mapping;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

@Service
public class ZipCodeService {

    private final Map<String, ZipCode> zipCodeMapping;

    ZipCodeService(ZipCodeReader zipCodeReader, ResourceLoader resourceLoader) throws IOException {

        this.zipCodeMapping = zipCodeReader.readValues(
                resourceLoader.getResource("classpath:/zip_code_mapping/zuordnung_plz_ort.csv"));
    }

    public Optional<ZipCode> get(String zipCode) {
        return Optional.ofNullable(zipCodeMapping.get(zipCode));
    }

}
