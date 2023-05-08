package com.exxeta.wpgwn.wpgwnapp.email;

import org.springframework.lang.NonNull;

import com.exxeta.wpgwn.wpgwnapp.email_opt_out.EmailOptOutOption;

public interface ContentGenerator<T> {

    String generateMailBody(T entity);

    String getSubject();

    String getTo(T entity);

    @NonNull
    EmailOptOutOption getEmailOptOutOption();

}
