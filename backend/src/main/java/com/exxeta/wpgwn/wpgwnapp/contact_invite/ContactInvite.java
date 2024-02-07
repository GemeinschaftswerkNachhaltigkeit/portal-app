package com.exxeta.wpgwn.wpgwnapp.contact_invite;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.AuditableEntityBase;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Contact;

@Entity
@Table(name = "contact_invite")
@Getter
@Setter
public class ContactInvite extends AuditableEntityBase {

    @NotNull
    @Column(name = "random_unique_id", unique = true, nullable = false)
    private UUID randomUniqueId;

    /**
     * Generierungszeit für die {@link #randomUniqueId} um das Ablaufdatum zu ermitteln.
     */
    @Column(name = "random_unique_id_generation_time")
    private Instant randomIdGenerationTime;

    /**
     * Referenz zur Organisation (WiP) für diese Kontaktbestätigung.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organisation_work_in_progress_id")
    private OrganisationWorkInProgress organisationWorkInProgress;

    /**
     * Referenz zur Organisation für diese Kontaktbestätigung.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organisation_id")
    private Organisation organisation;

    /**
     * Referenz zur Aktivität für diese Kontaktbestätigung, falls der Kontakt bei einer Aktivität hinzugefügt wurde.
     * Ist eine Aktivität vorhanden, muss zwingend auch eine Organisation vorhanden sein. Wenn eine E-Mail-Adresse
     * für eine Organisation bestätigt wurde, dass ist diese Bestätigung unbegrenzt gültig
     * und muss nicht erneut angefordert werden.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id")
    private Activity activity;

    /**
     * zu bestätigende Kontaktinformationen
     */
    @Embedded
    @Valid
    @NotNull
    private Contact contact;

    @NotNull
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private ContactInviteStatus status;

    @Column(name = "closed_at")
    private Instant closedAt;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "email_sent")
    private Boolean emailSent;

}
