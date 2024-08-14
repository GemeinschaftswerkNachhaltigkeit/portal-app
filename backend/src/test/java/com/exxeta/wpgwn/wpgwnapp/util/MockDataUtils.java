package com.exxeta.wpgwn.wpgwnapp.util;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.keycloak.representations.idm.UserRepresentation;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;

import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.email_opt_out.model.EmailOptOutEntry;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.Offer;
import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.OfferCategory;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembership;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Address;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Contact;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ContactWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ImpactArea;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Location;
import com.exxeta.wpgwn.wpgwnapp.shared.model.LocationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationStatus;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.SocialMediaType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Source;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ThematicFocus;

public class MockDataUtils {

    private static final GeometryFactory factory = new GeometryFactory();

    public static ActivityWorkInProgress getActivityWorkInProgress(Clock clock) {
        ActivityWorkInProgress result = new ActivityWorkInProgress();
        result.setName("Müllfreie Spree e. V. Familienfest");
        result.setDescription("Lorem Ipsum dolor sit amet, …");
        result.setImpactArea(ImpactArea.LOCAL);

        LocationWorkInProgress location = new LocationWorkInProgress();
        result.setLocationWorkInProgress(location);

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

        com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.SocialMediaContact socialMediaContact =
                new com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.SocialMediaContact();
        result.setSocialMediaContacts(Set.of(socialMediaContact));
        socialMediaContact.setType(SocialMediaType.TWITTER);
        socialMediaContact.setContact("TwitterTestAcc");

        ContactWorkInProgress contact = new ContactWorkInProgress();
        result.setContactWorkInProgress(contact);
        contact.setEmail("kontakt@test.com");
        contact.setFirstName("firstname contact");
        contact.setLastName("lastname contact");

        result.setRandomUniqueId(UUID.randomUUID());
        result.setRandomIdGenerationTime(Instant.now(clock));
        result.setExternalId("ID12456");
        result.setSource(Source.IMPORT);

        return result;
    }

    public static Activity getActivity() {
        Activity result = new Activity();
        result.setName("Müllfreie Spree e. V. Familienfest");
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

        com.exxeta.wpgwn.wpgwnapp.activity.model.SocialMediaContact socialMediaContact =
                new com.exxeta.wpgwn.wpgwnapp.activity.model.SocialMediaContact();
        result.setSocialMediaContacts(Set.of(socialMediaContact));
        socialMediaContact.setType(SocialMediaType.TWITTER);
        socialMediaContact.setContact("TwitterTestAcc");


        Contact contact = new Contact();
        result.setContact(contact);
        contact.setEmail("kontakt@test.com");
        contact.setFirstName("firstname contact");
        contact.setLastName("lastname contact");

        result.setExternalId("ID12456");
        result.setSource(Source.IMPORT);

        return result;
    }

    public static OrganisationWorkInProgress getOrganisationWorkInProgress() {
        OrganisationWorkInProgress result = new OrganisationWorkInProgress();
        result.setName("Müllfreie Spree e. V.");
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

        result.setOrganisationType(OrganisationType.ASSOCIATION);

        result.setThematicFocus(Set.of(
                ThematicFocus.getById(3),
                ThematicFocus.getById(7),
                ThematicFocus.getById(5)
        ));

        result.setSustainableDevelopmentGoals(Set.of(4L, 7L, 8L, 6L));

        ContactWorkInProgress contactWorkInProgress = new ContactWorkInProgress();
        result.setContactWorkInProgress(contactWorkInProgress);
        contactWorkInProgress.setEmail("test@exxeta.com");
        contactWorkInProgress.setLastName("Tester");
        contactWorkInProgress.setFirstName("Alex");

        result.setSource(Source.LANDING_PAGE);
        result.setStatus(OrganisationStatus.NEW);
        result.setContactWorkInProgress(contactWorkInProgress);
        result.setRandomUniqueId(UUID.randomUUID());
        return result;
    }

    public static Organisation getOrganisation() {
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

    public static UserRepresentation getUserRepresentation(String email) {
        UserRepresentation result = new UserRepresentation();
        result.setId("1");
        result.setGroups(List.of());
        result.setEmail(email);
        result.setUsername(email);
        result.setAttributes(new HashMap<>());
        result.setFirstName("Torsten");
        result.setLastName("Testreich");
        return result;
    }

    public static OrganisationMembership organisationMembership(String email, Organisation organisation, Clock clock) {
        OrganisationMembership result = new OrganisationMembership();
        result.setEmail(email);
        result.setFirstName("Max");
        result.setLastName("Mustermann");
        result.setCreatedNewUser(false);
        result.setOrganisation(organisation);
        result.setRandomUniqueId(UUID.randomUUID());
        result.setRandomIdGenerationTime(Instant.now(clock));
        return result;
    }

    public static EmailOptOutEntry getEmailOptOutEntry(String email, Clock clock) {
        EmailOptOutEntry result = new EmailOptOutEntry();
        result.setEmail(email);
        result.setRandomUniqueId(UUID.randomUUID());
        result.setRandomIdGenerationTime(Instant.now(clock));
        return result;
    }

    public static Offer createTestOffer(Organisation organisation) {
        Offer offer = new Offer();
        offer.setOrganisation(organisation);
        offer.setName("Test Angebot");
        offer.setFeatured(false);
        offer.setDescription("Beschreibung meines Testangebots");
        offer.setThematicFocus(Set.of(ThematicFocus.PEACE, ThematicFocus.CIRCULAR_ECONOMY));
        offer.setOfferCategory(OfferCategory.JOBS);
        Contact contact = new Contact();
        contact.setFirstName("Ansprechpartner Vorname");
        contact.setLastName("Ansprechpartner Nachname");
        contact.setEmail("Ansprechpartner_email@test.io");
        offer.setContact(contact);

        return offer;
    }

    public static WpgwnProperties getWpgwnProperties(boolean sdgRequired) {
        return

                new WpgwnProperties(0L, null, null, "null", "null",
                        "email/organisation-work-in-progress/privacy-consent/organisation-privacy-consent.html",
                        "null", "test",
                        "test",
                        new WpgwnProperties.ReminderEmail(2,
                                Duration.of(2, ChronoUnit.SECONDS),
                                "* 6 * * * * *",
                                100),
                        new WpgwnProperties.CronProperty("* 6 * * * * *"),
                        new WpgwnProperties.Duplicate(0.7),
                        new WpgwnProperties.ContactInvite(Duration.of(42, ChronoUnit.DAYS)),
                        new WpgwnProperties.OrganisationMembership(Duration.of(42, ChronoUnit.DAYS), 12),
                        new WpgwnProperties.MarketplaceProperties(10, 10),
                        new WpgwnProperties.DanProperties(50, sdgRequired, Set.of(13L))
                );
    }
}
