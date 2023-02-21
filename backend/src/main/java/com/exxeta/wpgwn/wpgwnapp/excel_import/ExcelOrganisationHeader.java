package com.exxeta.wpgwn.wpgwnapp.excel_import;

import java.util.Arrays;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import org.apache.poi.ss.usermodel.Cell;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.core.convert.ConversionService;
import org.springframework.core.convert.TypeDescriptor;
import org.springframework.core.convert.support.DefaultConversionService;
import org.springframework.util.StringUtils;

import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.SocialMediaContact;
import com.exxeta.wpgwn.wpgwnapp.shared.IWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Address;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ContactWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ImpactArea;
import com.exxeta.wpgwn.wpgwnapp.shared.model.LocationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.SocialMediaType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ThematicFocus;

@Slf4j
public enum ExcelOrganisationHeader implements ExcelHeader {

    /* ORGANISATION - START */

    NAME(0, "Organisation", "Name") {
        @Override
        public void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                         Cell cell) {
            final String cleanedString = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cleanedString)) {
                organisationWorkInProgress.setName(cleanedString);
            }
        }
    },
    DESCRIPTION(1, "", "Beschreibung") {
        @Override
        public void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                         Cell cell) {
            final String cleanedString = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cleanedString)) {
                organisationWorkInProgress.setDescription(cleanedString);
            }
        }
    },
    ADDRESS_URL(2, "", "Url") {
        @Override
        public void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                         Cell cell) {
            final LocationWorkInProgress locationWorkInProgress = getLocation(organisationWorkInProgress);
            final String cleanedString = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cleanedString) && ExcelHeader.isValidUrl(cell.getStringCellValue())) {
                locationWorkInProgress.setUrl(cleanedString);
            }
        }
    },
    IMPACT_AREA(3, "", "Wirkungsraum") {
        @Override
        public void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                         Cell cell) {
            final String cleanedString = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cleanedString)) {
                final ImpactArea impactArea = ExcelHeader.getImpactArea(cleanedString);
                organisationWorkInProgress.setImpactArea(impactArea);
            }
        }
    },
    ADDRESS_ZIPCODE(4, "", "Plz") {
        @Override
        public void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                         Cell cell) {
            final Address address = getAddress(organisationWorkInProgress);
            final String cleanedString = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cleanedString)) {
                address.setZipCode(cleanedString);
            }
        }
    },
    ADDRESS_CITY(5, "", "Ort") {
        @Override
        public void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                         Cell cell) {
            final Address address = getAddress(organisationWorkInProgress);
            final String cleanedString = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cleanedString)) {
                address.setCity(cleanedString);
            }
        }
    },
    ADDRESS_STREET(6, "", "Straße") {
        @Override
        public void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                         Cell cell) {
            final Address address = getAddress(organisationWorkInProgress);
            final String cleanedString = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cleanedString)) {
                address.setStreet(cleanedString);
            }
        }
    },
    ADDRESS_STREET_NR(7, "", "Hausnummer") {
        @Override
        public void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                         Cell cell) {
            final Address address = getAddress(organisationWorkInProgress);
            final String cleanedString = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cleanedString)) {
                address.setStreetNo(cleanedString);
            }
        }
    },
    ADDRESS_COUNTRY(8, "", "Land") {
        @Override
        public void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                         Cell cell) {
            final Address address = getAddress(organisationWorkInProgress);
            final String cleanedString = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cleanedString)) {
                address.setCountry(cleanedString);
            }
        }
    },
    ADDRESS_STATE(9, "", "Bundesland") {
        @Override
        public void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                         Cell cell) {
            final Address address = getAddress(organisationWorkInProgress);
            final String cleanedString = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cleanedString)) {
                address.setState(cleanedString);
            }
        }
    },
    COORDINATE_LAT(10, "Koordinaten (Lat, Lng)", "Latitude") {
        @Override
        public void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                         Cell cell) {
            final String cleanedString = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cleanedString)) {
                final Coordinate coordinate = getCoordinate(organisationWorkInProgress);
                try {
                    double doubleValue = Double.parseDouble(cleanedString);
                    coordinate.setY(doubleValue);
                } catch (NumberFormatException e) {
                    log.error("error parsing number: [{}]", cleanedString, e);
                }
            }
        }
    },
    COORDINATE_LNG(11, "", "Longitude") {
        @Override
        public void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                         Cell cell) {
            final String cleanedString = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cleanedString)) {
                final Coordinate coordinate = getCoordinate(organisationWorkInProgress);
                try {
                    double doubleValue = Double.parseDouble(cleanedString);
                    coordinate.setX(doubleValue);
                } catch (NumberFormatException e) {
                    log.error("error parsing number: [{}]", cleanedString, e);
                }
            }
        }
    },
    SOCIAL_MEDIA_FACEBOOK(12, "", "Facebook") {
        @Override
        public void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                         Cell cell) {
            final Set<SocialMediaContact> socialMediaContacts = organisationWorkInProgress.getSocialMediaContacts();
            final String cellValue = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cellValue) && ExcelHeader.isValidUrl(cell.getStringCellValue())) {
                SocialMediaContact socialMediaContact = new SocialMediaContact(SocialMediaType.FACEBOOK, cellValue);
                socialMediaContact.setOrganisationWorkInProgress(organisationWorkInProgress);
                socialMediaContacts.add(socialMediaContact);
            }
        }
    },
    SOCIAL_MEDIA_TWITTER(13, "", "Twitter") {
        @Override
        public void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                         Cell cell) {
            final Set<SocialMediaContact> socialMediaContacts = organisationWorkInProgress.getSocialMediaContacts();
            final String cellValue = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cellValue) && ExcelHeader.isValidUrl(cell.getStringCellValue())) {
                SocialMediaContact socialMediaContact = new SocialMediaContact(SocialMediaType.TWITTER, cellValue);
                socialMediaContact.setOrganisationWorkInProgress(organisationWorkInProgress);
                socialMediaContacts.add(socialMediaContact);
            }
        }
    },
    SOCIAL_MEDIA_INSTAGRAM(14, "", "Instagram") {
        @Override
        public void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                         Cell cell) {
            final Set<SocialMediaContact> socialMediaContacts = organisationWorkInProgress.getSocialMediaContacts();
            final String cellValue = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cellValue) && ExcelHeader.isValidUrl(cell.getStringCellValue())) {
                SocialMediaContact socialMediaContact = new SocialMediaContact(SocialMediaType.INSTAGRAM, cellValue);
                socialMediaContact.setOrganisationWorkInProgress(organisationWorkInProgress);
                socialMediaContacts.add(socialMediaContact);
            }
        }
    },
    SOCIAL_MEDIA_TIKTOK(15, "", "TikTok") {
        @Override
        public void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                         Cell cell) {
            final Set<SocialMediaContact> socialMediaContacts = organisationWorkInProgress.getSocialMediaContacts();
            String cellValue = cell.getStringCellValue();
            if (StringUtils.hasText(cellValue) && ExcelHeader.isValidUrl(cell.getStringCellValue())) {
                SocialMediaContact socialMediaContact = new SocialMediaContact(SocialMediaType.TIKTOK, cellValue);
                socialMediaContact.setOrganisationWorkInProgress(organisationWorkInProgress);
                socialMediaContacts.add(socialMediaContact);
            }
        }
    },
    SOCIAL_MEDIA_LINKEDIN(16, "", "LinkedIn") {
        @Override
        public void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                         Cell cell) {
            final Set<SocialMediaContact> socialMediaContacts = organisationWorkInProgress.getSocialMediaContacts();
            final String cleanedString = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cleanedString) && ExcelHeader.isValidUrl(cell.getStringCellValue())) {
                SocialMediaContact socialMediaContact = new SocialMediaContact(SocialMediaType.LINKEDIN, cleanedString);
                socialMediaContact.setOrganisationWorkInProgress(organisationWorkInProgress);
                socialMediaContacts.add(socialMediaContact);
            }
        }
    },
    ORGANISATION_TYPE(17, "", "Typ der Organisation") {
        @Override
        public void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                         Cell cell) {
            final String cleanedString = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cleanedString)) {
                OrganisationType organisationType = getOrganisationType(cleanedString);
                organisationWorkInProgress.setOrganisationType(organisationType);
            }
        }
    },
    THEMATIC_FOCUS(18, "", "Themenfelder") {
        @Override
        public void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                         Cell cell) {
            final String cleanedString = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cleanedString)) {
                Set<ThematicFocus> thematicFocusSet =
                        ExcelHeader.getThematicFocusSetFromValue(cleanedString);
                organisationWorkInProgress.setThematicFocus(thematicFocusSet);
            }
        }
    },
    SUSTAINABLE_DEVELOPMENT_GOALS(19, "", "SDG") {
        @Override
        public void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                         Cell cell) {
            if (StringUtils.hasText(cell.getStringCellValue())) {
                final String cleanedString = ExcelHeader.getCleanedString(cell);
                if (StringUtils.hasText(cleanedString)) {
                    Set<Long> sdgSet =
                            (Set<Long>) CONVERSION_SERVICE.convert(cleanedString,
                                    TypeDescriptor.valueOf(String.class),
                                    TypeDescriptor.collection(Set.class, TypeDescriptor.valueOf(Long.class)));
                    organisationWorkInProgress.setSustainableDevelopmentGoals(sdgSet);
                }
            }
        }
    },
    CONTACT_EMAIL(20, "", "E-Mail") {
        @Override
        public void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                         Cell cell) {
            final ContactWorkInProgress contactWorkInProgress = getContact(organisationWorkInProgress);
            final String stringCellValue = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(stringCellValue)) {
                contactWorkInProgress.setEmail(stringCellValue);
            }
        }
    },
    EXTERNAL_ID(21, "", "externe ID") {
        @Override
        public void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                         Cell cell) {
            final String stringCellValue = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(stringCellValue)) {
                organisationWorkInProgress.setExternalId(stringCellValue);
            }
        }
    };

    /* ORGANISATION - END */

    private final String[] columnName;
    private final int columnIndex;

    private static final GeometryFactory GEOMETRY_FACTORY = new GeometryFactory();

    private static final ConversionService CONVERSION_SERVICE = new DefaultConversionService();

    ExcelOrganisationHeader(int columnIndex, String... columnName) {
        this.columnName = columnName;
        this.columnIndex = columnIndex;
    }

    private static LocationWorkInProgress getLocation(OrganisationWorkInProgress organisationWorkInProgress) {
        final LocationWorkInProgress locationWorkInProgress;
        if (Objects.isNull(organisationWorkInProgress.getLocationWorkInProgress())) {
            locationWorkInProgress = new LocationWorkInProgress();
            organisationWorkInProgress.setLocationWorkInProgress(locationWorkInProgress);
        } else {
            locationWorkInProgress = organisationWorkInProgress.getLocationWorkInProgress();
        }
        return locationWorkInProgress;
    }

    private static OrganisationType getOrganisationType(String stringCellValue) {
        String value = stringCellValue.trim().toUpperCase();
        try {
            return OrganisationType.valueOf(value);
        } catch (IllegalArgumentException iae) {
            switch (value) {
                case "BILDUNGSEINRICHTUNG": return OrganisationType.EDUCATION;
                case "BUND": return OrganisationType.FEDERAL;
                case "BUNDESLAND": return OrganisationType.STATE;
                case "FINANZSEKTOR": return OrganisationType.FINANCE;
                case "GEWERKSCHAFT": return OrganisationType.UNION;
                case "RELIGIONSGEMEINSCHAFT": return OrganisationType.RELIGION;
                case "KOMMUNE": return OrganisationType.MUNICIPALITY;
                case "KULTUREINRICHTUNG": return OrganisationType.CULTURAL;
                case "PARTEI": return OrganisationType.PARTY;
                case "SPORTVEREIN": return OrganisationType.SPORTS_CLUB;
                case "STIFTUNG": return OrganisationType.FOUNDATION;
                case "VERBAND/ NICHTREGIERUNGSORGANISATION": return OrganisationType.NON_GOVERNMENT_ORGANISATION;
                case "VEREIN/ INITIATIVE": return OrganisationType.ASSOCIATION;
                case "WIRTSCHAFT": return OrganisationType.BUSINESS;
                case "WISSENSCHAFT": return OrganisationType.SCIENCE;
                case "SONSTIGES": return OrganisationType.OTHER;
                default: throw iae;
            }
        }
    }

    private static Address getAddress(OrganisationWorkInProgress organisationWorkInProgress) {
        final LocationWorkInProgress locationWorkInProgress = getLocation(organisationWorkInProgress);
        final Address address;
        if (Objects.isNull(organisationWorkInProgress.getLocationWorkInProgress().getAddress())) {
            address = new Address();
            locationWorkInProgress.setAddress(address);
        } else {
            address = locationWorkInProgress.getAddress();
        }
        return address;
    }

    private static Coordinate getCoordinate(OrganisationWorkInProgress organisationWorkInProgress) {
        final LocationWorkInProgress locationWorkInProgress = getLocation(organisationWorkInProgress);
        final Point point;
        if (Objects.isNull(organisationWorkInProgress.getLocationWorkInProgress().getCoordinate())) {
            point = GEOMETRY_FACTORY.createPoint(new Coordinate(0, 0));
            locationWorkInProgress.setCoordinate(point);
        } else {
            point = locationWorkInProgress.getCoordinate();
        }
        return point.getCoordinate();
    }

    private static ContactWorkInProgress getContact(OrganisationWorkInProgress organisationWorkInProgress) {
        final ContactWorkInProgress contactWorkInProgress;
        if (Objects.isNull(organisationWorkInProgress.getContactWorkInProgress())) {
            contactWorkInProgress = new ContactWorkInProgress();
            organisationWorkInProgress.setContactWorkInProgress(contactWorkInProgress);
        } else {
            contactWorkInProgress = organisationWorkInProgress.getContactWorkInProgress();
        }
        return contactWorkInProgress;
    }

    public static Optional<ExcelOrganisationHeader> byColumnIndex(int columnIndex) {
        return Arrays.stream(values())
                .filter(header -> header.columnIndex == columnIndex)
                .findFirst();
    }

    /**
     * Validiert, dass die übergebene {@link Cell} genau den Wert des Headers erhält.
     *
     * @param cell   Zelle, die überprüft werden soll.
     * @param rowNum
     * @throws IllegalArgumentException falls die Zelle nicht den korrekten Inhalt hat.
     */
    public void validateCellEqualsHeader(Cell cell, int rowNum) {
        final String cellValue = cell.getStringCellValue();
        if (columnName.length > rowNum
                && !Objects.equals(columnName[rowNum], cellValue)) {
            throw new IllegalArgumentException(
                    "Error validating header [" + rowNum + ", " + cell.getColumnIndex()
                            + "]:\nexpected: [" + columnName[rowNum] + "]\nactual: [" + cellValue + "]");
        }
    }

    /**
     * Setzt den Wert einer Property eines {@link OrganisationWorkInProgress} Objekts in Abhängigkeit des Headers, zu dem die Zelle zugeordnet ist.
     * Das Object wird in-place verändert, daher gibt es keinen Rückgabewert.
     *
     * @param organisationWorkInProgress Das Objekt, dessen Wert gesetzt werden soll.
     * @param cell                       Die Excel-Cell, die den zu setzenden Wert enthält.
     */
    public abstract void setValueOfOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                              Cell cell);

    @Override
    public <T extends IWorkInProgress> void setValueOfWorkInProgressObject(T workInProgressObject, Cell cell) {
        if (workInProgressObject instanceof OrganisationWorkInProgress) {
            setValueOfOrganisationWorkInProgress((OrganisationWorkInProgress) workInProgressObject, cell);
        }
    }
}
