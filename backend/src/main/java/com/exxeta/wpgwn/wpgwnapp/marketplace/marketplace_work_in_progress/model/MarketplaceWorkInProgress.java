package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model;

import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.ElementCollection;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.MarketplaceItem;
import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.MarketplaceType;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.shared.model.AuditableEntityBase;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ContactWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.LocationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ThematicFocus;

@Entity
@Getter
@Setter
@Table(name = "marketplace_work_in_progress")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "marketplace_type", discriminatorType = DiscriminatorType.STRING)
public abstract class MarketplaceWorkInProgress extends AuditableEntityBase {

    @Column(name = "marketplace_type", insertable = false, updatable = false)
    @Enumerated(EnumType.STRING)
    private MarketplaceType marketplaceType;

    @ManyToOne
    @JoinColumn(name = "organisation_id")
    private Organisation organisation;

    /**
     * Nur bei Änderungen, das Angebot, das geändert werden soll.
     */
    @OneToOne
    @JoinColumn(name = "marketplace_id")
    private MarketplaceItem marketplaceItem;

    @Column(name = "name")
    private String name;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "thematic_focus")
    @ElementCollection
    @Enumerated(EnumType.STRING)
    private Set<ThematicFocus> thematicFocus = new LinkedHashSet<>();

    @Column(name = "image_path")
    private String image;

    @Embedded
    private ContactWorkInProgress contactWorkInProgress;

    /**
     * Null ist ortsunabhängig.
     */
    @Embedded
    private LocationWorkInProgress locationWorkInProgress;

    /**
     * Eine zufällige eindeutige ID die es erlaubt den Eintrag zu modifizieren. Die ID wird mit einem Link versendet.
     */
    @Column(name = "random_unique_id", unique = true, nullable = false)
    private UUID randomUniqueId;

    /**
     * End Datum für OFFER(Angebot), für BEST_PRACTISE ist nicht relevant
     */
    @Column(name = "end_until")
    private OffsetDateTime endUntil;
    /**
     * Generierungszeit für die {@link #randomUniqueId} um das Ablaufdatum zu ermitteln.
     */
    @Column(name = "random_unique_id_generation_time", nullable = false)
    private Instant randomIdGenerationTime;

    @NotNull
    @Column(name = "featured", nullable = false)
    private Boolean featured = false;

    @Column(name = "featured_text")
    private String featuredText;
}
