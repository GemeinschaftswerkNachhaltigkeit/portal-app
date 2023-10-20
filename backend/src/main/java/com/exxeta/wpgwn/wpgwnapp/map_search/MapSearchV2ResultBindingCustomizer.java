package com.exxeta.wpgwn.wpgwnapp.map_search;

import org.springframework.data.querydsl.binding.QuerydslBinderCustomizer;
import org.springframework.data.querydsl.binding.QuerydslBindings;

import com.exxeta.wpgwn.wpgwnapp.map_search.model.QMapSearchV2Result;
import com.exxeta.wpgwn.wpgwnapp.utils.BindingCustomizerUtils;

public class MapSearchV2ResultBindingCustomizer implements QuerydslBinderCustomizer<QMapSearchV2Result> {

    private final BindingCustomizerUtils utils = new BindingCustomizerUtils();

    @Override
    public void customize(QuerydslBindings bindings, QMapSearchV2Result root) {

        bindings.excluding(root.location);
        bindings.excluding(root.organisation.activities);
        bindings.excluding(root.organisationType);
        bindings.excluding(root.activityType);
        bindings.excluding(root.initiator);
        bindings.excluding(root.location.online);
        bindings.excluding(root.projectSustainabilityWinner);

        bindings.bind(root.sustainableDevelopmentGoals).all(utils.stringLeftPadContainsAnyCondition());
        bindings.bind(root.thematicFocus).all(utils.stringContainsAnyCondition());
        bindings.bind(root.resultType).all(utils.multiValueOrCondition());
        bindings.bind(root.impactArea).all(utils.multiValueOrCondition());

        // Prüfung, ob das Intervall (Start - Ende) mit den Daten in der DB überlappt.
        bindings.bind(root.period.end)
                .as("endDate")
                .first((path, value) -> path.loe(value).or(path.isNull()));
        bindings.bind(root.period.start)
                .as("startDate")
                .first((path, value) -> path.goe(value).or(path.isNull()));
    }

}
