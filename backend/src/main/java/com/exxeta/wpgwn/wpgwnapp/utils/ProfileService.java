package com.exxeta.wpgwn.wpgwnapp.utils;

import java.util.List;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProfileService {

    public static final String PROD_PROFILE = "prod";

    private final Environment env;

    public boolean isProdActive() {
        return List.of(env.getActiveProfiles()).contains(PROD_PROFILE);
    }

}
