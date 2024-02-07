package com.exxeta.wpgwn.wpgwnapp.organisation_subscription.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import lombok.Getter;
import lombok.Setter;

import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.shared.model.AuditableEntityBase;

@Entity
@Table(name = "organisation_subscription")
@Getter
@Setter
public class OrganisationSubscription extends AuditableEntityBase {

    @NotNull
    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name = "organisation_id", unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Organisation organisation;

    @NotEmpty
    @Column(name = "subscribed_user_id")
    private String subscribedUserId;
}
