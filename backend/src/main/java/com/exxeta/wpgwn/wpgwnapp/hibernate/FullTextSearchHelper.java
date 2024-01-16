package com.exxeta.wpgwn.wpgwnapp.hibernate;

import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.google.common.base.CharMatcher;
import com.google.common.base.Joiner;
import com.google.common.base.Splitter;

import org.springframework.stereotype.Component;

import com.exxeta.wpgwn.wpgwnapp.shared.model.SearchableEnum;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ThematicFocus;

import com.querydsl.core.types.ConstantImpl;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.BooleanTemplate;
import com.querydsl.core.types.dsl.EnumPath;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.SetPath;
import com.querydsl.core.types.dsl.StringPath;

@Component
public class FullTextSearchHelper {

    public String splitQuery(String query) {
        Splitter split = Splitter.on(CharMatcher.anyOf(" ")).trimResults()
                .omitEmptyStrings();
        return Joiner.on(" | ").skipNulls()
                .join(split.split(query));
    }

    public BooleanTemplate fullTextSearchInTsVector(StringPath mapSearchResult, String query) {
        return Expressions.booleanTemplate(
                "FUNCTION('ftsMatch', 'german', {0}, {1}, 'tsvector') = true",
                mapSearchResult, ConstantImpl.create(query));
    }

    public BooleanExpression orInThematicFocus(String query, BooleanExpression searchFieldsForQuery,
                                               SetPath<ThematicFocus, EnumPath<ThematicFocus>> thematicFocus) {

        final Set<ThematicFocus> fullTextThematicFocus = getMatchingValues(ThematicFocus.class, query);
        if (!fullTextThematicFocus.isEmpty()) {
            for (ThematicFocus tm : fullTextThematicFocus) {
                searchFieldsForQuery = searchFieldsForQuery.or(thematicFocus.any().eq(tm));
            }
        }
        return searchFieldsForQuery;
    }


    public <T extends Enum<T> & SearchableEnum> Set<T> getMatchingValues(Class<T> clazz, String query) {
        if (Objects.isNull(query)) {
            return Set.of();
        }

        return Stream.of(clazz.getEnumConstants())
                .filter(val -> val.getNameDe().toLowerCase().contains(query.toLowerCase()))
                .collect(Collectors.toSet());
    }
}
