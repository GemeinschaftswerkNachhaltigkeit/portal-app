package com.exxeta.wpgwn.wpgwnapp.email_opt_out.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.LinkedHashSet;
import java.util.Set;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.email_opt_out.EmailOptOutOption;

@Data
public class EmailOptOutEntryDto {

    @NotBlank
    private String email;

    @NotNull
    private Set<EmailOptOutOption> emailOptOutOptions = new LinkedHashSet<>();
}
