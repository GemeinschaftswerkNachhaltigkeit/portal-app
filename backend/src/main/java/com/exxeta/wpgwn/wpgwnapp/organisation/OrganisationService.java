package com.exxeta.wpgwn.wpgwnapp.organisation;

import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Contact;
import com.exxeta.wpgwn.wpgwnapp.utils.PrincipalMapper;

import com.querydsl.core.BooleanBuilder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.Optional;

import static java.util.Objects.isNull;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrganisationService {

    private final OrganisationRepository organisationRepository;

    private final WpgwnProperties wpgwnProperties;

    public Organisation save(Organisation entity) {
        return organisationRepository.save(entity);
    }

    public Page<Organisation> findAll(BooleanBuilder searchPredicate, Pageable pageable) {
        return organisationRepository.findAll(searchPredicate, pageable);
    }

    public Optional<Organisation> findById(long orgId) {
        return organisationRepository.findById(orgId);
    }

    public Organisation getOrganisation(long orgId) {
        return organisationRepository.findById(orgId)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with id [%s] not found", "Organisation", orgId)));
    }

    public Organisation getDanOrganisation(OAuth2AuthenticatedPrincipal principal) {
        final long orgId = getDanOrganisationId(principal);
        return getOrganisation(orgId);
    }

    public Organisation getDefaultDanOrganisation() {
        return getOrganisation(wpgwnProperties.getDanId());
    }

    public long getDanOrganisationId(OAuth2AuthenticatedPrincipal principal) {
        Long userOrgId = PrincipalMapper.getUserOrgId(principal);
        return isNull(userOrgId) ? wpgwnProperties.getDanId() : userOrgId;
    }

    public String getContactImage(Organisation organisation) {
        return Optional.of(organisation)
                .map(Organisation::getContact)
                .map(Contact::getImage)
                .orElse(null);
    }
}
