package com.exxeta.wpgwn.wpgwnapp.excel_import;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.experimental.StandardException;

/**
 * Exception, die mitteilt, dass das Lesen einer Exceltabelle fehlgeschlagen ist.
 * <p>
 * Copyright: Copyright (c) 14.08.2021<br/>
 * Organisation: EXXETA AG
 *
 * @author Jan Buchholz <a href="mailto:jan.buchholz@exxeta.com">jan.buchholz@exxeta.com</a>
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
@StandardException
public class ExcelReadException extends RuntimeException {
}
