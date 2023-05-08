package com.exxeta.wpgwn.wpgwnapp.revision;

import lombok.Data;

@Data
public class RevisionDto<T> {

    private final RevisionMetadataDto metadata;

    private final T content;

}
