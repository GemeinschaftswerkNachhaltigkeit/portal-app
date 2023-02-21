package com.exxeta.wpgwn.wpgwnapp.keycloak_client.exception;

import org.keycloak.representations.idm.GroupRepresentation;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class NoGroupPermissionException extends RuntimeException {
    public NoGroupPermissionException(GroupRepresentation groupRepresentation) {
        super("No permission to assign group ["
                + groupRepresentation.getPath()
                + "].");
    }
}
