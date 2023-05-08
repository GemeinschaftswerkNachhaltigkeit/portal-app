package com.exxeta.wpgwn.wpgwnapp.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.experimental.StandardException;

@ResponseStatus(HttpStatus.NO_CONTENT)
@StandardException
public class ApiKeyNotFoundException extends RuntimeException {
}
