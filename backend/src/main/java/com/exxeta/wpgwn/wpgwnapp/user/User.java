package com.exxeta.wpgwn.wpgwnapp.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
@ValidateUser
public class User {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    private Long organisationId;

    private Long organisationWorkInProgressId;

}
