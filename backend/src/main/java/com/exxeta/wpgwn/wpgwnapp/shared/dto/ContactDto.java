package com.exxeta.wpgwn.wpgwnapp.shared.dto;

import jakarta.validation.constraints.Email;
import java.io.Serializable;

import org.hibernate.validator.constraints.Length;

import lombok.Data;

@Data
@SuppressWarnings("MagicNumber")
public class ContactDto implements Serializable {

    @Length(max = 200)
    private String lastName;

    @Length(max = 200)
    private String firstName;

    @Length(max = 200)
    private String position;

    @Length(max = 200)
    @Email
    private String email;

    @Length(max = 200)
    private String phone;

    private String image;

}
