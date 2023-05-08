package com.exxeta.wpgwn.wpgwnapp.keycloak_client.exception;

import javax.ws.rs.core.Response;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class KeycloakUserNotDeletedException extends RuntimeException {
    public KeycloakUserNotDeletedException(String username, Response response) {
        super("Unexpected error deleting keycloak user ["
                + username
                + "]. Status: "
                + response.getStatus());
    }
}
