package com.exxeta.wpgwn.wpgwnapp.shared.dto;

import java.time.OffsetDateTime;

import lombok.Data;

@Data
public class PeriodDto {

    private Boolean permanent;

    private OffsetDateTime start;

    private OffsetDateTime end;

}
