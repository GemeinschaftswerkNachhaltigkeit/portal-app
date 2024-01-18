package com.exxeta.wpgwn.wpgwnapp.organisation.model;

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
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.LinkedHashSet;
import java.util.Set;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportProcess;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.MarketplaceItem;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.OfferWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.AuditableEntityBase;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Contact;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ImpactArea;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Location;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Source;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ThematicFocus;

@Entity
@Table(name = "organisation")
@Getter
@Setter
@ToString
public class Organisation extends AuditableEntityBase {

    @NotBlank
    @Column(name = "name")
    private String name;

    @NotBlank
    @Column(name = "description", columnDefinition = "text")
    private String description;

    @NotNull
    @ElementCollection
    @Column(name = "sustainable_development_goals")
    private Set<@Positive Long> sustainableDevelopmentGoals = new LinkedHashSet<>();

    @NotNull
    @Column(name = "impact_area")
    @Enumerated(EnumType.STRING)
    private ImpactArea impactArea;

    @Valid
    @NotNull
    @Embedded
    private Contact contact;

    @Valid
    @NotNull
    @Embedded
    private Location location;

    @OneToMany(mappedBy = "organisation", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private Set<SocialMediaContact> socialMediaContacts = new LinkedHashSet<>();

    @NotNull
    @Column(name = "organisation_type")
    @Enumerated(EnumType.STRING)
    private OrganisationType organisationType;

    @NotNull
    @Column(name = "thematic_focus")
    @ElementCollection
    @Enumerated(EnumType.STRING)
    private Set<ThematicFocus> thematicFocus = new LinkedHashSet<>();

    @Column(name = "logo_path")
    private String logo;

    @Column(name = "image_path")
    private String image;

    @Column(name = "external_id")
    private String externalId;

    @Column(name = "initiator", nullable = false)
    private Boolean initiator = false;

    @Column(name = "project_sustainability_winner", nullable = false)
    private Boolean projectSustainabilityWinner = false;

    @OneToMany(mappedBy = "organisation", cascade = {CascadeType.PERSIST,
            CascadeType.REMOVE}, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    private Set<Activity> activities = new LinkedHashSet<>();

    @OneToMany(mappedBy = "organisation", cascade = {CascadeType.REMOVE}, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    private Set<MarketplaceItem> marketplaceItems = new LinkedHashSet<>();

    /**
     * Reference for automatic cleanup when organisation gets deleted
     */
    @OneToMany(mappedBy = "organisation", cascade = {CascadeType.REMOVE}, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    private Set<OfferWorkInProgress> offerWip = new LinkedHashSet<>();

    @NotNull
    @Column(name = "privacy_consent")
    private Boolean privacyConsent;

    @NotNull
    @Column(name = "source")
    @Enumerated(EnumType.STRING)
    private Source source;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "import_process_id")
    @ToString.Exclude
    private ImportProcess importProcess;

    @NotBlank
    @Column(name = "keycloak_group_id")
    private String keycloakGroupId;

}
