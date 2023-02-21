package com.exxeta.wpgwn.wpgwnapp.user_account;

import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.keycloak_client.configuration.KeycloakProperties;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.service.KeycloakService;

import javax.annotation.security.RolesAllowed;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserAccountController {

    private final KeycloakService keycloakService;

    private final KeycloakProperties keycloakProperties;


    @RolesAllowed(PermissionPool.GUEST)
    @PostMapping("sign-up-successful")
    public void saveSignupSuccessful(@AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {
        final String userId = principal.getName();
        keycloakService.removeGroupFromUserById(userId, keycloakProperties.getNewlySignUpUsers());
    }

}
