package com.exxeta.wpgwn.wpgwnapp.building_housing.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@ToString
@SuppressWarnings("MagicNumber")
public class BuildingAndHousingContactFormDto {

    @NotBlank
    @Length(max = 200)
    private String name;

    @Length(max = 200)
    private String organisation;

    @NotBlank
    @Email
    @Length(max = 200)
    private String email;

    @Length(max = 200)
    private String position;

    @NotBlank
    @Length(max = 200)
    private String station;

    @JsonIgnore
    private String stationDescription;

    @JsonIgnore
    private String uniqueHash;

    @AssertTrue
    @NotNull
    private Boolean privacyConsent;

}
