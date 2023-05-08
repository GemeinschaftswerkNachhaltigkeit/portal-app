package com.exxeta.wpgwn.wpgwnapp.excel_import;

import java.time.LocalDateTime;
import java.time.Month;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Set;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;

import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.SocialMediaContact;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Address;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ContactWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ImpactArea;
import com.exxeta.wpgwn.wpgwnapp.shared.model.LocationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Period;
import com.exxeta.wpgwn.wpgwnapp.shared.model.SocialMediaType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Source;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ThematicFocus;

import static org.assertj.core.api.Assertions.assertThat;

public class ExcelImportTestHelper {

    public final static GeometryFactory GEOMETRY_FACTORY = new GeometryFactory();

    public static OrganisationWorkInProgress getOrga1() {
        OrganisationWorkInProgress result = new OrganisationWorkInProgress();
        result.setName("Müllfreie Spree e. V.");
        result.setDescription("Lorem Ipsum dolor sit amet, …");
        result.setImpactArea(ImpactArea.LOCAL);

        LocationWorkInProgress locationWorkInProgress = new LocationWorkInProgress();
        result.setLocationWorkInProgress(locationWorkInProgress);
        locationWorkInProgress.setCoordinate(GEOMETRY_FACTORY.createPoint(new Coordinate(13.405837,52.515607)));
        locationWorkInProgress.setUrl("http://test.de");
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
        socialMediaContact.setContact("https://twotter.com/TwitterTestAcc");

        result.setOrganisationType(OrganisationType.ASSOCIATION);

        result.setThematicFocus(Set.of(
                ThematicFocus.getById(3),
                ThematicFocus.getById(7),
                ThematicFocus.getById(5)
        ));

        result.setSustainableDevelopmentGoals(Set.of(4L, 7L, 8L, 6L));

        ContactWorkInProgress contactWorkInProgress = new ContactWorkInProgress();
        result.setContactWorkInProgress(contactWorkInProgress);
        contactWorkInProgress.setEmail("kontakt@test.com");

        result.setExternalId("ID12456");
        result.setActivitiesWorkInProgress(Set.of(getAct1()));
        result.setSource(Source.IMPORT);

        return result;
    }

    public static ActivityWorkInProgress getAct1() {
        ActivityWorkInProgress result = new ActivityWorkInProgress();
        result.setName("Müllfreie Spree Konferenz");
        result.setDescription("Konferenz zum Theme müllfreie Spree");
        result.setThematicFocus(Set.of(
                ThematicFocus.getById(5),
                ThematicFocus.getById(7),
                ThematicFocus.getById(8),
                ThematicFocus.getById(9)
        ));

        result.setSustainableDevelopmentGoals(Set.of(4L, 5L, 7L));

        LocationWorkInProgress locationWorkInProgress = new LocationWorkInProgress();
        result.setLocationWorkInProgress(locationWorkInProgress);
        locationWorkInProgress.setUrl("https://free-the-spree.de");
        locationWorkInProgress.setOnline(null);

        final Address address = new Address();
        locationWorkInProgress.setAddress(address);
        address.setStreet("Tucholskystraße");
        address.setStreetNo("2");
        address.setZipCode("10117");
        address.setCity("Berlin");
        address.setState("Berlin");
        address.setCountry("DE");

        result.setSocialMediaContacts(Set.of());
        result.setImpactArea(ImpactArea.LOCAL);
        result.setActivityType(ActivityType.EVENT);

        Period period = new Period();
        result.setPeriod(period);
        period.setStart(ZonedDateTime.of(LocalDateTime.of(2022, Month.AUGUST, 18, 0,0),
                ZoneId.systemDefault()).toInstant());
        period.setEnd(ZonedDateTime.of(LocalDateTime.of(2022, Month.AUGUST, 19, 0,0),
                ZoneId.systemDefault()).toInstant());

        ContactWorkInProgress contactWorkInProgress = new ContactWorkInProgress();
        result.setContactWorkInProgress(contactWorkInProgress);
        contactWorkInProgress.setFirstName("Enna");
        contactWorkInProgress.setLastName("Kröger");
        contactWorkInProgress.setPosition("Nachhaltigkeitsmanagerin");
        contactWorkInProgress.setEmail("nn@free-the-spree.de");
        contactWorkInProgress.setPhone("+49 1234 5678");

        result.setSource(Source.IMPORT);
        result.setExternalId("4711");

        return result;
    }

    public static OrganisationWorkInProgress getOrga2() {
        OrganisationWorkInProgress result = new OrganisationWorkInProgress();
        result.setName("Test Daten");
        result.setDescription("Das ist nur ein Test und mehr nicht");
        result.setImpactArea(ImpactArea.COUNTRY);
        result.setThematicFocus(Set.of());

        LocationWorkInProgress locationWorkInProgress = new LocationWorkInProgress();
        locationWorkInProgress.setCoordinate(GEOMETRY_FACTORY.createPoint(new Coordinate(13.412837,52.523607)));
        result.setLocationWorkInProgress(locationWorkInProgress);

        final Address address = new Address();
        locationWorkInProgress.setAddress(address);
        address.setStreet("Föplstr.");
        address.setStreetNo("3");
        address.setZipCode("41113");
        address.setCity("Leipzig");
        address.setState("Sachsen");
        address.setCountry("DE");

        locationWorkInProgress.setUrl("https://exxeta.de");

        result.setSustainableDevelopmentGoals(Set.of(1L, 2L, 3L));

        ContactWorkInProgress contactWorkInProgress = new ContactWorkInProgress();
        result.setContactWorkInProgress(contactWorkInProgress);
        contactWorkInProgress.setEmail("kontakt@EXXETA.com");

        result.setExternalId("ID98765");

        result.setActivitiesWorkInProgress(Set.of());
        result.setSource(Source.IMPORT);

        return result;
    }

    public static void compareOrganisationValues(OrganisationWorkInProgress expected, OrganisationWorkInProgress actual) {
        assertThat(actual.getName()).isEqualTo(expected.getName());
        assertThat(actual.getDescription()).isEqualTo(expected.getDescription());
        assertThat(actual.getImpactArea()).isEqualTo(expected.getImpactArea());

        final LocationWorkInProgress expectedLocationWorkInProgress = expected.getLocationWorkInProgress();
        final LocationWorkInProgress actualLocationWorkInProgress = actual.getLocationWorkInProgress();
        compareLocationValues(expectedLocationWorkInProgress, actualLocationWorkInProgress);

        compareOrganizationSocialMediaContactSets(expected.getSocialMediaContacts(), actual.getSocialMediaContacts());
        assertThat(actual.getOrganisationType()).isEqualTo(expected.getOrganisationType());
        assertThat(actual.getThematicFocus()).isEqualTo(expected.getThematicFocus());
        assertThat(actual.getSustainableDevelopmentGoals()).isEqualTo(expected.getSustainableDevelopmentGoals());

        final ContactWorkInProgress actualContactWorkInProgress = actual.getContactWorkInProgress();
        final ContactWorkInProgress expectedContactWorkInProgress = expected.getContactWorkInProgress();
        compareContactValues(expectedContactWorkInProgress, actualContactWorkInProgress);

        assertThat(actual.getExternalId()).isEqualTo(expected.getExternalId());
        assertThat(actual.getSource()).isEqualTo(expected.getSource());
        assertThat(actual.getActivitiesWorkInProgress().size()).isEqualTo(expected.getActivitiesWorkInProgress().size());

        if (actual.getActivitiesWorkInProgress().size() == 1) {
            final ActivityWorkInProgress actualActivity = actual.getActivitiesWorkInProgress().iterator().next();
            final ActivityWorkInProgress expectedActivity = expected.getActivitiesWorkInProgress().iterator().next();
            compareActivityValues(expectedActivity, actualActivity);
        }
    }

    public static void compareActivityValues(ActivityWorkInProgress expected, ActivityWorkInProgress actual) {
        assertThat(actual.getName()).isEqualTo(expected.getName());
        assertThat(actual.getDescription()).isEqualTo(expected.getDescription());
        assertThat(actual.getThematicFocus()).isEqualTo(expected.getThematicFocus());
        assertThat(actual.getSustainableDevelopmentGoals()).isEqualTo(expected.getSustainableDevelopmentGoals());

        final LocationWorkInProgress expectedLocationWorkInProgress = expected.getLocationWorkInProgress();
        final LocationWorkInProgress actualLocationWorkInProgress = actual.getLocationWorkInProgress();
        compareLocationValues(expectedLocationWorkInProgress, actualLocationWorkInProgress);

        compareActivitySocialMediaContactSets(expected.getSocialMediaContacts(), actual.getSocialMediaContacts());
        assertThat(actual.getImpactArea()).isEqualTo(expected.getImpactArea());
        assertThat(actual.getActivityType()).isEqualTo(expected.getActivityType());

        final Period expectedPeriod = expected.getPeriod();
        final Period actualPeriod = actual.getPeriod();
        assertThat(expectedPeriod.getStart()).isEqualTo(actualPeriod.getStart());
        assertThat(expectedPeriod.getEnd()).isEqualTo(actualPeriod.getEnd());

        final ContactWorkInProgress actualContactWorkInProgress = actual.getContactWorkInProgress();
        final ContactWorkInProgress expectedContactWorkInProgress = expected.getContactWorkInProgress();
        compareContactValues(expectedContactWorkInProgress, actualContactWorkInProgress);

        assertThat(actual.getSource()).isEqualTo(expected.getSource());
        assertThat(actual.getExternalId()).isEqualTo(expected.getExternalId());
    }

    public static void compareLocationValues(LocationWorkInProgress expected, LocationWorkInProgress actual) {
        assertThat(actual.getUrl()).isEqualTo(expected.getUrl());
        assertThat(actual.getOnline()).isEqualTo(expected.getOnline());

        final Point expectedCoordinate = expected.getCoordinate();
        final Point actualCoordinate = actual.getCoordinate();

        assertThat(actualCoordinate).isEqualTo(expectedCoordinate);

        final Address expectedAddress = expected.getAddress();
        final Address actualAddress = actual.getAddress();

        compareAddressValues(expectedAddress, actualAddress);
    }

    public static void compareAddressValues(Address expected, Address actual) {
        assertThat(actual.getStreet()).isEqualTo(expected.getStreet());
        assertThat(actual.getStreetNo()).isEqualTo(expected.getStreetNo());
        assertThat(actual.getZipCode()).isEqualTo(expected.getZipCode());
        assertThat(actual.getCity()).isEqualTo(expected.getCity());
        assertThat(actual.getState()).isEqualTo(expected.getState());
        assertThat(actual.getCountry()).isEqualTo(expected.getCountry());
    }

    public static void compareOrganizationSocialMediaContactSets(Set<SocialMediaContact> expected, Set<SocialMediaContact> actual) {
        assertThat(actual.size()).isEqualTo(expected.size());

        actual.forEach(smcAct -> {
            assertThat(expected).anyMatch(smcExp -> compareOrganizationSocialMediaContacts(smcExp, smcAct));
        });
    }

    public static boolean compareOrganizationSocialMediaContacts(SocialMediaContact expected, SocialMediaContact actual) {

        return expected.getContact().equals(actual.getContact())
                && expected.getType().equals(actual.getType());
    }

    public static void compareActivitySocialMediaContactSets(Set<com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.SocialMediaContact> expected, Set<com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.SocialMediaContact> actual) {
        assertThat(actual.size()).isEqualTo(expected.size());

        actual.forEach(smcAct -> {
            assertThat(expected).anyMatch(smcExp -> compareActivitySocialMediaContacts(smcExp, smcAct));
        });
    }

    public static boolean compareActivitySocialMediaContacts(com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.SocialMediaContact expected, com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.SocialMediaContact actual) {

        return expected.getContact().equals(actual.getContact())
                && expected.getType().equals(actual.getType());
    }

    public static void compareContactValues(ContactWorkInProgress expected, ContactWorkInProgress actual) {
        assertThat(actual.getEmail()).isEqualTo(expected.getEmail());
        assertThat(actual.getFirstName()).isEqualTo(expected.getFirstName());
        assertThat(actual.getLastName()).isEqualTo(expected.getLastName());
        assertThat(actual.getPosition()).isEqualTo(expected.getPosition());
        assertThat(actual.getPhone()).isEqualTo(expected.getPhone());
        assertThat(actual.getImage()).isEqualTo(expected.getImage());
    }
}
