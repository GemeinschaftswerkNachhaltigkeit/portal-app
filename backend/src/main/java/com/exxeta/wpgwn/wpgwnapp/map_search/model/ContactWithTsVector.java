package com.exxeta.wpgwn.wpgwnapp.map_search.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class ContactWithTsVector {

    @Column(name = "contact_lastname")
    private String lastName;

    @Column(name = "contact_lastname_tsvec", nullable = false, columnDefinition = "tsvector")
    private String lastNameTsVec;

    @Column(name = "contact_firstname")
    private String firstName;

    @Column(name = "contact_firstname_tsvec", nullable = false, columnDefinition = "tsvector")
    private String firstNameTsVec;

    @Column(name = "contact_position")
    private String position;

    @Column(name = "contact_position_tsvec", nullable = false, columnDefinition = "tsvector")
    private String positionTsVec;

}
