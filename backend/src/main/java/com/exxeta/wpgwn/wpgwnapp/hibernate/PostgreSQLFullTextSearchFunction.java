package com.exxeta.wpgwn.wpgwnapp.hibernate;

import java.util.List;
import java.util.Objects;

import org.hibernate.QueryException;
import org.hibernate.engine.spi.Mapping;
import org.hibernate.engine.spi.SessionFactoryImplementor;
import org.hibernate.type.Type;

public class PostgreSQLFullTextSearchFunction {


    public boolean hasArguments() {
        return true;
    }


    public boolean hasParenthesesIfNoArguments() {
        return false;
    }


    public Type getReturnType(Type type, Mapping mapping) throws QueryException {
        return null;
    }

    /**
     * FUNCTION( 'ftsMatch', :titre,'pg_catalog.french', film.titre)
     */
    @SuppressWarnings("MagicNumber")
    public String render(Type type, List args, SessionFactoryImplementor sessionFactoryImplementor)
            throws QueryException {

        if (args.size() == 3) {
            String ftsConfig = (String) args.get(0);
            Object value = args.get(1);
            String field = (String) args.get(2);

            return getValue("string", ftsConfig, value)
                    + ") @@ to_tsquery(" + ftsConfig + "," + field + ")";
        } else if (args.size() == 4) {
            String ftsConfig = (String) args.get(0);
            Object value = args.get(1);
            String field = (String) args.get(2);
            String fieldType = (String) args.get(3);

            String fieldValue = getValue(fieldType, ftsConfig, value);
            return fieldValue + " @@ to_tsquery(" + ftsConfig + "," + field + ")";
        }
        throw new IllegalArgumentException("Function is undefined for args: " + args);
    }

    private String getValue(String fieldType, String ftsConfig, Object value) {
        if (Objects.equals(fieldType.toLowerCase(), "string")) {
            return "to_tsvector(" + ftsConfig + "," + value + ")";
        } else {
            return String.valueOf(value);
        }
    }
}
