package com.exxeta.wpgwn.wpgwnapp.organisation;

import javax.persistence.EntityNotFoundException;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Contact;

import com.querydsl.core.BooleanBuilder;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrganisationService {

    private final OrganisationRepository organisationRepository;

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

    public String getContactImage(Organisation organisation) {
        return Optional.of(organisation)
                .map(Organisation::getContact)
                .map(Contact::getImage)
                .orElse(null);
    }
}
