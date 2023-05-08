package com.exxeta.wpgwn.wpgwnapp.security;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

import org.springframework.security.test.context.support.WithSecurityContext;

import com.exxeta.wpgwn.wpgwnapp.util.WpgwnMockUserSecurityContextFactory;

@Retention(RetentionPolicy.RUNTIME)
@WithSecurityContext(factory = WpgwnMockUserSecurityContextFactory.class)
public @interface WithMockWpgwnUser {

    String userId() default "12345-6789-123456";

    long organisationId() default -1L;

    long organisationWorkInProgressId() default -1L;

    String[] roles() default {PermissionPool.GUEST};
}
