package com.exxeta.wpgwn.wpgwnapp.api.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

import lombok.Data;

@Data
public class ApiKeyDto {

    private UUID apiKey;

    private String createdBy;

    private String lastModifiedBy;

    private OffsetDateTime createdAt;

    private OffsetDateTime modifiedAt;

    private UUID keycloakUserId;

}
