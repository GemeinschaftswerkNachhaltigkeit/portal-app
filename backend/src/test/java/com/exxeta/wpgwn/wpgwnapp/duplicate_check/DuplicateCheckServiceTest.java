package com.exxeta.wpgwn.wpgwnapp.duplicate_check;

import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.apache.commons.lang3.tuple.Triple;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.keycloak.admin.client.resource.GroupResource;
import org.keycloak.representations.idm.GroupRepresentation;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.annotation.Transactional;

import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.duplicate_check.model.DuplicateForField;
import com.exxeta.wpgwn.wpgwnapp.duplicate_check.model.DuplicateList;
import com.exxeta.wpgwn.wpgwnapp.duplicate_check.model.DuplicateListItem;
import com.exxeta.wpgwn.wpgwnapp.email.EmailService;
import com.exxeta.wpgwn.wpgwnapp.exception.ValidationException;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.service.KeycloakService;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgressPublishService;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgressRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.SocialMediaContact;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Address;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Contact;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ContactWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.EntityBase;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ImpactArea;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Location;
import com.exxeta.wpgwn.wpgwnapp.shared.model.LocationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationStatus;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.SocialMediaType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Source;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ThematicFocus;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest
@Import(TestSecurityConfiguration.class)
class DuplicateCheckServiceTest {

    @Autowired
    DuplicateCheckService duplicateCheckService;
    @Autowired
    OrganisationWorkInProgressPublishService organisationWorkInProgressPublishService;
    @MockBean
    KeycloakService keycloakService;
    @MockBean
    EmailService emailService;
    @Autowired
    private OrganisationRepository organisationRepository;
    @Autowired
    private OrganisationWorkInProgressRepository organisationWorkInProgressRepository;
    @Autowired
    private DuplicateListRepository duplicateListRepository;
    @Autowired
    private Clock clock;
    @Autowired
    private GeometryFactory factory;

    @AfterEach
    void tearDown() {
        duplicateListRepository.deleteAll();
        organisationRepository.deleteAll();
        organisationWorkInProgressRepository.deleteAll();
    }

    /**
     * Organisation findet sich nicht selbst als Duplikat.
     */
    @Test
    void checkForDuplicate1() {

        OrganisationWorkInProgress organisation1 = getOrganisationWorkInProgress();

        organisation1 = organisationWorkInProgressRepository.save(organisation1);

        DuplicateList duplicates = duplicateCheckService.checkForDuplicate(organisation1);

        assertThat(duplicates).isNotNull();
        assertThat(duplicates.getDuplicateListItems()).isEmpty();
    }

    /**
     * Organisation (Wip) mit anderer ID wird als Duplikat gefunden.
     */
    @Test
    void checkForDuplicate2() {
        OrganisationWorkInProgress organisation1 = organisationWorkInProgressRepository.save(
                getOrganisationWorkInProgress());
        OrganisationWorkInProgress organisation2 = organisationWorkInProgressRepository.save(
                getOrganisationWorkInProgress());

        DuplicateList duplicates = duplicateCheckService.checkForDuplicate(organisation2);

        assertThat(duplicates).isNotNull();
        assertThat(duplicates.getDuplicateListItems())
                .flatExtracting(val -> val.getOrganisationWorkInProgress().getId(),
                        val -> val.getOrganisationWorkInProgress().getRandomUniqueId(),
                        DuplicateListItem::getDuplicateForFields)
                .containsExactly(organisation1.getId(),
                        organisation1.getRandomUniqueId(),
                        Set.of(DuplicateForField.ADDRESS, DuplicateForField.EMAIL,
                                DuplicateForField.URL));
    }

    /**
     * Organisation (Wip) mit anderer ID und eine Organisation wird als Duplikat gefunden.
     */
    @Test
    void checkForDuplicate3() {
        // Given
        OrganisationWorkInProgress organisationWip1 = organisationWorkInProgressRepository.save(
                getOrganisationWorkInProgress());
        Organisation organisation = organisationRepository.save(getOrganisation());

        OrganisationWorkInProgress organisationWip2 = organisationWorkInProgressRepository.save(
                getOrganisationWorkInProgress());

        // When
        DuplicateList duplicates = duplicateCheckService.checkForDuplicate(organisationWip2);

        // Then
        assertThat(duplicates).isNotNull();
        assertThat(duplicates.getDuplicateListItems())
                .extracting(val ->
                        Triple.of(
                                Optional.ofNullable(val.getOrganisation()).map(EntityBase::getId).orElse(null),
                                Optional.ofNullable(val.getOrganisationWorkInProgress()).map(EntityBase::getId)
                                        .orElse(null),
                                val.getDuplicateForFields()))
                .containsExactlyInAnyOrder(
                        // duplicate: organisationWip1
                        Triple.of(
                                null,
                                organisationWip1.getId(),
                                Set.of(DuplicateForField.ADDRESS,
                                        DuplicateForField.EMAIL,
                                        DuplicateForField.URL)),
                        // duplicate: organisation
                        Triple.of(
                                organisation.getId(),
                                null,
                                Set.of(DuplicateForField.ADDRESS,
                                        DuplicateForField.URL))

                );
    }

    /**
     * Duplikat wird zu vorhandener Liste hinzugefügt.
     */
    @Test
    @Transactional
    void checkForDuplicate4() {
        // Given
        OrganisationWorkInProgress organisationWip1 = organisationWorkInProgressRepository.save(
                getOrganisationWorkInProgress());

        // Check for duplicates (non found but entity is saved and later updated
        DuplicateList duplicateList1 = duplicateCheckService.checkForDuplicate(organisationWip1);

        Organisation organisation = organisationRepository.save(getOrganisation());

        // create organisation work in progress 2
        OrganisationWorkInProgress organisationWip2 = organisationWorkInProgressRepository
                .save(getOrganisationWorkInProgress());

        // When
        // check for duplicates
        DuplicateList duplicates = duplicateCheckService.checkForDuplicate(organisationWip2);

        // Then
        assertThat(duplicates).isNotNull();
        assertThat(duplicates.getDuplicateListItems())
                .extracting(val ->
                        Triple.of(
                                Optional.ofNullable(val.getOrganisation()).map(EntityBase::getId).orElse(null),
                                Optional.ofNullable(val.getOrganisationWorkInProgress()).map(EntityBase::getId)
                                        .orElse(null),
                                val.getDuplicateForFields()))
                .containsExactlyInAnyOrder(
                        // duplicate: organisation
                        Triple.of(
                                organisation.getId(),
                                null,
                                Set.of(DuplicateForField.ADDRESS,
                                        DuplicateForField.URL)),


                        // duplicate: organisationWip1
                        Triple.of(
                                null,
                                organisationWip1.getId(),
                                Set.of(DuplicateForField.ADDRESS,
                                        DuplicateForField.EMAIL,
                                        DuplicateForField.URL))
                );

        duplicateList1 = duplicateListRepository.findById(duplicateList1.getId()).orElseThrow();

        assertThat(duplicateList1).isNotNull();
        assertThat(duplicateList1.getDuplicateListItems())
                .flatExtracting(
                        val -> Optional.ofNullable(val.getOrganisation()).map(EntityBase::getId).orElse(null),
                        val -> Optional.ofNullable(val.getOrganisationWorkInProgress()).map(EntityBase::getId)
                                .orElse(null),
                        DuplicateListItem::getDuplicateForFields)
                .containsExactly(
                        // duplicate: organisationWip1
                        null,
                        organisationWip2.getId(),
                        Set.of(DuplicateForField.ADDRESS,
                                DuplicateForField.EMAIL,
                                DuplicateForField.URL
                        )
                );
    }


    /**
     * Testet, dass die DuplikatListe beim Veröffentlichen der Organisation aktualisiert wird.
     */
    @Test
    @Transactional
    void checkForDuplicate5() throws ValidationException {
        // Given
        GroupRepresentation groupRepresentation = new GroupRepresentation();
        groupRepresentation.setSubGroups(List.of());

        GroupResource group = mock(GroupResource.class);
        when(group.toRepresentation()).thenReturn(groupRepresentation);
        when(group.members()).thenReturn(List.of());
        when(keycloakService.getAdminsGroupId(any(String.class))).thenReturn("123");
        when(keycloakService.getGroup(any(String.class))).thenReturn(group);
        when(keycloakService.getAdminsGroupId(anyString())).thenReturn("123");

        OrganisationWorkInProgress organisationWip1 = organisationWorkInProgressRepository.save(
                getOrganisationWorkInProgress());

        // Check for duplicates (non found but entity is saved and later updated
        DuplicateList duplicateList1 = duplicateCheckService.checkForDuplicate(organisationWip1);

        // create organisation work in progress 2
        OrganisationWorkInProgress organisationWip2 = organisationWorkInProgressRepository
                .save(getOrganisationWorkInProgress());
        // Check for duplicates (non found but entity is saved and later updated
        DuplicateList duplicateList2 = duplicateCheckService.checkForDuplicate(organisationWip2);

        // When
        Organisation publishedOrganisation =
                organisationWorkInProgressPublishService.publishOrganisationWorkInProgress(organisationWip1);

        // Then
        assertThat(duplicateListRepository.findById(duplicateList1.getId())).isEmpty();

        duplicateList2 = duplicateListRepository.findById(duplicateList2.getId()).orElseThrow();

        assertThat(duplicateList2).isNotNull();
        assertThat(duplicateList2.getDuplicateListItems())
                .flatExtracting(
                        val -> Optional.ofNullable(val.getOrganisation()).map(EntityBase::getId).orElse(null),
                        val -> Optional.ofNullable(val.getOrganisationWorkInProgress()).map(EntityBase::getId)
                                .orElse(null),
                        DuplicateListItem::getDuplicateForFields)
                .containsExactly(
                        // duplicate: published organisation
                        publishedOrganisation.getId(),
                        null,
                        Set.of(DuplicateForField.ADDRESS,
                                DuplicateForField.EMAIL,
                                DuplicateForField.URL
                        )
                );
    }

    /**
     * Organisation (Wip) mit ähnlichem namen wird als duplikat erkannt.
     */
    @Test
    void checkForDuplicate6() {
        OrganisationWorkInProgress organisation1 = organisationWorkInProgressRepository.save(
                getOrganisationWorkInProgress());
        OrganisationWorkInProgress organisation2 = getOrganisationWorkInProgress();
        organisation2.setLocationWorkInProgress(new LocationWorkInProgress());
        organisation2.setContactWorkInProgress(new ContactWorkInProgress());
        organisation2.setName(organisation2.getName() + "!");
        organisation2 = organisationWorkInProgressRepository.save(organisation2);

        DuplicateList duplicates = duplicateCheckService.checkForDuplicate(organisation2);

        assertThat(duplicates).isNotNull();
        assertThat(duplicates.getDuplicateListItems())
                .flatExtracting(val -> val.getOrganisationWorkInProgress().getId(),
                        val -> val.getOrganisationWorkInProgress().getRandomUniqueId(),
                        DuplicateListItem::getDuplicateForFields)
                .containsExactly(organisation1.getId(),
                        organisation1.getRandomUniqueId(),
                        Set.of(DuplicateForField.NAME));
    }

    /**
     * Organisation (Wip) mit komplett anderem namen wird nicht als duplikat erkannt.
     */
    @Test
    void checkForDuplicate7() {
        organisationWorkInProgressRepository.save(
                getOrganisationWorkInProgress());
        OrganisationWorkInProgress organisation2 = getOrganisationWorkInProgress();
        organisation2.setLocationWorkInProgress(new LocationWorkInProgress());
        organisation2.setContactWorkInProgress(new ContactWorkInProgress());
        organisation2.setName("Mietsolaranlagen Berlin");
        organisation2 = organisationWorkInProgressRepository.save(organisation2);

        DuplicateList duplicates = duplicateCheckService.checkForDuplicate(organisation2);

        assertThat(duplicates).isNotNull();
        assertThat(duplicates.getDuplicateListItems()).isEmpty();
    }


    private Organisation getOrganisation() {
        Organisation result = new Organisation();
        result.setName("Müllfreie Spree e. V.");
        result.setDescription("Lorem Ipsum dolor sit amet, …");
        result.setImpactArea(ImpactArea.LOCAL);

        Location location = new Location();
        result.setLocation(location);

        location.setCoordinate(factory.createPoint(new Coordinate(13.405837, 52.515607)));
        location.setUrl("http://…");
        location.setOnline(null);

        final Address address = new Address();
        location.setAddress(address);
        address.setStreet("Tucholskystraße");
        address.setStreetNo("2");
        address.setZipCode("10117");
        address.setCity("Berlin");
        address.setState("Berlin");
        address.setCountry("DE");

        com.exxeta.wpgwn.wpgwnapp.organisation.model.SocialMediaContact socialMediaContact =
                new com.exxeta.wpgwn.wpgwnapp.organisation.model.SocialMediaContact();
        result.setSocialMediaContacts(Set.of(socialMediaContact));
        socialMediaContact.setType(SocialMediaType.TWITTER);
        socialMediaContact.setContact("TwitterTestAcc");

        result.setOrganisationType(OrganisationType.ASSOCIATION);

        result.setThematicFocus(Set.of(
                ThematicFocus.getById(3),
                ThematicFocus.getById(7),
                ThematicFocus.getById(5)
        ));

        result.setSustainableDevelopmentGoals(Set.of(4L, 7L, 8L, 6L));

        Contact contact = new Contact();
        result.setContact(contact);
        contact.setEmail("kontakt@test.com");
        contact.setFirstName("firstname contact");
        contact.setLastName("lastname contact");

        result.setExternalId("ID12456");
        result.setSource(Source.IMPORT);
        result.setKeycloakGroupId("testKeyclockId");
        result.setPrivacyConsent(true);

        return result;
    }

    private OrganisationWorkInProgress getOrganisationWorkInProgress() {

        OrganisationWorkInProgress result = new OrganisationWorkInProgress();
        result.setName("Müllfreie Spree e. V. 2.0");
        result.setDescription("Lorem Ipsum dolor sit amet, …");
        result.setImpactArea(ImpactArea.LOCAL);

        LocationWorkInProgress locationWorkInProgress = new LocationWorkInProgress();
        result.setLocationWorkInProgress(locationWorkInProgress);

        locationWorkInProgress.setCoordinate(factory.createPoint(new Coordinate(13.405837, 52.515607)));
        locationWorkInProgress.setUrl("http://…");
        locationWorkInProgress.setOnline(null);

        final Address address = new Address();
        locationWorkInProgress.setAddress(address);
        address.setStreet("Tucholskystraße");
        address.setStreetNo("2");
        address.setZipCode("10117");
        address.setCity("Berlin");
        address.setState("Berlin");
        address.setCountry("DE");

        SocialMediaContact socialMediaContact = new SocialMediaContact();
        result.setSocialMediaContacts(Set.of(socialMediaContact));
        socialMediaContact.setType(SocialMediaType.TWITTER);
        socialMediaContact.setContact("TwitterTestAcc");

        result.setOrganisationType(OrganisationType.ASSOCIATION);

        result.setThematicFocus(Set.of(
                ThematicFocus.getById(3),
                ThematicFocus.getById(7),
                ThematicFocus.getById(5)
        ));

        result.setSustainableDevelopmentGoals(Set.of(4L, 7L, 8L, 6L));

        ContactWorkInProgress contactWorkInProgress = new ContactWorkInProgress();
        result.setContactWorkInProgress(contactWorkInProgress);
        contactWorkInProgress.setEmail("kontakt23@test.com");
        contactWorkInProgress.setLastName("Tester");
        contactWorkInProgress.setFirstName("Alex");

        result.setExternalId("ID12456");
        result.setSource(Source.IMPORT);
        result.setRandomUniqueId(UUID.randomUUID());
        result.setRandomIdGenerationTime(Instant.now(clock));
        result.setStatus(OrganisationStatus.RUECKFRAGE_CLEARING);
        result.setPrivacyConsent(true);
        result.setKeycloakGroupId("test");

        return result;

    }
}
