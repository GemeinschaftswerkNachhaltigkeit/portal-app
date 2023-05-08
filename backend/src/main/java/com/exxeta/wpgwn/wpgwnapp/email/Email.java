package com.exxeta.wpgwn.wpgwnapp.email;

import java.util.List;
import java.util.Set;

import org.springframework.lang.NonNull;

import lombok.Builder;
import lombok.Builder.Default;
import lombok.Getter;
import lombok.Singular;
import lombok.ToString;


@Builder
@Getter
@ToString
public class Email {

    @Default
    private boolean htmlText = true;

    private String from;

    private String replyTo;

    @NonNull
    @Singular
    private Set<String> tos;

    @NonNull
    @Singular
    private Set<String> ccs;

    @NonNull
    @Singular
    private Set<String> bccs;

    private String subject;

    private String content;

    @NonNull
    @Singular
    private List<AttachmentData> attachments;

}
