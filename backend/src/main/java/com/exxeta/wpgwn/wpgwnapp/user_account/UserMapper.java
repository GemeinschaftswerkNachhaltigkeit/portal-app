package com.exxeta.wpgwn.wpgwnapp.user_account;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.dto.UserAccountDto;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Contact;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ContactWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.user.User;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface UserMapper {

    @Mapping(target = "email", source = "contact.email")
    @Mapping(target = "firstName", source = "contact.firstName")
    @Mapping(target = "lastName", source = "contact.lastName")
    @Mapping(target = "organisationId", source = "orgId")
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "organisationWorkInProgressId", ignore = true)
    User mapOrganisationUserFromContact(Long orgId, Contact contact);

    @Mapping(target = "email", source = "contactWorkInProgress.email")
    @Mapping(target = "firstName", source = "contactWorkInProgress.firstName")
    @Mapping(target = "lastName", source = "contactWorkInProgress.lastName")
    @Mapping(target = "password", source = "userAccountDto.password")
    @Mapping(target = "organisationId", ignore = true)
    @Mapping(target = "organisationWorkInProgressId", source = "orgId")
    User mapOrganisationWorkInProgressUserFromContact(Long orgId, UserAccountDto userAccountDto,
                                                      ContactWorkInProgress contactWorkInProgress);

}
