package com.exxeta.wpgwn.wpgwnapp.configuration.properties;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.Duration;
import java.time.temporal.ChronoUnit;

import org.hibernate.validator.constraints.URL;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;
import org.springframework.boot.context.properties.NestedConfigurationProperty;
import org.springframework.boot.convert.DurationUnit;
import org.springframework.validation.annotation.Validated;

import lombok.Value;

@Validated
@ConfigurationProperties(prefix = "wpgwn.organisation")
@ConstructorBinding
@Value
public class WpgwnProperties {

    /**
     * default orgId für Dan.
     */
    @NotNull
    @PositiveOrZero
    private final Long danId;

    /**
     * Laufzeit für die Gültigkeit der zufälligen Ids zum Zugriff auf Organisationen und Aktivitäten.
     */
    @DurationUnit(ChronoUnit.HOURS)
    @NotNull
    private final Duration randomIdLifeTime;

    /**
     * Base Url mit Protokoll und Domain um die URL für E-Mails zusammenzubauen.
     */
    @NotBlank
    @URL
    private final String url;

    /**
     * Base Url mit Protokoll und Domain um die Asset-URL für E-Mails.
     */
    @NotBlank
    @URL
    private final String emailAssetBasePath;

    /**
     * Mitmacherklaerungs Url mit Protokoll und Domain um die URL für E-Mails einsetzen zu können.
     */
    @NotBlank
    @URL
    private final String privacyContentUrl;

    /**
     * Email template für Privacy Content.
     */
    @NotBlank
    private final String privacyContentEmailTemplate;

    /**
     * OptOut Url mit Protokoll, Domain und Variablenspots um die URL für E-Mails einsetzen zu können.
     * Die Platzhalter <strong>uuid</strong> und <strong>email</strong> werden nach Position ersetzt.
     * Bsp.: <pre>http://localhost/opt-out/{uuid}?email={email}</pre>
     */
    @NotBlank
    @URL
    private final String optOutUrl;

    @NotBlank
    private final String invitationMailSubject;

    @NotBlank
    private final String invitationMailBody;

    @Valid
    @NestedConfigurationProperty
    @NotNull
    private final ReminderEmail reminderEmail;

    @Valid
    @NestedConfigurationProperty
    @NotNull
    private final CronProperty importPrivacyConsentEmail;

    @Valid
    @NestedConfigurationProperty
    @NotNull
    private final Duplicate duplicate;

    @Valid
    @NestedConfigurationProperty
    @NotNull
    private final ContactInvite contactInvite;

    @Valid
    @NestedConfigurationProperty
    @NotNull
    private final OrganisationMembership organisationMembership;


    @Valid
    @NestedConfigurationProperty
    @NotNull
    private final WpgwnProperties.MarketplaceProperties marketplace;

    @Valid
    @NestedConfigurationProperty
    @NotNull
    private final WpgwnProperties.DanProperties dan;

    @Value
    @Validated
    public static class ReminderEmail {

        @NotNull
        @PositiveOrZero
        private final Integer maxReminders;
        private final Duration durationBetweenReminders;
        @NotBlank
        private final String cron;
        @NotNull
        private final Integer batchSize;

        public ReminderEmail(Integer maxReminders,
                             @DurationUnit(ChronoUnit.DAYS) Duration durationBetweenReminders,
                             String cron,
                             Integer batchSize) {
            this.maxReminders = maxReminders;
            this.durationBetweenReminders = durationBetweenReminders;
            this.cron = cron;
            this.batchSize = batchSize;
        }

    }

    @Value
    @Validated
    public static class CronProperty {

        @NotBlank
        private final String cron;


    }

    @Value
    @Validated
    public static class Duplicate {

        @DecimalMin("0.0")
        @DecimalMax("1.0")
        private final Double nameSimilarityThreshold;


    }

    @Value
    @Validated
    public static class ContactInvite {

        @NotNull
        private final Duration expireFromCreationInDays;

        public ContactInvite(@DurationUnit(ChronoUnit.DAYS) Duration expireFromCreationInDays) {
            this.expireFromCreationInDays = expireFromCreationInDays;
        }


    }

    @Value
    @Validated
    public static class OrganisationMembership {

        @NotNull
        private final Duration expireFromCreationInDays;
        @NotNull
        private final Integer oneTimePasswordLength;

        public OrganisationMembership(@DurationUnit(ChronoUnit.DAYS) Duration expireFromCreationInDays,
                                      Integer oneTimePasswordLength) {
            this.expireFromCreationInDays = expireFromCreationInDays;
            this.oneTimePasswordLength = oneTimePasswordLength;
        }

    }

    @Value
    @Validated
    public static class MarketplaceProperties {

        @NotNull
        @PositiveOrZero
        private final Integer maxOffers;

        @NotNull
        @PositiveOrZero
        private final Integer maxBestPractises;

    }

    @Value
    @Validated
    public static class DanProperties {

        @NotNull
        @PositiveOrZero
        private final Integer maxDans;

    }

}
