package com.exxeta.wpgwn.wpgwnapp.hibernate;

import org.hibernate.spatial.dialect.postgis.PostgisPG95Dialect;

/**
 * Postgis Dialect with an extension for postgres full text search.
 */
public class FullTextDialect extends PostgisPG95Dialect {

    public FullTextDialect() {
        registerFunction("ftsMatch", new PostgreSQLFullTextSearchFunction());
    }
}
