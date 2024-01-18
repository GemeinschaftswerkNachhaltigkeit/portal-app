package com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import org.hibernate.Hibernate;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportProcess;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.IWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.AuditableEntityBase;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ContactWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ImpactArea;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ItemStatus;
import com.exxeta.wpgwn.wpgwnapp.shared.model.LocationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Period;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Source;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ThematicFocus;

@Entity
@Table(name = "activity_work_in_progress")
@Getter
@Setter
@ToString
public class ActivityWorkInProgress extends AuditableEntityBase implements IWorkInProgress {

    /**
     * Nur bei Änderungen, die Aktivität, die geändert werden soll. Die Daten werden die gespeichert,
     * bis sie vom Clearing Prozess freigegeben werden.
     */
    @OneToOne
    @JoinColumn(name = "activity_id")
    private Activity activity;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "organisation_work_in_progress_id")
    @ToString.Exclude
    private OrganisationWorkInProgress organisationWorkInProgress;

    /**
     * Referenz zur Organisation, für diese Aktivität angelegt werden soll.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organisation_id")
    @ToString.Exclude
    private Organisation organisation;

    @Column(name = "name")
    private String name;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "thematic_focus")
    @Enumerated(EnumType.STRING)
    @ElementCollection
    private Set<@NotNull ThematicFocus> thematicFocus = new LinkedHashSet<>();

    @ElementCollection
    @Column(name = "sustainable_development_goals")
    private Set<@NotNull Long> sustainableDevelopmentGoals = new LinkedHashSet<>();

    @Column(name = "impact_area")
    @Enumerated(EnumType.STRING)
    private ImpactArea impactArea;

    @Column(name = "activity_type")
    @Enumerated(EnumType.STRING)
    private ActivityType activityType;

    @Embedded
    private ContactWorkInProgress contactWorkInProgress;

    @Embedded
    private LocationWorkInProgress locationWorkInProgress;

    @OneToMany(mappedBy = "activityWorkInProgress", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private Set<@NotNull SocialMediaContact> socialMediaContacts = new LinkedHashSet<>();

    @Embedded
    private Period period;

    @Column(name = "logo_path")
    private String logo;

    @Column(name = "image_path")
    private String image;

    @Column(name = "source")
    @Enumerated(EnumType.STRING)
    private Source source;

    @Column(name = "external_id")
    private String externalId;

    @Column(name = "register_url")
    private String registerUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "import_process_id")
    @ToString.Exclude
    private ImportProcess importProcess;

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
    @Column(name = "random_unique_id_generation_time", nullable = false)
    private Instant randomIdGenerationTime;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private ItemStatus status;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) {
            return false;
        }
        ActivityWorkInProgress that = (ActivityWorkInProgress) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    public boolean isEmpty() {
        return !StringUtils.hasText(name)
                && !StringUtils.hasText(description)
                && CollectionUtils.isEmpty(thematicFocus)
                && CollectionUtils.isEmpty(sustainableDevelopmentGoals)
                && Objects.isNull(impactArea)
                && Objects.isNull(activityType)
                && (Objects.isNull(locationWorkInProgress) || locationWorkInProgress.isEmpty())
                && (Objects.isNull(contactWorkInProgress) || contactWorkInProgress.isEmpty())
                && CollectionUtils.isEmpty(socialMediaContacts)
                && !StringUtils.hasText(logo)
                && !StringUtils.hasText(image)
                && !StringUtils.hasText(externalId);
    }
}
