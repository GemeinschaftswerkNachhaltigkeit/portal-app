package com.exxeta.wpgwn.wpgwnapp.action_page.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import io.hypersistence.utils.hibernate.type.json.JsonType;

import org.hibernate.annotations.Type;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.exxeta.wpgwn.wpgwnapp.shared.model.AuditableEntityBase;

import org.hibernate.annotations.TypeDef;

@Entity
@Table(name = "action_page",
        indexes = {@Index(name = "action_page_unique_hash_index", columnList = "unique_hash")}
)
@Getter
@Setter
@ToString
@TypeDef(name = "jsonb", typeClass = JsonType.class)
public class ActionPage extends AuditableEntityBase {

    @NotBlank
    @Type(type = "jsonb")
    @Column(name = "payload", columnDefinition = "jsonb", nullable = false)
    private String payload;

    @NotBlank
    @Column(name = "unique_hash", nullable = false)
    private String uniqueHash;

    @NotNull
    @Column(name = "form_key", nullable = false)
    @Enumerated(EnumType.STRING)
    private FormKey formKey;

    @NotNull
    @Column(name = "post_construct_job", nullable = false)
    @Enumerated(EnumType.STRING)
    private PostConstructJob postConstructJob;

}
