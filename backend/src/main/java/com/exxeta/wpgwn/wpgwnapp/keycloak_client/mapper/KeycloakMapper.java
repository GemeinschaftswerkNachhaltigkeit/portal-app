package com.exxeta.wpgwn.wpgwnapp.keycloak_client.mapper;


import java.util.List;

import org.keycloak.representations.idm.ClientRepresentation;
import org.keycloak.representations.idm.GroupRepresentation;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.exxeta.wpgwn.wpgwnapp.keycloak_client.dto.ClientDto;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.dto.GroupDto;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface KeycloakMapper {

    GroupDto map(GroupRepresentation groupRepresentation);

    List<GroupDto> map(List<GroupRepresentation> groupRepresentation);

    ClientDto mapClient(ClientRepresentation clientRepresentation);

    List<ClientDto> mapClients(List<ClientRepresentation> clientRepresentation);

}
