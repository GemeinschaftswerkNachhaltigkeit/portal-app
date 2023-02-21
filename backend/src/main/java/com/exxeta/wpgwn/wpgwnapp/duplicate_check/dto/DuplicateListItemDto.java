package com.exxeta.wpgwn.wpgwnapp.duplicate_check.dto;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.duplicate_check.model.DuplicateForField;
import com.exxeta.wpgwn.wpgwnapp.organisation.dto.OrganisationResponseDto;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.dto.OrganisationWorkInProgressDto;

@Data
public class DuplicateListItemDto implements Serializable {

    private final OrganisationResponseDto organisation;

    private final OrganisationWorkInProgressDto organisationWorkInProgress;

    private Set<DuplicateForField> duplicateForFields = new HashSet<>();

}
