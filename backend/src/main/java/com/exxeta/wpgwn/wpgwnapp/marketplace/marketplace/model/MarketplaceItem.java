package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

import org.springframework.lang.Nullable;

import lombok.Getter;
import lombok.Setter;

import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.MarketplaceType;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.shared.model.AuditableEntityBase;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Contact;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ItemStatus;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Location;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ThematicFocus;

@Entity
@Getter
@Setter
@Table(name = "marketplace")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "marketplace_type", discriminatorType = DiscriminatorType.STRING)
public class MarketplaceItem extends AuditableEntityBase {

    @Column(name = "marketplace_type", insertable = false, updatable = false)
    @Enumerated(EnumType.STRING)
    private MarketplaceType marketplaceType;

    @ManyToOne
    @JoinColumn(name = "organisation_id")
    private Organisation organisation;

    @NotBlank
    @Column(name = "name")
    private String name;

    @Column(name = "name_tsvec", columnDefinition = "tsvector", updatable = false, insertable = false)
    private String nameTsVec;

    @NotBlank
    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "description_tsvec", columnDefinition = "tsvector", updatable = false, insertable = false)
    private String descriptionTsVec;

    /**
     * Null ist ortsunabhängig.
     */
    @Valid
    @Embedded
    @Nullable
    private Location location;

    @NotEmpty
    @Column(name = "thematic_focus")
    @ElementCollection
    @CollectionTable(name = "marketplace_thematic_focus")
    @Enumerated(EnumType.STRING)
    private Set<ThematicFocus> thematicFocus = new LinkedHashSet<>();

    @Column(name = "image_path")
    private String image;

    @Valid
    @NotNull
    @Embedded
    private Contact contact;

    /**
     * End Datum für OFFER(Angebot), für BEST_PRACTISE ist nicht relevant
     */
    @Column(name = "end_until")
    private OffsetDateTime endUntil;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private ItemStatus status = ItemStatus.ACTIVE;

    @NotNull
    @Column(name = "featured", nullable = false)
    private Boolean featured;

    @Column(name = "featured_text")
    private String featuredText;
}
