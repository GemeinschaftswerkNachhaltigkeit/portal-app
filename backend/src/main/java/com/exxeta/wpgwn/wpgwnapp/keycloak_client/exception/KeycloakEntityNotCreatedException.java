package com.exxeta.wpgwn.wpgwnapp.keycloak_client.exception;

import javax.ws.rs.core.Response;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class KeycloakEntityNotCreatedException extends RuntimeException {
    public KeycloakEntityNotCreatedException(Response response) {
        super("Unexpected error creating keycloak user. Status: "
                + response.getStatus());
    }
}
