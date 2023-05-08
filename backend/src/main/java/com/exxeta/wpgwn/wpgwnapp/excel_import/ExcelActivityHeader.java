package com.exxeta.wpgwn.wpgwnapp.excel_import;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.core.convert.ConversionService;
import org.springframework.core.convert.TypeDescriptor;
import org.springframework.core.convert.support.DefaultConversionService;
import org.springframework.util.StringUtils;

import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.SocialMediaContact;
import com.exxeta.wpgwn.wpgwnapp.shared.IWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Address;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ContactWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ImpactArea;
import com.exxeta.wpgwn.wpgwnapp.shared.model.LocationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Period;
import com.exxeta.wpgwn.wpgwnapp.shared.model.SocialMediaType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ThematicFocus;

@Slf4j
public enum ExcelActivityHeader implements ExcelHeader {

    /* ACTIVITY - START */

    TITLE(22, "Aktivität", "Titel") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            activityWorkInProgress.setName(cell.getStringCellValue());
        }
    },
    DESCRIPTION(23, "", "Beschreibung") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            activityWorkInProgress.setDescription(cell.getStringCellValue());
        }
    },
    THEMATIC_FOCUS(24, "", "Themenfelder") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            try {
                Set<ThematicFocus> thematicFocusSet = ExcelHeader.getThematicFocusSetFromValue(cell.getStringCellValue());
                activityWorkInProgress.setThematicFocus(thematicFocusSet);
            } catch (Exception e) {
                log.error("Error parsing [THEMATIC_FOCUS] value [{}]", cell.getStringCellValue());
            }
        }
    },
    SUSTAINABLE_DEVELOPMENT_GOALS(25, "", "SDG") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final String cleanedString = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cleanedString)) {
                final Set<Long> numbers =
                        (Set<Long>) CONVERSION_SERVICE.convert(cleanedString, TypeDescriptor.valueOf(String.class),
                                TypeDescriptor.collection(Set.class, TypeDescriptor.valueOf(Long.class)));
                activityWorkInProgress.setSustainableDevelopmentGoals(numbers);
            }
        }
    },
    IS_ONLINE(26, "", "Online") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final String stringCellValue = cell.getStringCellValue();
            final LocationWorkInProgress locationWorkInProgress = getLocation(activityWorkInProgress);
            locationWorkInProgress.setOnline(getIsOnline(stringCellValue));
        }
    },
    ADDRESS_ZIPCODE(27, "", "Plz") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final Address address = getAddress(activityWorkInProgress);
            address.setZipCode(cell.getStringCellValue());
        }
    },
    ADDRESS_CITY(28, "", "Ort") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final Address address = getAddress(activityWorkInProgress);
            address.setCity(cell.getStringCellValue());
        }
    },
    ADDRESS_STREET(29, "", "Straße") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final Address address = getAddress(activityWorkInProgress);
            address.setStreet(cell.getStringCellValue());
        }
    },
    ADDRESS_STREET_NR(30, "", "Hausnummer") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final Address address = getAddress(activityWorkInProgress);
            address.setStreetNo(cell.getStringCellValue());
        }
    },
    ADDRESS_COUNTRY(31, "", "Land") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final Address address = getAddress(activityWorkInProgress);
            address.setCountry(cell.getStringCellValue());
        }
    },
    ADDRESS_STATE(32, "", "Bundesland") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final Address address = getAddress(activityWorkInProgress);
            address.setState(cell.getStringCellValue());
        }
    },
    IMPACT_AREA(33, "", "Wirkungsraum") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final String cleanedString = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cleanedString)) {
                final ImpactArea impactArea = ExcelHeader.getImpactArea(cell.getStringCellValue());
                activityWorkInProgress.setImpactArea(impactArea);
            }
        }
    },
    ADDRESS_URL(34, "", "Url") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final LocationWorkInProgress locationWorkInProgress = getLocation(activityWorkInProgress);
            if (StringUtils.hasText(cell.getStringCellValue()) && ExcelHeader.isValidUrl(cell.getStringCellValue())) {
                locationWorkInProgress.setUrl(cell.getStringCellValue());
            }
        }
    },
    SOCIAL_MEDIA_FACEBOOK(35, "", "Facebook") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final Set<SocialMediaContact> socialMediaContacts = activityWorkInProgress.getSocialMediaContacts();
            String cellValue = cell.getStringCellValue();
            if (StringUtils.hasText(cellValue) && ExcelHeader.isValidUrl(cell.getStringCellValue())) {
                SocialMediaContact socialMediaContact = new SocialMediaContact(SocialMediaType.FACEBOOK, cellValue);
                socialMediaContact.setActivityWorkInProgress(activityWorkInProgress);
                socialMediaContacts.add(socialMediaContact);
            }
        }
    },
    SOCIAL_MEDIA_TWITTER(36, "", "Twitter") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final Set<SocialMediaContact> socialMediaContacts = activityWorkInProgress.getSocialMediaContacts();
            String cellValue = cell.getStringCellValue();
            if (StringUtils.hasText(cellValue) && ExcelHeader.isValidUrl(cell.getStringCellValue())) {
                SocialMediaContact socialMediaContact = new SocialMediaContact(SocialMediaType.TWITTER, cellValue);
                socialMediaContact.setActivityWorkInProgress(activityWorkInProgress);
                socialMediaContacts.add(socialMediaContact);
            }
        }
    },
    SOCIAL_MEDIA_INSTAGRAM(37, "", "Instagram") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final Set<SocialMediaContact> socialMediaContacts = activityWorkInProgress.getSocialMediaContacts();
            String cellValue = cell.getStringCellValue();
            if (StringUtils.hasText(cellValue) && ExcelHeader.isValidUrl(cell.getStringCellValue())) {
                SocialMediaContact socialMediaContact = new SocialMediaContact(SocialMediaType.INSTAGRAM, cellValue);
                socialMediaContact.setActivityWorkInProgress(activityWorkInProgress);
                socialMediaContacts.add(socialMediaContact);
            }
        }
    },
    SOCIAL_MEDIA_TIKTOK(38, "", "TikTok") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final Set<SocialMediaContact> socialMediaContacts = activityWorkInProgress.getSocialMediaContacts();
            String cellValue = cell.getStringCellValue();
            if (StringUtils.hasText(cellValue) && ExcelHeader.isValidUrl(cell.getStringCellValue())) {
                SocialMediaContact socialMediaContact = new SocialMediaContact(SocialMediaType.TIKTOK, cellValue);
                socialMediaContact.setActivityWorkInProgress(activityWorkInProgress);
                socialMediaContacts.add(socialMediaContact);
            }
        }
    },
    SOCIAL_MEDIA_LINKEDIN(39, "", "LinkedIn") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final Set<SocialMediaContact> socialMediaContacts = activityWorkInProgress.getSocialMediaContacts();
            String cellValue = cell.getStringCellValue();
            if (StringUtils.hasText(cellValue) && ExcelHeader.isValidUrl(cell.getStringCellValue())) {
                SocialMediaContact socialMediaContact = new SocialMediaContact(SocialMediaType.LINKEDIN, cellValue);
                socialMediaContact.setActivityWorkInProgress(activityWorkInProgress);
                socialMediaContacts.add(socialMediaContact);
            }
        }
    },
    ACTION_TYPE(40, "", "Typ") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final String cleanedString = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cleanedString)) {
                ActivityType activityType = getActivitytype(cleanedString);
                activityWorkInProgress.setActivityType(activityType);
            }
        }
    },
    PERIOD_START(41, "Zeitraum", "von") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final String cleanedString = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cleanedString) && cell.getCellType() == CellType.NUMERIC) {
                final LocalDateTime localDateTimeCellValue = cell.getLocalDateTimeCellValue();
                final Period period = getPeriod(activityWorkInProgress);
                period.setStart(ZonedDateTime.of(localDateTimeCellValue, ZoneId.systemDefault()).toInstant());
            }
        }
    },
    PERIOD_END(42, "", "bis") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final String cleanedString = ExcelHeader.getCleanedString(cell);
            if (StringUtils.hasText(cleanedString) && cell.getCellType() == CellType.NUMERIC) {
                final Period period = getPeriod(activityWorkInProgress);
                final LocalDateTime localDateTimeCellValue = cell.getLocalDateTimeCellValue();
                period.setEnd(ZonedDateTime.of(localDateTimeCellValue, ZoneId.systemDefault()).toInstant());
            }
        }
    },
    CONTACT_FIRSTNAME(43, "Ansprechpartner", "Vorname") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final ContactWorkInProgress contactWorkInProgress = getContact(activityWorkInProgress);
            contactWorkInProgress.setFirstName(cell.getStringCellValue());
        }
    },
    CONTACT_LASTNAME(44, "", "Nachname") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final ContactWorkInProgress contactWorkInProgress = getContact(activityWorkInProgress);
            contactWorkInProgress.setLastName(cell.getStringCellValue());
        }
    },
    CONTACT_POSITION(45, "", "Position") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final ContactWorkInProgress contactWorkInProgress = getContact(activityWorkInProgress);
            contactWorkInProgress.setPosition(cell.getStringCellValue());
        }
    },
    CONTACT_EMAIL(46, "", "E-Mail") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final ContactWorkInProgress contactWorkInProgress = getContact(activityWorkInProgress);
            contactWorkInProgress.setEmail(cell.getStringCellValue());
        }
    },
    CONTACT_PHONE(47, "", "Telefon") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final ContactWorkInProgress contactWorkInProgress = getContact(activityWorkInProgress);
            contactWorkInProgress.setPhone(cell.getStringCellValue());
        }
    },
    EXTERNAL_ID(48, "", "externe ID") {
        @Override
        public void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell) {
            final String stringCellValue = cell.getStringCellValue();
            activityWorkInProgress.setExternalId(stringCellValue);
        }
    };

    private final String[] columnName;
    private final int columnIndex;

    private static final GeometryFactory GEOMETRY_FACTORY = new GeometryFactory();

    private static final ConversionService CONVERSION_SERVICE = new DefaultConversionService();

    ExcelActivityHeader(int columnIndex, String... columnName) {
        this.columnName = columnName;
        this.columnIndex = columnIndex;
    }

    private static ActivityType getActivitytype(String stringCellValue) {
        String value = stringCellValue.trim().toUpperCase();
        try {
            return ActivityType.valueOf(value);
        } catch (IllegalArgumentException iae) {
            switch (value) {
                case "NETZWERK": return ActivityType.NETWORK;
                case "VERANSTALTUNG": return ActivityType.EVENT;
                case "SONSTIGES": return ActivityType.OTHER;
                default: throw iae;
            }
        }
    }

    private static boolean getIsOnline(String stringCellValue) {
        String value = stringCellValue.trim().toUpperCase();
        return StringUtils.hasText(value); // && !value.equals("NEIN"); // ToDo: wie sieht "true" aus?
    }

    private static Period getPeriod(ActivityWorkInProgress activityWorkInProgress) {
        final Period period;
        if (Objects.isNull(activityWorkInProgress.getPeriod())) {
            period = new Period();
            activityWorkInProgress.setPeriod(period);
        } else {
            period = activityWorkInProgress.getPeriod();
        }
        return period;
    }

    private static LocationWorkInProgress getLocation(ActivityWorkInProgress activityWorkInProgress) {
        final LocationWorkInProgress locationWorkInProgress;
        if (Objects.isNull(activityWorkInProgress.getLocationWorkInProgress())) {
            locationWorkInProgress = new LocationWorkInProgress();
            activityWorkInProgress.setLocationWorkInProgress(locationWorkInProgress);
        } else {
            locationWorkInProgress = activityWorkInProgress.getLocationWorkInProgress();
        }
        return locationWorkInProgress;
    }

    private static ContactWorkInProgress getContact(ActivityWorkInProgress activityWorkInProgress) {
        final ContactWorkInProgress contactWorkInProgress;
        if (Objects.isNull(activityWorkInProgress.getContactWorkInProgress())) {
            contactWorkInProgress = new ContactWorkInProgress();
            activityWorkInProgress.setContactWorkInProgress(contactWorkInProgress);
        } else {
            contactWorkInProgress = activityWorkInProgress.getContactWorkInProgress();
        }
        return contactWorkInProgress;
    }

    private static Address getAddress(ActivityWorkInProgress activityWorkInProgress) {
        final LocationWorkInProgress locationWorkInProgress = getLocation(activityWorkInProgress);
        final Address address;
        if (Objects.isNull(activityWorkInProgress.getLocationWorkInProgress().getAddress())) {
            address = new Address();
            locationWorkInProgress.setAddress(address);
        } else {
            address = locationWorkInProgress.getAddress();
        }
        return address;
    }

    public static Optional<ExcelActivityHeader> byColumnIndex(int columnIndex) {
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
     * Setzt den Wert einer Property eines {@link ActivityWorkInProgress} Objekts in Abhängigkeit des Headers, zu dem die Zelle zugeordnet ist.
     * Das Object wird in-place verändert, daher gibt es keinen Rückgabewert.
     *
     * @param activityWorkInProgress Das Objekt, dessen Wert gesetzt werden soll.
     * @param cell                   Die Excel-Cell, die den zu setzenden Wert enthält.
     */
    public abstract void setValueOfActivityWorkInProgress(ActivityWorkInProgress activityWorkInProgress, Cell cell);

    @Override
    public <T extends IWorkInProgress> void setValueOfWorkInProgressObject(T workInProgressObject, Cell cell) {
        if (workInProgressObject instanceof ActivityWorkInProgress) {
            setValueOfActivityWorkInProgress((ActivityWorkInProgress) workInProgressObject, cell);
        }
    }
}
