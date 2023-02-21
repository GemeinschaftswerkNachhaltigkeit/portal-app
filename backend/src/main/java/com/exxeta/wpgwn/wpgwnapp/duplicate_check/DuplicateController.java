package com.exxeta.wpgwn.wpgwnapp.duplicate_check;

import javax.annotation.security.RolesAllowed;
import javax.persistence.EntityNotFoundException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.duplicate_check.dto.DuplicateListDto;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

/**
 * Controller um mögliche Duplikate einer Organisation abzurufen.
 * Benötigt {@link PermissionPool#RNE_ADMIN} Rechte.
 */
@RestController
@RequestMapping("/api/v1/manage-organisations")
@RequiredArgsConstructor
@RolesAllowed(PermissionPool.RNE_ADMIN)
public class DuplicateController {

    private final DuplicateListRepository duplicateListRepository;

    private final DuplicateListMapper duplicateListMapper;

    @GetMapping("/{orgId}/duplicates")
    DuplicateListDto findDuplicates(@PathVariable("orgId") Long orgId) {
        return duplicateListRepository.findByOrganisationWorkInProgressId(orgId)
                .map(duplicateListMapper::map)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with id [%s] not found", "DuplicateList", orgId)));

    }

}
