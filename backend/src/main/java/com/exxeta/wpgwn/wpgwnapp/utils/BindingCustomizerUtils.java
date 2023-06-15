package com.exxeta.wpgwn.wpgwnapp.utils;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Set;
import java.util.function.Function;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.querydsl.binding.MultiValueBinding;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.EnumPath;
import com.querydsl.core.types.dsl.NumberPath;
import com.querydsl.core.types.dsl.SetPath;
import com.querydsl.core.types.dsl.StringPath;

import static com.exxeta.wpgwn.wpgwnapp.WpgwnAppApplication.DEFAULT_ZONE_ID;

public class BindingCustomizerUtils {


    public <T extends Number & Comparable<T>> MultiValueBinding<SetPath<T, NumberPath<T>>, Set<T>> multiValueAndOrConditionForNumber() {
        return (path, value) -> value.stream()
                .map(valueCollection -> valueCollection.stream()
                        .map(val -> path.any().eq(val))
                        .reduce(BooleanExpression::or)
                        .orElseThrow()
                ).reduce(BooleanExpression::and)
                // Map identity or otherwise cast exception
                .map(Function.identity());
    }

    /**
     *
     * Custom bindung to allow "and" and "or" conditions for collection elements
     * <pre>
     *           or:
     *           thematicFocus == 1 OR thematicFocus == 2
     *           ?thematicFocus=1,2
     *
     *           and:
     *           thematicFocus == 1 AND thematicFocus == 2
     *           ?thematicFocus=1&thematicFocus=2
     *</pre>
     */
    public <T extends Enum<T>> MultiValueBinding<SetPath<T, EnumPath<T>>, Set<T>> multiValueAndOrConditionsForEnum() {
        return (path, value) -> value.stream()
                .map(valueCollection -> valueCollection.stream()
                        .map(val -> path.any().eq(val))
                        .reduce(BooleanExpression::or)
                        .orElseThrow()
                )
                .reduce(BooleanExpression::and)
                // Map identity or otherwise cast exception
                .map(Function.identity());
    }

    /**
     * Custom Bindung, bei dem mehrere Werte oder verknüpft sind.
     * <pre>
     *     or:
     *     status == 1 OR status == 2
     *     ?status=1&status=2
     * </pre>
     *
     * @return
     * @param <T>
     */
    public <T extends Enum<T>> MultiValueBinding<EnumPath<T>, T> multiValueOrCondition() {
        return (path, value) -> value.stream()
                .map(path::eq)
                .reduce(BooleanExpression::or)
                // Map identity or otherwise cast exception
                .map(Function.identity());
    }

    /**
     * Custom Bindung, bei dem mehrere Werte auf String-Inhalt oder verknüpft sind.
     * <pre>
     *     or:
     *     thematicFocus contains 1 OR thematicFocus contains 2
     *     ?thematicFocus=1&thematicFocus=2
     * </pre>
     *
     * @return
     */
    public MultiValueBinding<StringPath, String> stringContainsAnyCondition() {
        return (path, value) -> value.stream()
                .map(path::containsIgnoreCase)
                .reduce(BooleanExpression::or)
                // Map identity or otherwise cast exception
                .map(Function.identity());
    }

    public MultiValueBinding<StringPath, String> stringLeftPadContainsAnyCondition() {
        return (path, value) -> value.stream()
                .map(val -> StringUtils.leftPad(val, 2, '0'))
                .map(path::containsIgnoreCase)
                .reduce(BooleanExpression::or)
                // Map identity or otherwise cast exception
                .map(Function.identity());
    }

    public static Instant instantAtDefaultZone(Instant instant) {
        if (instant == null) {
            return null;
        }
        LocalDateTime startDateTime = LocalDateTime.ofInstant(instant, DEFAULT_ZONE_ID);
        return startDateTime.atZone(ZoneId.of("UTC")).toInstant();
    }

}
