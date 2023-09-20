package com.exxeta.wpgwn.wpgwnapp.building_housing.configuration;

import javax.validation.Valid;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import lombok.Getter;
import lombok.Setter;

@ConfigurationProperties("building-housing-contact")
@Getter
@Setter
@Validated
public class BuildingAndHousingContactProperties {

    @NotNull
    @Valid
    private Set<@Email String> recipients = new HashSet<>();


}
