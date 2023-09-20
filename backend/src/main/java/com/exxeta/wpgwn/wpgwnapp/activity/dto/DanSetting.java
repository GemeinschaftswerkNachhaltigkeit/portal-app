package com.exxeta.wpgwn.wpgwnapp.activity.dto;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.Value;

import static com.exxeta.wpgwn.wpgwnapp.WpgwnAppApplication.DEFAULT_ZONE_ID;
import static java.util.Objects.nonNull;


@Value
public class DanSetting {

    private final boolean activeEdit;

    private final boolean activeDan;

    private final LocalDateTime startEdit;


    private final LocalDateTime endEdit;

    private final LocalDateTime startDan;

    private final LocalDateTime endDan;

    public Instant startEditMin() {
        return toInstant(startEdit);
    }

    public Instant endEditMax() {
        return toInstant(endEdit);
    }

    public Instant startMin() {
        return toInstant(startDan);
    }

    public Instant endMax() {
        return toInstant(endDan);
    }

    public boolean active() {
        return activeEdit && activeDan
                && nonNull(startEditMin()) && nonNull(endEditMax())
                && nonNull(startMin()) && nonNull(endMax());
    }

    private Instant toInstant(LocalDateTime localDateTime) {
        return nonNull(localDateTime)
                ? localDateTime.toLocalDate().atTime(LocalTime.MAX).atZone(DEFAULT_ZONE_ID).toInstant() : null;
    }
}
