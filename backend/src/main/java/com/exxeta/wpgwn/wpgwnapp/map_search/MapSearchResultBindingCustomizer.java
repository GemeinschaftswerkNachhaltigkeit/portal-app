package com.exxeta.wpgwn.wpgwnapp.map_search;

import org.springframework.data.querydsl.binding.QuerydslBinderCustomizer;
import org.springframework.data.querydsl.binding.QuerydslBindings;

import com.exxeta.wpgwn.wpgwnapp.map_search.model.QMapSearchResult;
import com.exxeta.wpgwn.wpgwnapp.utils.BindingCustomizerUtils;

public class MapSearchResultBindingCustomizer implements QuerydslBinderCustomizer<QMapSearchResult> {

    private BindingCustomizerUtils utils = new BindingCustomizerUtils();

    @Override
    public void customize(QuerydslBindings bindings, QMapSearchResult root) {

        // only evaluate the first parameter for the binding.
//        bindings.bind(root.thematicFocus).first((path, value) -> value.stream()
//                .map(thematicFoci -> path.any().eq(thematicFoci))
//                .reduce(BooleanExpression::or).get() );

        bindings.excluding(root.location);
        bindings.excluding(root.organisation.activities);
        bindings.excluding(root.organisationType);
        bindings.excluding(root.activityType);
        bindings.excluding(root.initiator);
        bindings.excluding(root.projectSustainabilityWinner);

        bindings.bind(root.sustainableDevelopmentGoals).all(utils.stringLeftPadContainsAnyCondition());
        bindings.bind(root.thematicFocus).all(utils.stringContainsAnyCondition());
        bindings.bind(root.resultType).all(utils.multiValueOrCondition());
        bindings.bind(root.impactArea).all(utils.multiValueOrCondition());
//        bindings.bind(root.organisation.sustainableDevelopmentGoals).all(utils.containsAnyCondition());

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
