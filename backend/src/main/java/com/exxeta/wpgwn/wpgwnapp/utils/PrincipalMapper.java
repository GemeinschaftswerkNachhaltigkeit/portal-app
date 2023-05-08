package com.exxeta.wpgwn.wpgwnapp.utils;


import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;

import lombok.experimental.UtilityClass;

import com.exxeta.wpgwn.wpgwnapp.security.JwtTokenNames;

@UtilityClass
public class PrincipalMapper {

    public Long getUserOrgId(OAuth2AuthenticatedPrincipal principal) {
        return principal.getAttribute(JwtTokenNames.ORGANISATION_ID);
    }
}
