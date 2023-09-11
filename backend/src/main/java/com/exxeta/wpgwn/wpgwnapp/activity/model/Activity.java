package com.exxeta.wpgwn.wpgwnapp.activity.model;

import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportProcess;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.shared.model.*;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import org.hibernate.validator.constraints.URL;

import javax.persistence.*;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "activity")
@Getter
@Setter
@ToString
public class Activity extends AuditableEntityBase {

    /**
     * Referenz zur Organisation für diese Aktivität.
     */
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organisation_id")
    @ToString.Exclude
    private Organisation organisation;

    @NotBlank
    @Column(name = "name", nullable = false)
    private String name;

    @NotBlank
    @Column(name = "description", columnDefinition = "text", nullable = false)
    private String description;

    @NotNull
    @Column(name = "thematic_focus")
    @Enumerated(EnumType.STRING)
    @ElementCollection
    private Set<@NotNull ThematicFocus> thematicFocus = new LinkedHashSet<>();

    @Valid
    @ElementCollection
    @Column(name = "sustainable_development_goals")
    private Set<@Positive Long> sustainableDevelopmentGoals = new LinkedHashSet<>();

    @Column(name = "impact_area")
    @Enumerated(EnumType.STRING)
    private ImpactArea impactArea;

    @Column(name = "activity_type")
    @Enumerated(EnumType.STRING)
    private ActivityType activityType;

    @Embedded
    @Valid
    @NotNull
    private Contact contact;

    @Embedded
    @Valid
    @NotNull
    private Location location;

    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private Set<@Valid @NotNull SocialMediaContact> socialMediaContacts = new LinkedHashSet<>();

    @Embedded
    private Period period;

    @Column(name = "logo_path")
    private String logo;

    @Column(name = "image_path")
    private String image;

    @Column(name = "source")
    private Source source;

    @Column(name = "external_id")
    private String externalId;

    @URL
    @Column(name = "register_url")
    private String registerUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "import_process_id")
    @ToString.Exclude
    private ImportProcess importProcess;

    @Column(name = "approved_until")
    private LocalDate approvedUntil;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private ItemStatus status;

}
