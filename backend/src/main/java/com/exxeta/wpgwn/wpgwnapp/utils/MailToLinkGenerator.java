package com.exxeta.wpgwn.wpgwnapp.utils;

import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Component;
import org.springframework.web.util.UriUtils;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;

@Component
@RequiredArgsConstructor
public class MailToLinkGenerator {

    private final WpgwnProperties wpgwnProperties;

    public String buildMailToLink() {
        return "mailTo:?subject="
                + UriUtils.encodeQueryParam(wpgwnProperties.getInvitationMailSubject(), StandardCharsets.UTF_8)
                + "&body=" + UriUtils.encodeQueryParam(wpgwnProperties.getInvitationMailBody(), StandardCharsets.UTF_8);
    }
}
