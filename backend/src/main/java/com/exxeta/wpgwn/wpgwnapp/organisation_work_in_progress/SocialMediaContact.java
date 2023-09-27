package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.util.Objects;

import org.hibernate.Hibernate;
import org.springframework.util.StringUtils;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.exxeta.wpgwn.wpgwnapp.shared.model.AuditableEntityBase;
import com.exxeta.wpgwn.wpgwnapp.shared.model.SocialMediaType;

/**
 * Entity, die Social Media Einträge für Organisation in Progress speichert.
 */
@Entity(name = "OrganisationWorkInProgressSocialMediaContact")
@Table(name = "organisation_work_in_progress_social_media_contact")
@Getter
@Setter
@NoArgsConstructor
public class SocialMediaContact extends AuditableEntityBase {

    @Enumerated(EnumType.STRING)
    private SocialMediaType type;

    private String contact;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organisation_work_in_progress_id")
    private OrganisationWorkInProgress organisationWorkInProgress;

    public SocialMediaContact(SocialMediaType type, String contact) {
        this.type = type;
        this.contact = contact;
    }

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

    public boolean isEmpty() {
        return Objects.isNull(type) && !StringUtils.hasText(contact);
    }
}
