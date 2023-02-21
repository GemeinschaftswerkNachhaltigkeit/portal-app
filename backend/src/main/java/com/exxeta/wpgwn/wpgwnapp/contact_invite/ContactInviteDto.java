package com.exxeta.wpgwn.wpgwnapp.contact_invite;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

import org.springframework.validation.annotation.Validated;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.organisation.dto.OrganisationResponseDto;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.dto.OrganisationWorkInProgressDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ContactDto;

@Data
@Validated
public class ContactInviteDto {

    private final UUID randomUniqueId;

    private OrganisationWorkInProgressDto organisationWorkInProgress;

    private OrganisationResponseDto organisation;

    @NotNull
    @Valid
    private final ContactDto contact;

    @NotNull
    private ContactInviteStatus status;

    private Instant closedAt;

    private Instant expiresAt;
}
