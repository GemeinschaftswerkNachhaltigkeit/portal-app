package com.exxeta.wpgwn.wpgwnapp.map_search.model;

import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.ForeignKey;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.springframework.data.annotation.Immutable;

import lombok.Getter;
import lombok.Setter;

import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.map_search.MapSearchResultType;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ImpactArea;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Location;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Period;

@Entity
@Immutable
@Table(name = "v_search_result")
@Getter
@Setter
public class MapSearchResult {

    @Id
    private String id;

    @Column(name = "name")
    private String name;

    @Column(name = "name_tsvec", columnDefinition = "tsvector")
    private String nameTsvec;

    @Column(name = "description")
    private String description;

    @Column(name = "description_tsvec", columnDefinition = "tsvector")
    private String descriptionTsvec;

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

    @Embedded
    private ContactWithTsVector contactWithTsVector;

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
}
