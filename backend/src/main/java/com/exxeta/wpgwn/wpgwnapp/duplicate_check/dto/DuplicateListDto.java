package com.exxeta.wpgwn.wpgwnapp.duplicate_check.dto;

import java.io.Serializable;
import java.util.LinkedHashSet;
import java.util.Set;

import lombok.Data;

@Data
public class DuplicateListDto implements Serializable {

    private final Long organisationWorkInProgressId;

    private final String name;

    private final Set<DuplicateListItemDto> duplicateListItems = new LinkedHashSet<>();

}
