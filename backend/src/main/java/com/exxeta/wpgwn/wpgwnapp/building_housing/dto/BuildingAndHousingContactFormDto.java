package com.exxeta.wpgwn.wpgwnapp.building_housing.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
