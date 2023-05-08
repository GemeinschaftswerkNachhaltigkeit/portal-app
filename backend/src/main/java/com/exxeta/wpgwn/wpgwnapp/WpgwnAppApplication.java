package com.exxeta.wpgwn.wpgwnapp;

import javax.annotation.PostConstruct;
import java.time.ZoneId;
import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ConfigurationPropertiesScan
@EnableScheduling
@EnableFeignClients
public class WpgwnAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(WpgwnAppApplication.class, args);
    }

    public static final String DEFAULT_TIME_ZONE = "Europe/Berlin";

    public static final ZoneId DEFAULT_ZONE_ID = ZoneId.of(DEFAULT_TIME_ZONE);

    @PostConstruct
    public void setDefaultParam() {
        TimeZone.setDefault(TimeZone.getTimeZone(DEFAULT_TIME_ZONE));
    }

}
