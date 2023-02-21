package com.exxeta.wpgwn.wpgwnapp.email_opt_out.model;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.exxeta.wpgwn.wpgwnapp.email_opt_out.EmailOptOutOption;
import com.exxeta.wpgwn.wpgwnapp.shared.model.EntityBase;

@Entity
@Table(name = "email_opt_out_entry")
@Getter
@Setter
@ToString
public class EmailOptOutEntry extends EntityBase {

    @NotBlank
    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @NotNull
    @Column(name = "email_opt_out_options")
    @Enumerated(EnumType.STRING)
    @ElementCollection
    private Set<EmailOptOutOption> emailOptOutOptions = new LinkedHashSet<>();

    /**
     * Eine zufällige eindeutige ID die es erlaubt den Eintrag zu modifizieren. Die ID wird mit einem Link versendet.
     */
    @Column(name = "random_unique_id", unique = true, nullable = false)
    private UUID randomUniqueId;

    /**
     * Generierungszeit für die {@link #randomUniqueId} um das Ablaufdatum zu ermitteln.
     */
    @Column(name = "random_unique_id_generation_time", nullable = false)
    private Instant randomIdGenerationTime;

}
