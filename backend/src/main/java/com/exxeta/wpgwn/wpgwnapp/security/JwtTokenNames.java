package com.exxeta.wpgwn.wpgwnapp.security;

import lombok.experimental.UtilityClass;

/**
 * Names der Attribute im Jwt Token. Diese unterscheiden sich von dem Namen der Attribute im Keycloak, welche in der Klasse
 * {@link com.exxeta.wpgwn.wpgwnapp.keycloak_client.domain.KeycloakConstants} definiert sind.
 */
@UtilityClass
public class JwtTokenNames {

    public static final String EMAIL = "email";
    public static final String ORGANISATION_WORK_IN_PROGRESS_ID = "orgWipId";
    public static final String ORGANISATION_ID = "orgId";
    public static final String JUST_REGISTERED = "justRegistered";
    public static final String FIRST_NAME = "given_name";
    public static final String LAST_NAME = "family_name";
}
