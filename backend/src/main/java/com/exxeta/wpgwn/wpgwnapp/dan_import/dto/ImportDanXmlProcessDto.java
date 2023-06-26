package com.exxeta.wpgwn.wpgwnapp.dan_import.dto;

import com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportDanXmlResult;
import com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportStatus;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class ImportDanXmlProcessDto {

    private String importFilename;
    private ImportStatus importStatus;
    private String importId;
    private ImportDanXmlResult report;

    public ImportDanXmlProcessDto(String importFilename, ImportStatus importStatus, String importId) {
        this.importFilename = importFilename;
        this.importStatus = importStatus;
        this.importId = importId;
    }
}
