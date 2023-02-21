package com.exxeta.wpgwn.wpgwnapp.excel_import.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImportResultDto {
    private ImportProcessDto importProcess;

    private Integer importedOrganisations = 0;
    private Integer importedActivities = 0;
}
