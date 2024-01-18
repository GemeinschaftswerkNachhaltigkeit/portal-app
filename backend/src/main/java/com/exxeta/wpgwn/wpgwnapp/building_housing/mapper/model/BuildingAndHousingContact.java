package com.exxeta.wpgwn.wpgwnapp.building_housing.mapper.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.exxeta.wpgwn.wpgwnapp.shared.model.AuditableEntityBase;

@Entity
@Table(name = "building_and_housing_contact",
        indexes = {@Index(name = "unique_hash_index", columnList = "unique_hash")}
)
@Getter
@Setter
@ToString
public class BuildingAndHousingContact extends AuditableEntityBase {

    @NotBlank
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "organisation")
    private String organisation;

    @NotBlank
    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "position")
    private String position;

    @NotNull
    @Column(name = "station", nullable = false)
    private String station;

    @NotBlank
    @Column(name = "station_description", nullable = false)
    private String stationDescription;

    @NotBlank
    @Column(name = "unique_hash", nullable = false)
    private String uniqueHash;

    @NotNull
    @Column(name = "privacy_consent", nullable = false)
    private Boolean privacyConsent;

}
