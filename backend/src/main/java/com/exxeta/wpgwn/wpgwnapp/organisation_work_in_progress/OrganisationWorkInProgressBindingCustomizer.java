package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress;

import org.springframework.data.querydsl.binding.QuerydslBinderCustomizer;
import org.springframework.data.querydsl.binding.QuerydslBindings;

import com.exxeta.wpgwn.wpgwnapp.utils.BindingCustomizerUtils;

public class OrganisationWorkInProgressBindingCustomizer implements
        QuerydslBinderCustomizer<QOrganisationWorkInProgress> {

    private final BindingCustomizerUtils utils = new BindingCustomizerUtils();

    @Override
    public void customize(QuerydslBindings bindings, QOrganisationWorkInProgress root) {

        bindings.bind(root.thematicFocus).all(utils.multiValueAndOrConditionsForEnum());
        bindings.bind(root.status).all(utils.multiValueOrCondition());
        bindings.bind(root.sustainableDevelopmentGoals).all(utils.multiValueAndOrConditionForNumber());
    }

}
