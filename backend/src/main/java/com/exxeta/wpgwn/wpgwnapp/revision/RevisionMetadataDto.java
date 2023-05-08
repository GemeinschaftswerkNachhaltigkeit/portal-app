package com.exxeta.wpgwn.wpgwnapp.revision;

import java.time.OffsetDateTime;

import org.springframework.data.history.RevisionMetadata.RevisionType;

import lombok.Data;

@Data
public class RevisionMetadataDto {

    private Number revisionNumber;

    private OffsetDateTime modifiedAt;

    private RevisionType revisionType;

}
