package com.exxeta.wpgwn.wpgwnapp.keycloak_client.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum WpgwnGroup {

    USER("User", "/User/User"),
    RNE_ADMIN("Rne Administrator", "/Admin/RNE Admin");

    private final String groupName;
    private final String groupPath;

}
