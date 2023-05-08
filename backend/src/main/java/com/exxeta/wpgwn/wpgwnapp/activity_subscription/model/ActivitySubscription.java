package com.exxeta.wpgwn.wpgwnapp.activity_subscription.model;

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
