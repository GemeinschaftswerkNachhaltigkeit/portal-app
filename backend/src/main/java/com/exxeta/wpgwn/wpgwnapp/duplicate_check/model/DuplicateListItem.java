package com.exxeta.wpgwn.wpgwnapp.duplicate_check.model;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

import lombok.Getter;
import lombok.Setter;

import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.EntityBase;

@Entity
@Table(name = "duplicate_list_item")
@Getter
@Setter
public class DuplicateListItem extends EntityBase {

    /**
     * Parent
     */
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "duplicate_list_id")
    private DuplicateList duplicateList;

    /**
     * Organisation für die Duplikate gefunden wurden.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organisation_id")
    private Organisation organisation;

    /**
     * Organisation WIP für die Duplikate gefunden wurden.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organisation_work_in_progress_id")
    private OrganisationWorkInProgress organisationWorkInProgress;

    /**
     * Attribute mit Duplikatverdacht.
     */
    @NotNull
    @Column(name = "duplicate_for_fields")
    @Enumerated(EnumType.STRING)
    @ElementCollection
    private Set<DuplicateForField> duplicateForFields = new HashSet<>();

}
