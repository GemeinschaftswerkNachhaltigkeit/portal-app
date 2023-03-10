package com.exxeta.wpgwn.wpgwnapp.shared.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;

import org.springframework.util.StringUtils;

@Embeddable
@Getter
@Setter
public class Contact {

    @NotBlank
    @Column(name = "contact_lastname", nullable = false)
    private String lastName;

    @NotBlank
    @Column(name = "contact_firstname", nullable = false)
    private String firstName;

    @Column(name = "contact_position")
    private String position;

    @NotBlank
    @Email
    @Column(name = "contact_email", nullable = false)
    private String email;

    @Column(name = "contact_phone")
    private String phone;

    @Column(name = "contact_image")
    private String image;

    public boolean isEmpty() {
        return !StringUtils.hasText(lastName)
                && !StringUtils.hasText(firstName)
                && !StringUtils.hasText(position)
                && !StringUtils.hasText(email)
                && !StringUtils.hasText(phone)
                && !StringUtils.hasText(image);
    }

}
