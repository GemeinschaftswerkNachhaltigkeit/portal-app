package com.exxeta.wpgwn.wpgwnapp.exception;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;

import lombok.Builder;
import lombok.Getter;
import lombok.Singular;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@Builder
@Getter
@JsonPropertyOrder({"timestamp", "status", "error", "errorMessages"})
public class ErrorResponse {

    private final OffsetDateTime timestamp = OffsetDateTime.now();

    private final HttpStatus status;

    /**
     * Liste der spezifischen Fehler, die aufgetreten sind
     */
    @Singular
    private List<ErrorModel> errorMessages;

    public int getStatus() {
        return status.value();
    }

    public String getError() {
        return status.getReasonPhrase();
    }

}
