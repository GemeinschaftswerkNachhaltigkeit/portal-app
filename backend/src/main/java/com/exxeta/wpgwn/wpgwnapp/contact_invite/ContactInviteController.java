package com.exxeta.wpgwn.wpgwnapp.contact_invite;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.exception.EntityExpiredException;

@RestController
@RequestMapping("/api/v1/contact-invite")
@RequiredArgsConstructor
@Slf4j
public class ContactInviteController {

    private final ContactInviteService contactInviteService;

    private final ContactInviteMapper mapper;

    @GetMapping("/{uuid}")
    @Transactional
    ContactInviteDto getContactInvitation(@PathVariable("uuid") UUID uuid) throws EntityExpiredException {
        final ContactInvite contactInvite = contactInviteService.getContactInvite(uuid, false);
        return mapper.contactInviteToDto(contactInvite);
    }

    @PutMapping("/{uuid}")
    @Transactional
    ContactInviteDto updateStatusForContactInvitation(@PathVariable("uuid") UUID uuid,
                                                      @RequestParam("status") ContactInviteStatus status)
            throws EntityExpiredException {
        if (ContactInviteStatus.OPEN.equals(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    String.format("Invalid target status for [%s] with uuid [%s]: [%s] not allowed!", "ContactInvite",
                            uuid, status.name()));
        }

        ContactInvite contactInvite = contactInviteService.getContactInvite(uuid);
        if (!ContactInviteStatus.OPEN.equals(contactInvite.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    String.format("Invalid status for [%s] with uuid [%s]: Only changeable from OPEN, but was [%s]!",
                            "ContactInvite", uuid, status.name()));
        }

        contactInvite = contactInviteService.changeContactInviteStatusTo(uuid, status);
        return mapper.contactInviteToDto(contactInvite);
    }


}
