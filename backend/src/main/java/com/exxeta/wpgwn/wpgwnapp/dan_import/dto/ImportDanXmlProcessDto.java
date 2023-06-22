package com.exxeta.wpgwn.wpgwnapp.dan_import.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportDanXmlResult;
import com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportStatus;

@Getter
@Setter
@NoArgsConstructor
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
