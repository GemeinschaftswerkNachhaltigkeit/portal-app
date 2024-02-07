package com.exxeta.wpgwn.wpgwnapp.hibernate;

import org.hibernate.boot.model.FunctionContributions;
import org.hibernate.boot.model.FunctionContributor;
import org.hibernate.dialect.function.StandardSQLFunction;
import org.hibernate.type.StandardBasicTypes;

public class CustomFunctionContributor implements FunctionContributor {

    private static final String FULL_TEXT_SEARCH_FUNCTION_NAME = "ftsMatch";
    private static final String FULL_TEXT_SEARCH_FUNCTION_PATTERN = "?2 @@ to_tsquery(?1, ?3)";

    @Override
    public void contributeFunctions(FunctionContributions functionContributions) {

        functionContributions.getFunctionRegistry()
                .registerPattern(FULL_TEXT_SEARCH_FUNCTION_NAME, FULL_TEXT_SEARCH_FUNCTION_PATTERN,
                        functionContributions.getTypeConfiguration().getBasicTypeRegistry()
                                .resolve(StandardBasicTypes.BOOLEAN));

        functionContributions.getFunctionRegistry().register("ts_rank",
                new StandardSQLFunction("ts_rank", StandardBasicTypes.DOUBLE));

        functionContributions.getFunctionRegistry().register("to_tsquery",
                new StandardSQLFunction("to_tsquery", StandardBasicTypes.OBJECT_TYPE));
    }
}
