package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import org.hibernate.Hibernate;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.duplicate_check.model.DuplicateList;
import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportProcess;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.shared.IWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.AuditableEntityBase;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ContactWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ImpactArea;
import com.exxeta.wpgwn.wpgwnapp.shared.model.LocationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationStatus;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Source;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ThematicFocus;

@Entity
@Table(name = "organisation_work_in_progress")
@Getter
@Setter
@ToString
public class OrganisationWorkInProgress extends AuditableEntityBase implements IWorkInProgress {

    @Column(name = "name")
    private String name;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    /**
     * Nur bei Änderungen: die Organisation, die geändert werden soll. Die Daten werden die gespeichert,
     * bis sie vom Clearing Prozess freigegeben werden.
     */
    @OneToOne
    @JoinColumn(name = "organisation_id")
    private Organisation organisation;

    @ElementCollection
    @Column(name = "sustainable_development_goals")
    private Set<@NotNull Long> sustainableDevelopmentGoals = new LinkedHashSet<>();

    @Column(name = "impact_area")
    @Enumerated(EnumType.STRING)
    private ImpactArea impactArea;

    @OneToOne(mappedBy = "organisationWorkInProgress")
    private DuplicateList duplicateList;

    @Embedded
    private ContactWorkInProgress contactWorkInProgress;

    @Embedded
    private LocationWorkInProgress locationWorkInProgress;

    @OneToMany(mappedBy = "organisationWorkInProgress", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private Set<@NotNull SocialMediaContact> socialMediaContacts = new LinkedHashSet<>();

    @Column(name = "organisation_type")
    @Enumerated(EnumType.STRING)
    private OrganisationType organisationType;

    @Column(name = "thematic_focus")
    @Enumerated(EnumType.STRING)
    @ElementCollection
    private Set<@NotNull ThematicFocus> thematicFocus = new LinkedHashSet<>();

    @Column(name = "logo_path")
    private String logo;

    @Column(name = "image_path")
    private String image;

    @Column(name = "external_id")
    private String externalId;

    @OneToMany(mappedBy = "organisationWorkInProgress", cascade = {CascadeType.PERSIST})
    @ToString.Exclude
    private Set<@NotNull ActivityWorkInProgress> activitiesWorkInProgress = new LinkedHashSet<>();

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private OrganisationStatus status;

    @Column(name = "approved_until")
    private LocalDate approvedUntil;

    /**
     * Eine zufällige eindeutige ID die es erlaubt den Eintrag zu modifizieren. Die ID wird mit einem Link versendet.
     */
    @Column(name = "random_unique_id", unique = true, nullable = false)
    private UUID randomUniqueId;

    /**
     * Generierungszeit für die {@link #randomUniqueId} um das Ablaufdatum zu ermitteln.
     */
    @Column(name = "random_unique_id_generation_time")
    private Instant randomIdGenerationTime;

    @Column(name = "privacy_consent")
    private Boolean privacyConsent;

    @Column(name = "source")
    @Enumerated(EnumType.STRING)
    private Source source;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "import_process_id")
    @ToString.Exclude
    private ImportProcess importProcess;

    @Column(name = "keycloak_group_id")
    private String keycloakGroupId;

    /**
     * Speichert die Daten, wenn eine E-Mail mit der Aufforderung zum Aktualisieren der Daten gesendet wurde.
     */
    @ElementCollection
    @Column(name = "email_notification_date")
    @CollectionTable(name = "organisation_work_in_progress_email_notification_dates", joinColumns = @JoinColumn(name = "owner_id"))
    private Set<@NotNull Instant> emailNotificationDates = new LinkedHashSet<>();

    @Column(name = "feedback", columnDefinition = "text")
    private String feedbackRequest;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "organisationWorkInProgress", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("feedbackRequestSent desc")
    @ToString.Exclude
    private List<@NotNull FeedbackHistoryEntry> feedbackRequestList = new ArrayList<>();

    @Column(name = "feedback_sent_at")
    private Instant feedbackRequestSent;

    @Column(name = "rejection_reason", columnDefinition = "text")
    private String rejectionReason;

    public boolean isEmpty() {
        return !StringUtils.hasText(name)
                && !StringUtils.hasText(description)
                && Objects.isNull(organisationType)
                && CollectionUtils.isEmpty(sustainableDevelopmentGoals)
                && Objects.isNull(impactArea)
                && contactWorkInProgress.isEmpty()
                && locationWorkInProgress.isEmpty()
                && CollectionUtils.isEmpty(socialMediaContacts)
                && CollectionUtils.isEmpty(thematicFocus)
                && !StringUtils.hasText(logo)
                && !StringUtils.hasText(image)
                && !StringUtils.hasText(externalId)
                && Objects.isNull(status);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) {
            return false;
        }
        OrganisationWorkInProgress that = (OrganisationWorkInProgress) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
