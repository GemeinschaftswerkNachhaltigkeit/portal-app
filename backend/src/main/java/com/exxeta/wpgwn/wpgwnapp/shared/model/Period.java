package com.exxeta.wpgwn.wpgwnapp.shared.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Period {

    @Column(name = "period_start")
    private Instant start;

    @Column(name = "period_end")
    private Instant end;

}
