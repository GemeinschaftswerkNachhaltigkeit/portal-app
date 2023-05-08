package com.exxeta.wpgwn.wpgwnapp.organisation;

import org.springframework.data.querydsl.binding.QuerydslBinderCustomizer;
import org.springframework.data.querydsl.binding.QuerydslBindings;

import com.exxeta.wpgwn.wpgwnapp.organisation.model.QOrganisation;
import com.exxeta.wpgwn.wpgwnapp.utils.BindingCustomizerUtils;

public class OrganisationBindingCustomizer implements QuerydslBinderCustomizer<QOrganisation> {

    private final BindingCustomizerUtils utils = new BindingCustomizerUtils();

    @Override
    public void customize(QuerydslBindings bindings, QOrganisation root) {

        // only evaluate the first parameter for the binding.
//        bindings.bind(root.thematicFocus).first((path, value) -> value.stream()
//                .map(thematicFoci -> path.any().eq(thematicFoci))
//                .reduce(BooleanExpression::or).get() );

        bindings.excluding(root.location);
        bindings.excluding(root.contact);
        bindings.excluding(root.logo);
        bindings.excluding(root.image);
        bindings.excluding(root.privacyConsent);
        bindings.excluding(root.socialMediaContacts);
        bindings.excluding(root.keycloakGroupId);
        bindings.excluding(root.description);
        bindings.excluding(root.activities);

        bindings.bind(root.organisationType).all(utils.multiValueOrCondition());
        bindings.bind(root.thematicFocus).all(utils.multiValueAndOrConditionsForEnum());
        bindings.bind(root.sustainableDevelopmentGoals).all(utils.multiValueAndOrConditionForNumber());
    }
}
