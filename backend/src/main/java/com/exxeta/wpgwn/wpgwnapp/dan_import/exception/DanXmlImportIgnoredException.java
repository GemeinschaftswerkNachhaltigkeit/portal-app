package com.exxeta.wpgwn.wpgwnapp.dan_import.exception;

import java.util.Map;

import lombok.Value;

@Value
public class DanXmlImportIgnoredException extends RuntimeException {

    private final Map<String, String> errorMessages;
}