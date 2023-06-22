package com.exxeta.wpgwn.wpgwnapp.dan_import.dto;

import lombok.Value;

import com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportStatus;
import com.exxeta.wpgwn.wpgwnapp.dan_import.xml.Campaigns;

@Value
public class ImportDanXmlJobEvent {

    private final String importFilename;

    private final ImportStatus importStatus;

    private final String importKey;

    private final Campaigns campaigns;

}
