package com.exxeta.wpgwn.wpgwnapp.organisation_subscription.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

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
