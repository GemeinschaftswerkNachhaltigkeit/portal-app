package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.Set;

import org.hibernate.validator.constraints.Length;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.OfferCategory;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.LocationDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ThematicFocusDto;

@Data
@SuppressWarnings("MagicNumber")
public class OfferWorkInProgressRequestDto {

    @Length(max = 200)
    private String name;

    @Length(max = 3000)
    private String description;

    private OfferCategory offerCategory;

    /**
     * Null ist ortsunabhängig.
     * <p>
     * Optional, um die Koordinaten wieder löschen zu können. Jackson unterscheidet,
     * ob der Wert nicht vorhanden ist (Optional == null)
     * oder der Wert im Json wurde auf "null" gesetzt (Optional.empty)
     */
    @Valid
    private Optional<LocationDto> location;

    @Valid
    private Set<@NotNull ThematicFocusDto> thematicFocus;

    @Valid
    private ContactDto contact;

    private OffsetDateTime endUntil;

    @NotNull
    private Boolean featured = false;

    private String featuredText;

}
