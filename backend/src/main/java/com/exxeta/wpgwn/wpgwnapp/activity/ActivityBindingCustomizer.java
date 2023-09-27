package com.exxeta.wpgwn.wpgwnapp.activity;


import org.springframework.data.querydsl.binding.QuerydslBinderCustomizer;
import org.springframework.data.querydsl.binding.QuerydslBindings;

import com.exxeta.wpgwn.wpgwnapp.activity.model.QActivity;
import com.exxeta.wpgwn.wpgwnapp.utils.BindingCustomizerUtils;

public class ActivityBindingCustomizer implements QuerydslBinderCustomizer<QActivity> {

    private final BindingCustomizerUtils utils = new BindingCustomizerUtils();

    @Override
    public void customize(QuerydslBindings bindings, QActivity root) {

        // only evaluate the first parameter for the binding.
//        bindings.bind(root.thematicFocus).first((path, value) -> value.stream()
//                .map(thematicFoci -> path.any().eq(thematicFoci))
//                .reduce(BooleanExpression::or).get() );

        bindings.excluding(root.location);
        bindings.excluding(root.contact);

        bindings.bind(root.activityType).all(utils.multiValueOrCondition());
        bindings.bind(root.thematicFocus).all(utils.multiValueAndOrConditionsForEnum());
        bindings.bind(root.sustainableDevelopmentGoals).all(utils.multiValueAndOrConditionForNumber());

        // Prüfung, ob das Intervall (Start - Ende) mit den Daten in der DB überlappt.
        bindings.bind(root.period.start)
                .as("endDate")
                .first((path, value) -> path.loe(value).or(path.isNull()));
//                .first(DateTimeExpression::loe);
        bindings.bind(root.period.end)
                .as("startDate")
                .first((path, value) -> path.goe(value).or(path.isNull()));
//                .first(DateTimeExpression::goe);
    }
}
