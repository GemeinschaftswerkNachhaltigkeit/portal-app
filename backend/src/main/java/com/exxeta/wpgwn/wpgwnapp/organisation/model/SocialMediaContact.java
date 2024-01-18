package com.exxeta.wpgwn.wpgwnapp.organisation.model;

import com.exxeta.wpgwn.wpgwnapp.shared.model.AuditableEntityBase;
import com.exxeta.wpgwn.wpgwnapp.shared.model.SocialMediaType;

import lombok.Getter;
import lombok.Setter;

import org.hibernate.Hibernate;

import jakarta.persistence.*;
import java.util.Objects;

/**
 * Entity, die Social Media Einträge für Organisation speichert.
 */
@Entity(name = "OrganisationSocialMediaContact")
@Table(name = "organisation_social_media_contact")
@Getter
@Setter
public class SocialMediaContact extends AuditableEntityBase {

    @Enumerated(EnumType.STRING)
    private SocialMediaType type;

    private String contact;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organisation_id")
    private Organisation organisation;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) {
            return false;
        }
        SocialMediaContact that = (SocialMediaContact) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
