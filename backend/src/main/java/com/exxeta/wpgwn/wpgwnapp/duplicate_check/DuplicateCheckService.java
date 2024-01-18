package com.exxeta.wpgwn.wpgwnapp.duplicate_check;

import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.duplicate_check.model.DuplicateForField;
import com.exxeta.wpgwn.wpgwnapp.duplicate_check.model.DuplicateList;
import com.exxeta.wpgwn.wpgwnapp.duplicate_check.model.DuplicateListItem;
import com.exxeta.wpgwn.wpgwnapp.duplicate_check.model.QDuplicateList;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.QOrganisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgressRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.QOrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Address;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Location;
import com.exxeta.wpgwn.wpgwnapp.shared.model.LocationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationStatus;
import com.exxeta.wpgwn.wpgwnapp.shared.model.QAddress;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.ConstantImpl;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class DuplicateCheckService {

    private final DuplicateListRepository duplicateListRepository;
    private final OrganisationRepository organisationRepository;
    private final OrganisationWorkInProgressRepository organisationWorkInProgressRepository;
    private final WpgwnProperties wpgwnProperties;

    /**
     * Sucht alle Organisationen und Organisationen Work In Progress nach möglichen Duplikaten.
     * Es werden nur Organisationen WorkInProgress mit den Statuswerten
     * * {@link OrganisationStatus#FREIGABE_KONTAKT_ORGANISATION}
     * * {@link OrganisationStatus#FREIGABE_CLEARING}
     * * {@link OrganisationStatus#RUECKFRAGE_CLEARING}
     * berücksichtigt.
     * <p>
     * Das Ergebnis wird immer gespeichert, auch wenn keine Duplikate gefunden werden. Falls in Zukunft andere Organisationen
     * als Duplikat erkannt werden, dan werden diese bei den bereits geprüften Organisationen (Wip) hinzugefügt.
     * <p>
     * *Wichtig:* Die Organisation (Wip) müssen aktualisiert bzw. gelöscht werden, wenn diese als Organisation veröffentlicht werden.
     *
     * @param organisationWorkInProgress
     * @return {@link DuplicateList} wenn Duplikate gefunden werden
     */
    @Transactional
    public DuplicateList checkForDuplicate(OrganisationWorkInProgress organisationWorkInProgress) {
        log.debug("Run duplicate check for organisation wip [{}]", organisationWorkInProgress.getId());
        final List<Organisation> organisationDuplicateSuspects =
                findOrganisationDuplicateSuspects(organisationWorkInProgress);

        final DuplicateList result = getDuplicateList(organisationWorkInProgress);
        final Set<DuplicateListItem> duplicateListItems = result.getDuplicateListItems();
        duplicateListItems
                .forEach(listItem -> {
                    OrganisationWorkInProgress wip = listItem.getOrganisationWorkInProgress();
                    if (Objects.nonNull(wip)) {
                        final DuplicateList wipDuplicateListItem = getDuplicateList(wip);
                        wipDuplicateListItem.getDuplicateListItems().removeIf(
                                item -> Objects.equals(item.getOrganisationWorkInProgress(),
                                        organisationWorkInProgress));
                    }
                });
        duplicateListItems.clear();

        result.setOrganisationWorkInProgress(organisationWorkInProgress);

        for (Organisation organisation : organisationDuplicateSuspects) {
            final Set<DuplicateForField> duplicateFields =
                    getDuplicatedFields(organisationWorkInProgress, organisation);
            if (!duplicateFields.isEmpty()) {
                final DuplicateListItem duplicateListItem = new DuplicateListItem();
                duplicateListItem.setDuplicateList(result);
                duplicateListItem.setDuplicateForFields(duplicateFields);
                duplicateListItem.setOrganisation(organisation);
                duplicateListItems.add(duplicateListItem);
            }
        }

        final List<OrganisationWorkInProgress> organisationWorkInProgressDuplicateSuspects =
                findOrganisationWorkInProgressDuplicateSuspects(organisationWorkInProgress);
        for (OrganisationWorkInProgress workInProgressDuplicate : organisationWorkInProgressDuplicateSuspects) {
            final Set<DuplicateForField> duplicateFields =
                    getDuplicatedFields(organisationWorkInProgress, workInProgressDuplicate);
            if (!duplicateFields.isEmpty()) {
                final DuplicateListItem duplicateListItem = new DuplicateListItem();
                duplicateListItem.setDuplicateList(result);
                duplicateListItem.setDuplicateForFields(duplicateFields);
                duplicateListItem.setOrganisationWorkInProgress(workInProgressDuplicate);
                duplicateListItems.add(duplicateListItem);
            }
        }

        /**
         * Fügt die OrganisationWIP an alle bereits gespeicherten DuplikatListen hinzu.
         */
        if (!organisationWorkInProgressDuplicateSuspects.isEmpty()) {
            List<DuplicateList> prevDuplicateLists = findDuplicateLists(organisationWorkInProgressDuplicateSuspects);
            for (DuplicateList duplicateList : prevDuplicateLists) {
                OrganisationWorkInProgress existingOrganisationWorkInProgress =
                        duplicateList.getOrganisationWorkInProgress();
                Set<DuplicateForField> duplicateFields =
                        getDuplicatedFields(existingOrganisationWorkInProgress, organisationWorkInProgress);
                if (!duplicateFields.isEmpty()) {
                    DuplicateListItem duplicateListItem = new DuplicateListItem();
                    duplicateListItem.setDuplicateList(duplicateList);
                    duplicateListItem.setDuplicateForFields(duplicateFields);
                    duplicateListItem.setOrganisationWorkInProgress(organisationWorkInProgress);
                    duplicateList.getDuplicateListItems().add(duplicateListItem);

                    duplicateListRepository.save(duplicateList);
                }
            }
        }

        return duplicateListRepository.save(result);
    }

    private DuplicateList getDuplicateList(OrganisationWorkInProgress organisationWorkInProgress) {
        return duplicateListRepository.findByOrganisationWorkInProgressId(organisationWorkInProgress.getId())
                .orElse(new DuplicateList());
    }

    /**
     * Aktualisieren der Organisation Wip, wenn diese veröffentlicht wird.
     * <p>
     * <ol>
     *     <li>Beim Veröffentlichen der Organisation wird der Eintrag (DuplicateList für diese Organisation gelöscht.</li>
     *     <li>Alle Duplikate, bei denen die OrganisationWorkInProgress als Duplikat auftaucht, muss auf die Organisation geändert werden.</li>
     * </ol>
     */
    @Transactional
    public void updatePublishedOrganisation(OrganisationWorkInProgress organisationWorkInProgress,
                                            Organisation organisation) {

        Optional<DuplicateList> maybeWorkInProgressDuplicateList =
                duplicateListRepository.findByOrganisationWorkInProgress(organisationWorkInProgress);
        if (maybeWorkInProgressDuplicateList.isEmpty()) {
            log.warn("Unable to find organisation work in progress duplicate list [{}]",
                    organisationWorkInProgress.getId());
            return;
        }

        DuplicateList organisationWorkInProgressList = maybeWorkInProgressDuplicateList.get();

        List<OrganisationWorkInProgress> duplicateOrgs = organisationWorkInProgressList.getDuplicateListItems()
                .stream()
                .map(DuplicateListItem::getOrganisationWorkInProgress)
                .filter(Objects::nonNull)
                .collect(Collectors.toUnmodifiableList());

        List<DuplicateList> prevDuplicateLists = findDuplicateLists(duplicateOrgs);
        for (DuplicateList duplicateList : prevDuplicateLists) {
            OrganisationWorkInProgress existingOrganisationWorkInProgress =
                    duplicateList.getOrganisationWorkInProgress();
            Set<DuplicateForField> duplicateFields =
                    getDuplicatedFields(existingOrganisationWorkInProgress, organisation);

            // Organisation mit aktualisieren Duplicateprüfung hinzufügen
            if (!duplicateFields.isEmpty()) {
                DuplicateListItem duplicateListItem = new DuplicateListItem();
                duplicateListItem.setDuplicateList(duplicateList);
                duplicateListItem.setDuplicateForFields(duplicateFields);
                duplicateListItem.setOrganisationWorkInProgress(null);
                duplicateListItem.setOrganisation(organisation);
                duplicateList.getDuplicateListItems().add(duplicateListItem);
                log.debug("Add organisation [{}] with duplicate fields {}", organisation.getId(), duplicateFields);
            }

            // Organisation work in progress aus Liste entfernen, da diese gerade in eine Organisation umgewandelt wurde.
            duplicateList.getDuplicateListItems().removeIf(
                    listItem -> {
                        boolean isEqual = Objects.nonNull(listItem.getOrganisationWorkInProgress())
                                && Objects.equals(listItem.getOrganisationWorkInProgress().getId(),
                                organisationWorkInProgress.getId());
                        if (isEqual) {
                            log.debug("Remove organisation work in progress [{}] from [{}]",
                                    organisationWorkInProgress.getId(),
                                    duplicateList.getOrganisationWorkInProgress().getId());
                        }
                        return isEqual;
                    });

            duplicateListRepository.save(duplicateList);
        }
        duplicateListRepository.delete(organisationWorkInProgressList);
    }

    private List<Organisation> findOrganisationDuplicateSuspects(
            OrganisationWorkInProgress organisationWorkInProgress) {
        final BooleanBuilder searchPredicate = new BooleanBuilder();
        if (StringUtils.hasText(organisationWorkInProgress.getName())) {
            searchPredicate.or(QOrganisation.organisation.name.equalsIgnoreCase(organisationWorkInProgress.getName()));
        }
        if (StringUtils.hasText(organisationWorkInProgress.getName())) {
            NumberTemplate<Double> nameSimilarityValue = Expressions
                    .numberTemplate(Double.class, "similarity({0}, {1})", QOrganisation.organisation.name,
                            ConstantImpl.create(organisationWorkInProgress.getName()));
            searchPredicate.or(nameSimilarityValue.goe(wpgwnProperties.getDuplicate().getNameSimilarityThreshold()));
        }

        if (hasAddressValue(organisationWorkInProgress)) {
            final QAddress qAddress = QOrganisation.organisation.location.address;
            final Address address = organisationWorkInProgress.getLocationWorkInProgress().getAddress();
            final BooleanExpression addressEqualsIgnoreCasePredicate =
                    getAddressEqualsIgnoreCasePredicate(qAddress, address);
            searchPredicate.or(addressEqualsIgnoreCasePredicate);
        }

        if (hasEmailValue(organisationWorkInProgress)) {
            final BooleanExpression contactEmailEqualsIgnoreCase = QOrganisation.organisation.contact.email
                    .equalsIgnoreCase(organisationWorkInProgress.getContactWorkInProgress().getEmail());
            searchPredicate.or(contactEmailEqualsIgnoreCase);
        }

        if (hasUrlValue(organisationWorkInProgress)) {
            searchPredicate.or(QOrganisation.organisation.location.url
                    .equalsIgnoreCase(organisationWorkInProgress.getLocationWorkInProgress().getUrl()));
        }

        if (searchPredicate.hasValue()) {
            Iterable<Organisation> result = organisationRepository.findAll(searchPredicate);
            return StreamSupport.stream(result.spliterator(), false).collect(Collectors.toList());
        } else {
            return new ArrayList<>();
        }
    }

    private List<OrganisationWorkInProgress> findOrganisationWorkInProgressDuplicateSuspects(
            OrganisationWorkInProgress organisationWorkInProgress) {
        final BooleanBuilder searchPredicate = new BooleanBuilder();
        final QOrganisationWorkInProgress qOrganisationWorkInProgress =
                QOrganisationWorkInProgress.organisationWorkInProgress;
        if (StringUtils.hasText(organisationWorkInProgress.getName())) {
            NumberTemplate<Double> nameSimilarityValue = Expressions
                    .numberTemplate(Double.class, "similarity({0}, {1})", qOrganisationWorkInProgress.name,
                            ConstantImpl.create(organisationWorkInProgress.getName()));
            searchPredicate.or(nameSimilarityValue.goe(wpgwnProperties.getDuplicate().getNameSimilarityThreshold()));
        }

        if (hasAddressValue(organisationWorkInProgress)) {
            final QAddress qAddress =
                    qOrganisationWorkInProgress.locationWorkInProgress.address;
            final Address address = organisationWorkInProgress.getLocationWorkInProgress().getAddress();
            final BooleanExpression addressEqualsIgnoreCasePredicate =
                    getAddressEqualsIgnoreCasePredicate(qAddress, address);
            searchPredicate.or(addressEqualsIgnoreCasePredicate);
        }

        if (hasEmailValue(organisationWorkInProgress)) {
            searchPredicate.or(
                    qOrganisationWorkInProgress.contactWorkInProgress.email.equalsIgnoreCase(
                            organisationWorkInProgress.getContactWorkInProgress().getEmail()));
        }

        if (hasUrlValue(organisationWorkInProgress)) {
            searchPredicate.or(
                    qOrganisationWorkInProgress.locationWorkInProgress.url.equalsIgnoreCase(
                            organisationWorkInProgress.getLocationWorkInProgress().getUrl()));
        }
        if (searchPredicate.hasValue()) {
            searchPredicate.and(qOrganisationWorkInProgress.id.ne(organisationWorkInProgress.getId()));
            searchPredicate.and(qOrganisationWorkInProgress.status.in(
                    OrganisationStatus.FREIGABE_KONTAKT_ORGANISATION,
                    OrganisationStatus.FREIGABE_CLEARING,
                    OrganisationStatus.RUECKFRAGE_CLEARING));
            Iterable<OrganisationWorkInProgress> result =
                    organisationWorkInProgressRepository.findAll(searchPredicate);
            return StreamSupport.stream(result.spliterator(), false).collect(Collectors.toList());
        } else {
            return new ArrayList<>();
        }
    }

    private List<DuplicateList> findDuplicateLists(List<OrganisationWorkInProgress> organisationsWorkInProgress) {
        return duplicateListRepository.findAllByOrganisationWorkInProgressIn(organisationsWorkInProgress);
    }

    private boolean hasEmailValue(OrganisationWorkInProgress organisationWorkInProgress) {
        return Objects.nonNull(organisationWorkInProgress.getContactWorkInProgress())
                && StringUtils.hasText(organisationWorkInProgress.getContactWorkInProgress().getEmail());
    }

    private boolean hasUrlValue(OrganisationWorkInProgress organisationWorkInProgress) {
        return Objects.nonNull(organisationWorkInProgress.getLocationWorkInProgress())
                && StringUtils.hasText(organisationWorkInProgress.getLocationWorkInProgress().getUrl());
    }

    private boolean hasAddressValue(OrganisationWorkInProgress organisationWorkInProgress) {
        if (Objects.isNull(organisationWorkInProgress.getLocationWorkInProgress())) {
            return false;
        }
        final Address address = organisationWorkInProgress.getLocationWorkInProgress().getAddress();
        return Objects.nonNull(address)
                && StringUtils.hasText(address.getCity())
                && StringUtils.hasText(address.getStreet())
                && StringUtils.hasText(address.getStreetNo());
    }

    private BooleanExpression getAddressEqualsIgnoreCasePredicate(QAddress qAddress, Address address) {
        final BooleanExpression cityEqualsIgnoreCase = qAddress.city.equalsIgnoreCase(address.getCity());
        final BooleanExpression streetEqualsIgnoreCase = qAddress.street.equalsIgnoreCase(address.getStreet());
        final BooleanExpression streetNoEqualsIgnoreCase =
                qAddress.streetNo.equalsIgnoreCase(address.getStreetNo());
        return cityEqualsIgnoreCase
                .and(streetEqualsIgnoreCase)
                .and(streetNoEqualsIgnoreCase);
    }

    private Set<DuplicateForField> getDuplicatedFields(OrganisationWorkInProgress organisationWorkInProgress,
                                                       Organisation orgToCheck) {
        final Set<DuplicateForField> result = new HashSet<>();
        if (isAddressEqual(organisationWorkInProgress.getLocationWorkInProgress(), orgToCheck.getLocation())) {
            result.add(DuplicateForField.ADDRESS);
        }
        if (isUrlEqual(organisationWorkInProgress, orgToCheck)) {
            result.add(DuplicateForField.URL);
        }
        if (isEmailEqual(organisationWorkInProgress, orgToCheck)) {
            result.add(DuplicateForField.EMAIL);
        }
        // ToDo: Ahnlichkeitssuche auf basis von sql funktion 'similarity(a, b)' zur prüfung von DuplicateForField.NAME nutzen
        //       aus zeitgtünden vereinfachte umsetzung (WPGWN-130)
        if (result.isEmpty()) {
            result.add(DuplicateForField.NAME);
        }
        return result;
    }

    private Set<DuplicateForField> getDuplicatedFields(OrganisationWorkInProgress organisationWorkInProgress,
                                                       OrganisationWorkInProgress organisationWorkInProgressToCheck) {
        final Set<DuplicateForField> result = new HashSet<>();
        if (isAddressEqual(organisationWorkInProgress.getLocationWorkInProgress(),
                organisationWorkInProgressToCheck.getLocationWorkInProgress())) {
            result.add(DuplicateForField.ADDRESS);
        }
        if (isUrlEqual(organisationWorkInProgress, organisationWorkInProgressToCheck)) {
            result.add(DuplicateForField.URL);
        }
        if (isEmailEqual(organisationWorkInProgress, organisationWorkInProgressToCheck)) {
            result.add(DuplicateForField.EMAIL);
        }
        // ToDo: Ahnlichkeitssuche auf basis von sql funktion 'similarity(a, b)' zur prüfung von DuplicateForField.NAME nutzen
        //       aus zeitgtünden vereinfachte umsetzung (WPGWN-130)
        if (result.isEmpty()) {
            result.add(DuplicateForField.NAME);
        }
        return result;
    }

    private boolean isAddressEqual(LocationWorkInProgress source, Location target) {
        if (Objects.isNull(source) || Objects.isNull(target)) {
            return false;
        }
        return isAddressEqual(source.getAddress(), target.getAddress());
    }

    private boolean isAddressEqual(LocationWorkInProgress source, LocationWorkInProgress target) {
        if (Objects.isNull(source) || Objects.isNull(target)) {
            return false;
        }
        return isAddressEqual(source.getAddress(), target.getAddress());
    }

    private boolean isAddressEqual(Address sourceAddress, Address targetAddress) {
        return Objects.nonNull(sourceAddress) && Objects.nonNull(targetAddress)
                && isStringEqual(sourceAddress.getStreet(), targetAddress.getStreet())
                && isStringEqual(sourceAddress.getStreetNo(), targetAddress.getStreetNo())
                && isStringEqual(sourceAddress.getState(), targetAddress.getState());
    }

    private boolean isEmailEqual(OrganisationWorkInProgress source, OrganisationWorkInProgress target) {
        return Objects.nonNull(source.getContactWorkInProgress())
                && Objects.nonNull(target.getContactWorkInProgress())
                && isStringEqual(source.getContactWorkInProgress().getEmail(),
                target.getContactWorkInProgress().getEmail());
    }

    private boolean isEmailEqual(OrganisationWorkInProgress source, Organisation target) {
        return Objects.nonNull(source.getContactWorkInProgress())
                && Objects.nonNull(target.getContact())
                && isStringEqual(source.getContactWorkInProgress().getEmail(), target.getContact().getEmail());
    }

    private boolean isUrlEqual(OrganisationWorkInProgress source, OrganisationWorkInProgress target) {
        return Objects.nonNull(source.getLocationWorkInProgress())
                && Objects.nonNull(target.getLocationWorkInProgress())
                && isStringEqual(source.getLocationWorkInProgress().getUrl(),
                target.getLocationWorkInProgress().getUrl());
    }

    private boolean isUrlEqual(OrganisationWorkInProgress source, Organisation target) {
        return Objects.nonNull(source.getLocationWorkInProgress())
                && Objects.nonNull(target.getLocation())
                && isStringEqual(source.getLocationWorkInProgress().getUrl(), target.getLocation().getUrl());
    }

    private boolean isStringEqual(String source, String target) {
        return StringUtils.hasText(source) && source.equals(target);
    }

    @Transactional
    public void removeFromDuplicateLists(@NotNull Organisation org) {
        BooleanExpression predicate = QDuplicateList.duplicateList.duplicateListItems.any().organisation.eq(org);
        Iterable<DuplicateList> dupLists = duplicateListRepository.findAll(predicate);
        StreamSupport.stream(dupLists.spliterator(), false)
                .peek(dupList -> removeItemsByFilterPredicate(dupList, dupeItem ->
                        Objects.nonNull(dupeItem.getOrganisation())
                                && dupeItem.getOrganisation().getId().equals(org.getId())))
                .forEach(duplicateListRepository::save);
    }

    @Transactional
    public void removeFromDuplicateLists(@NotNull OrganisationWorkInProgress orgWip) {
        BooleanExpression predicate =
                QDuplicateList.duplicateList.duplicateListItems.any().organisationWorkInProgress.eq(orgWip);
        Iterable<DuplicateList> dupLists = duplicateListRepository.findAll(predicate);
        StreamSupport.stream(dupLists.spliterator(), false)
                .filter(dupList -> Objects.nonNull(dupList.getOrganisationWorkInProgress()))
                .peek(dupList -> removeItemsByFilterPredicate(dupList, dupeItem ->
                        Objects.nonNull(dupeItem.getOrganisationWorkInProgress())
                                && dupeItem.getOrganisationWorkInProgress().getId().equals(orgWip.getId())))
                .forEach(duplicateListRepository::save);
    }

    private void removeItemsByFilterPredicate(DuplicateList dupList, Predicate<DuplicateListItem> predicate) {
        Set<DuplicateListItem> listItems = dupList.getDuplicateListItems();
        listItems.removeIf(predicate);
    }

    @Transactional
    public void deleteDuplicateListForOrganisationWip(OrganisationWorkInProgress organisationWorkInProgress) {
        duplicateListRepository
                .deleteAllByOrganisationWorkInProgress(organisationWorkInProgress);
    }
}
