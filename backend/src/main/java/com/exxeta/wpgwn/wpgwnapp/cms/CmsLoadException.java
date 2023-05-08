package com.exxeta.wpgwn.wpgwnapp.cms;

public class CmsLoadException extends RuntimeException {

    public CmsLoadException(String message) {
        super("cms.load.error: " + message);
    }
}
