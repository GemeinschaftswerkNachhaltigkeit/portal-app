package com.exxeta.wpgwn.wpgwnapp.email_opt_out;

import javax.annotation.security.RolesAllowed;
import java.util.Objects;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.email_opt_out.dto.EmailOptOutEntryDto;
import com.exxeta.wpgwn.wpgwnapp.email_opt_out.model.EmailOptOutEntry;
import com.exxeta.wpgwn.wpgwnapp.security.JwtTokenNames;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

import io.swagger.v3.oas.annotations.Parameter;

@RestController
@RequestMapping("/api/v1/email/opt-out")
@RequiredArgsConstructor
public class EmailOptOutController {

    private final EmailOptOutService emailOptOutService;
    private final OptOutMapper optOutMapper;

    @GetMapping
    @RolesAllowed(PermissionPool.GUEST)
    EmailOptOutEntryDto getOptOutByUser(
            @Parameter(hidden = true) @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {
        final String email = Objects.requireNonNull(principal.getAttribute(JwtTokenNames.EMAIL));
        final EmailOptOutEntry optOutEntry = emailOptOutService.getByEmailAndCreateIfNotExists(email);
        return optOutMapper.optOutEntryToDto(optOutEntry);
    }

    @PostMapping
    @RolesAllowed(PermissionPool.GUEST)
    EmailOptOutEntryDto setOptOutByUser(
            @RequestBody EmailOptOutEntryDto optOutEntryDto,
            @Parameter(hidden = true) @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {
        final String email = Objects.requireNonNull(principal.getAttribute(JwtTokenNames.EMAIL));
        final EmailOptOutEntry optOutEntry = emailOptOutService.setEmailOptOutOptionsForEmail(email, optOutEntryDto);
        return optOutMapper.optOutEntryToDto(optOutEntry);
    }

    /**
     * Ungeschützter Endpunkt, zum Abrufen der aktuellen OptOut E-Mail Optionen.
     * Wird aus dem E-Mail Link aufgerufen.
     */
    @GetMapping("/{uuid}")
    EmailOptOutEntryDto getOptOutByUUIDAndEmail(@PathVariable("uuid") UUID uuid, @RequestParam("email") String email) {
        final EmailOptOutEntry optOutEntry = emailOptOutService.getEmailOptOutOptionsForUUIDAndEmail(uuid, email);
        return optOutMapper.optOutEntryToDto(optOutEntry);
    }

    /**
     * Ungeschützter Endpunkt, zum Abmelden von E-Mails ohne Login.
     * Wird aus dem E-Mail Link aufgerufen.
     */
    @PostMapping("/{uuid}")
    EmailOptOutEntryDto setOptOutByUUIDAndEmail(@PathVariable("uuid") UUID uuid,
                                                @RequestBody EmailOptOutEntryDto optOutEntryDto) {
        final EmailOptOutEntry optOutEntry = emailOptOutService.setEmailOptOutOptionsForUUID(uuid, optOutEntryDto);
        return optOutMapper.optOutEntryToDto(optOutEntry);
    }
}
