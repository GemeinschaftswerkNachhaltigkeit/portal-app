package com.exxeta.wpgwn.wpgwnapp.hibernate;

import org.hibernate.boot.model.FunctionContributions;
import org.hibernate.boot.model.FunctionContributor;
import org.hibernate.dialect.function.StandardSQLFunction;
import org.hibernate.type.StandardBasicTypes;

public class CustomFunctionContributor implements FunctionContributor {
    @Override
    public void contributeFunctions(FunctionContributions functionContributions) {

        functionContributions.getFunctionRegistry().register("ts_rank",
                new StandardSQLFunction("ts_rank", StandardBasicTypes.DOUBLE));

        functionContributions.getFunctionRegistry().register("to_tsquery",
                new StandardSQLFunction("to_tsquery", StandardBasicTypes.OBJECT_TYPE));
    }
}
