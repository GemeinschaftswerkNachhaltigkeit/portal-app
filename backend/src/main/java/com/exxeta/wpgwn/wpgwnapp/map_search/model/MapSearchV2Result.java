package com.exxeta.wpgwn.wpgwnapp.map_search.model;

import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.map_search.MapSearchResultType;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.shared.model.*;

import lombok.Getter;
import lombok.Setter;

import org.springframework.data.annotation.Immutable;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Immutable
@Table(name = "v_map_search_v2_result")
@Getter
@Setter
public class MapSearchV2Result {

    @Id
    private String id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "name_description_tsvec", columnDefinition = "tsvector")
    private String nameAndDescriptionTsvec;

    @Column(name = "result_type")
    @Enumerated(EnumType.STRING)
    private MapSearchResultType resultType;

    @OneToOne
    @JoinColumn(name = "activity_id", referencedColumnName = "id", insertable = false, updatable = false, foreignKey = @ForeignKey(name = "none"))
    private Activity activity;

    @OneToOne
    @JoinColumn(name = "organisation_id", referencedColumnName = "id", insertable = false, updatable = false, foreignKey = @ForeignKey(name = "none"))
    private Organisation organisation;

    // Fields for Search only
    @Column(name = "organisation_type")
    @Enumerated(EnumType.STRING)
    private OrganisationType organisationType;

    @Column(name = "activity_type")
    @Enumerated(EnumType.STRING)
    private ActivityType activityType;

    @Column(name = "impact_area")
    @Enumerated(EnumType.STRING)
    private ImpactArea impactArea;

    @Embedded
    private Location location;

    @Column(name = "contact_lastname")
    private String lastName;

    @Column(name = "contact_firstname")
    private String firstName;

    @Column(name = "contact_position")
    private String position;

    @Embedded
    private Period period;

    @Column(name = "thematic_focus")
    private String thematicFocus;

    @Column(name = "sustainable_development_goals")
    private String sustainableDevelopmentGoals;

    @Column(name = "initiator")
    private Boolean initiator;

    @Column(name = "project_sustainability_winner")
    private Boolean projectSustainabilityWinner;

    @Column(name = "modified_at")
    private Instant modifiedAt;

    @Column(name = "created_at")
    private Instant createdAt;
}
