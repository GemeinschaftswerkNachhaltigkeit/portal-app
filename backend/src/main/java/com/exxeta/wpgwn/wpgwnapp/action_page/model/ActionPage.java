package com.exxeta.wpgwn.wpgwnapp.action_page.model;

import com.exxeta.wpgwn.wpgwnapp.action_page.shared.FormKey;
import com.exxeta.wpgwn.wpgwnapp.shared.model.AuditableEntityBase;

import io.hypersistence.utils.hibernate.type.json.JsonType;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Index;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "action_page",
        indexes = {@Index(name = "action_page_unique_hash_index", columnList = "unique_hash")}
)
@Getter
@Setter
@ToString
public class ActionPage extends AuditableEntityBase {

    @NotBlank
    @Type(type = "jsonb")
    @Column(name = "payload", columnDefinition = "jsonb", nullable = false)
    private String payload;

    @NotNull
    @Column(name = "privacy_consent", nullable = false)
    private Boolean privacyConsent;

    @NotNull
    @Column(name = "form_key", nullable = false)
    @Enumerated(EnumType.STRING)
    private FormKey formKey;

    @NotBlank
    @Column(name = "unique_hash", nullable = false)
    private String uniqueHash;

}
