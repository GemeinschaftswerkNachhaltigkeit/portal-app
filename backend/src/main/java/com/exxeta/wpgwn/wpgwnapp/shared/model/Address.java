package com.exxeta.wpgwn.wpgwnapp.shared.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import org.springframework.util.StringUtils;

import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@SuppressWarnings("MagicNumber")
public class Address {

    @Column(name = "address_name")
    private String name;

    @Column(name = "address_street")
    private String street;

    @Column(name = "address_street_no", length = 40)
    private String streetNo;

    @Column(name = "address_supplement")
    private String supplement;

    @SuppressWarnings("MagicNumber")
    @Column(name = "address_zip_code", length = 6)
    private String zipCode;

    @Column(name = "address_city")
    private String city;

    @Column(name = "address_state")
    private String state;

    @Column(name = "address_country")
    private String country;

    public boolean isEmpty() {
        return !StringUtils.hasText(street)
                && !StringUtils.hasText(streetNo)
                && !StringUtils.hasText(zipCode)
                && !StringUtils.hasText(city)
                && !StringUtils.hasText(state)
                && !StringUtils.hasText(country);
    }
}
