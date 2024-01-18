package com.exxeta.wpgwn.wpgwnapp.duplicate_check.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.LinkedHashSet;
import java.util.Set;

import lombok.Getter;
import lombok.Setter;

import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.AuditableEntityBase;


@Entity
@Table(name = "duplicate_list")
@Getter
@Setter
public class DuplicateList extends AuditableEntityBase {

    @OneToOne
    @JoinColumn(name = "organisation_work_in_progress_id", referencedColumnName = "id", unique = true)
    private OrganisationWorkInProgress organisationWorkInProgress;

    @OneToMany(mappedBy = "duplicateList", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DuplicateListItem> duplicateListItems = new LinkedHashSet<>();

}
