package com.exxeta.wpgwn.wpgwnapp.shared.dto;

import org.hibernate.validator.constraints.Length;

import lombok.Data;

@Data
@SuppressWarnings("MagicNumber")
public class AddressDto {

    @Length(max = 200)
    private String name;

    @Length(max = 200)
    private String street;

    @Length(max = 40)
    private String streetNo;

    @Length(max = 255)
    private String supplement;

    @Length(max = 6)
    private String zipCode;

    @Length(max = 200)
    private String city;

    @Length(max = 200)
    private String state;

    @Length(max = 200)
    private String country;
}
