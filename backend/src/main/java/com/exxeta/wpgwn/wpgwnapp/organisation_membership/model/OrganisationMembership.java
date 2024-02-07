package com.exxeta.wpgwn.wpgwnapp.organisation_membership.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

import org.springframework.lang.Nullable;

import lombok.Getter;
import lombok.Setter;

import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.shared.model.AuditableEntityBase;

@Entity
@Table(name = "organisation_membership")
@Getter
@Setter
public class OrganisationMembership extends AuditableEntityBase {

    @NotNull
    @Column(name = "random_unique_id", unique = true, nullable = false)
    private UUID randomUniqueId;

    /**
     * Generierungszeit für die {@link #randomUniqueId} um das Ablaufdatum zu ermitteln.
     */
    @Column(name = "random_unique_id_generation_time")
    private Instant randomIdGenerationTime;

    /**
     * Referenz zur Organisation für diese Kontaktbestätigung.
     */
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organisation_id")
    private Organisation organisation;

    /**
     * E-Mail für Nutzer der zu bestätigen ist
     */
    @NotNull
    @Column(name = "email")
    private String email;

    @Nullable
    @Column(name = "first_name")
    private String firstName;

    @Nullable
    @Column(name = "last_name")
    private String lastName;

    @NotNull
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private OrganisationMembershipStatus status;

    @Nullable
    @Column(name = "created_new_user")
    private Boolean createdNewUser;

    @NotNull
    @Column(name = "user_type")
    @Enumerated(EnumType.STRING)
    private OrganisationMembershipUserType userType;

    @Column(name = "closed_at")
    private Instant closedAt;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "email_sent")
    private Boolean emailSent;

}
