package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.Objects;

import org.hibernate.Hibernate;

import lombok.Getter;
import lombok.Setter;

import com.exxeta.wpgwn.wpgwnapp.shared.model.AuditableEntityBase;


@Entity
@Table(name = "organisation_work_in_progress_feedback_history_entry")
@Getter
@Setter
public class FeedbackHistoryEntry extends AuditableEntityBase {

    @ManyToOne
    @JoinColumn(name = "organisation_work_in_progress_id")
    private OrganisationWorkInProgress organisationWorkInProgress;

    @Column(name = "feedback_request", columnDefinition = "text")
    private String feedbackRequest;

    @Column(name = "feedback_request_sent")
    private Instant feedbackRequestSent;


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) {
            return false;
        }
        FeedbackHistoryEntry that = (FeedbackHistoryEntry) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}
