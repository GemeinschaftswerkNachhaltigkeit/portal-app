package com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.Objects;

import org.hibernate.Hibernate;
import org.springframework.util.StringUtils;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.exxeta.wpgwn.wpgwnapp.shared.model.AuditableEntityBase;
import com.exxeta.wpgwn.wpgwnapp.shared.model.SocialMediaType;

/**
 * Entity, die Social Media Einträge für Activity in Progress speichert.
 */
@Entity(name = "ActivityWorkInProgressSocialMediaContact")
@Table(name = "activity_work_in_progress_social_media_contact")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SocialMediaContact extends AuditableEntityBase {

    @Enumerated(EnumType.STRING)
    private SocialMediaType type;

    private String contact;

    @ManyToOne
    @JoinColumn(name = "activity_work_in_progress_id")
    private ActivityWorkInProgress activityWorkInProgress;

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
