package com.exxeta.wpgwn.wpgwnapp.dan_import.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.experimental.StandardException;

/**
 * Exception that tells that reading a dan xml failed.
 * <p>
 * Copyright: Copyright (c) 14.08.2021<br/>
 * Organisation: EXXETA AG
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
@StandardException
public class DanXmlReadException extends RuntimeException {
}
