package com.exxeta.wpgwn.wpgwnapp.configuration;

import org.locationtech.jts.geom.GeometryFactory;
import org.n52.jackson.datatype.jts.JtsModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;

@Configuration
public class JacksonConfiguration {

    @Bean
    JtsModule jtsModule(GeometryFactory factory) {
        return new JtsModule(factory);
    }

    @Bean
    @Primary
    public ObjectMapper jacksonObjectMapper(Jackson2ObjectMapperBuilder builder) {
        return builder.createXmlMapper(false).build();
    }

    @Bean
    public CsvMapper createCsvMapper() {
        CsvMapper mapper = new CsvMapper();
        mapper.findAndRegisterModules();
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        return mapper;
    }


}
