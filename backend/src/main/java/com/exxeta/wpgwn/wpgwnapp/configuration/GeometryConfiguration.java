package com.exxeta.wpgwn.wpgwnapp.configuration;

import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.io.WKTReader;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GeometryConfiguration {


    @Bean
    GeometryFactory geometryFactory() {
        return new GeometryFactory();
    }

    @Bean
    WKTReader reader(GeometryFactory geometryFactory) {
        return new WKTReader(geometryFactory);
    }
}
