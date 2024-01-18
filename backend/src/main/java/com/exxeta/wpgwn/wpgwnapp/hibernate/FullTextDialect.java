package com.exxeta.wpgwn.wpgwnapp.hibernate;

import org.hibernate.spatial.dialect.postgis.PostgisPG95Dialect;

/**
 * Postgis Dialect with an extension for postgres full text search.
 */
public class FullTextDialect extends PostgisPG95Dialect {

    /*public FullTextDialect() {

        registerFunction("ftsMatch", new PostgreSQLFullTextSearchFunction());
        registerFunction("ts_rank", new StandardSQLFunction("ts_rank", DoubleType.INSTANCE));
        registerFunction("to_tsquery", new StandardSQLFunction("to_tsquery", ObjectType.INSTANCE));
    }*/
}
