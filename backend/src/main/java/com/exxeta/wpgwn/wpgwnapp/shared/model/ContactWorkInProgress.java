package com.exxeta.wpgwn.wpgwnapp.shared.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;

import lombok.Getter;
import lombok.Setter;
import org.springframework.util.StringUtils;

@Embeddable
@Getter
@Setter
public class ContactWorkInProgress {

    @Column(name = "contact_lastname")
    private String lastName;

    @Column(name = "contact_firstname")
    private String firstName;

    @Column(name = "contact_position")
    private String position;

    @Column(name = "contact_email")
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
