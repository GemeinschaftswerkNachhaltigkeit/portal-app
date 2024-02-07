package com.exxeta.wpgwn.wpgwnapp.activity_subscription.model;

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

import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.shared.model.AuditableEntityBase;

@Entity
@Table(name = "activity_subscription")
@Getter
@Setter
public class ActivitySubscription extends AuditableEntityBase {

    @NotNull
    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name = "activity_id", unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Activity activity;

    @NotEmpty
    @Column(name = "subscribed_user_id")
    private String subscribedUserId;
}
