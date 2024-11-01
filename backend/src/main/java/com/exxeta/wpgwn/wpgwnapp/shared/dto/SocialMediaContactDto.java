package com.exxeta.wpgwn.wpgwnapp.shared.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;

import org.hibernate.validator.constraints.Length;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.shared.model.SocialMediaType;

@Data
@SuppressWarnings("MagicNumber")
public class SocialMediaContactDto implements Serializable {

    @NotNull
    private final SocialMediaType type;

    @Length(max = 200)
    @NotBlank
    private final String contact;
}
