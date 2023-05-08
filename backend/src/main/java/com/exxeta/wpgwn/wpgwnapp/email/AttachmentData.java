package com.exxeta.wpgwn.wpgwnapp.email;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Builder
@Getter
@ToString
public class AttachmentData {

    private String filename;

    private byte[] payload;

}
