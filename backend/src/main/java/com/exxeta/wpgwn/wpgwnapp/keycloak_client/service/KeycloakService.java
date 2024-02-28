package com.exxeta.wpgwn.wpgwnapp.keycloak_client.service;

import jakarta.ws.rs.core.Response;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.ClientResource;
import org.keycloak.admin.client.resource.ClientsResource;
import org.keycloak.admin.client.resource.GroupResource;
import org.keycloak.admin.client.resource.GroupsResource;
import org.keycloak.admin.client.resource.RoleResource;
import org.keycloak.admin.client.resource.RolesResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.ClientRepresentation;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.keycloak_client.configuration.KeycloakProperties;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.domain.KeycloakConstants;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.domain.WpgwnGroup;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.dto.GroupDto;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.exception.KeycloakEntityNotCreatedException;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.exception.KeycloakUserNotDeletedException;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.mapper.KeycloakMapper;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.security.JwtTokenNames;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;
import com.exxeta.wpgwn.wpgwnapp.user.User;

import com.google.common.collect.Maps;

/**
 * How to and examples: https://gist.github.com/thomasdarimont/c4e739c5a319cf78a4cff3b87173a84b
 * <p>
 * Verschiedene Keycloak aAdmin API Auth Methoden: https://gist.github.com/thomasdarimont/52152ed68486c65b50a04fcf7bd9bbde
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class KeycloakService {

    public static final int SEARCH_PAGE_INDEX = 0;
    public static final int MAX_SEARCH_RESULTS = 25;

    private final KeycloakProperties keycloakProperties;

    private final Keycloak keycloak;

    private final KeycloakMapper keycloakMapper;

    private static String getKeycloakGroupName(OrganisationWorkInProgress organisationWorkInProgress) {
        return organisationWorkInProgress.getName() + "_" + organisationWorkInProgress.getRandomUniqueId();
    }

    public List<GroupRepresentation> getGroups(String searchString) {
        return getGroupResource()
                .groups(searchString, SEARCH_PAGE_INDEX, MAX_SEARCH_RESULTS);
    }

    public List<GroupRepresentation> getGroupsForUser(String userId) {
        return getUserResource(userId).groups();
    }

    public List<GroupRepresentation> getGroups() {
        return getGroupResource().groups();
    }

    private GroupResource getGroupById(@NonNull String groupId) {
        return getGroupResource().group(groupId);
    }

    public Map<String, GroupDto> getGroupPaths() {
        Map<String, GroupDto> paths = Maps.newHashMap();
        List<GroupRepresentation> groups = getGroups();
        insertPaths(paths, groups);
        return paths;
    }

    private void insertPaths(Map<String, GroupDto> paths, List<GroupRepresentation> groups) {
        for (GroupRepresentation group : groups) {
            paths.put(group.getPath(), keycloakMapper.map(group));
            if (!group.getSubGroups().isEmpty()) {
                insertPaths(paths, group.getSubGroups());
            }
        }
    }

    public List<String> getRoles() {
        RolesResource roles = keycloak.realm(keycloakProperties.getRealm()).roles();
        return roles.list().stream().map(RoleRepresentation::getName).collect(Collectors.toUnmodifiableList());
    }

    public List<GroupRepresentation> listGroupsForUser(String userId) {
        UserResource userResource = getUserResource(userId);
        return userResource.groups();
    }

    public String addOrganisationWorkInProgressGroup(OrganisationWorkInProgress organisationWorkInProgress) {
        final GroupRepresentation group = new GroupRepresentation();
        final String keycloakGroupName = getKeycloakGroupName(organisationWorkInProgress);
        group.setName(keycloakGroupName);
        group.singleAttribute(KeycloakConstants.ORGANISATION_WORK_IN_PROGRESS_ID,
                String.valueOf(organisationWorkInProgress.getId()));
        try (Response response = getGroupById(keycloakProperties.getOrganisationGroupId()).subGroup(group)) {
            log.info("add new organisation group to /Organisation [{}]", group);
            return getCreatedId(response);
        }
    }

    public String getAdminsGroupId(@NonNull String keycloakGroupId) {
        final List<GroupRepresentation> subgroups =
                getGroup(keycloakGroupId).getSubGroups(SEARCH_PAGE_INDEX, MAX_SEARCH_RESULTS, true);
        return subgroups.stream()
                .filter(group -> Objects.equals(group.getName(), KeycloakConstants.GROUP_NAME_ADMIN))
                .map(GroupRepresentation::getId)
                .findFirst()
                .orElseGet(() -> createAdminGroup(keycloakGroupId));
    }

    public String createAdminGroup(String organisationGroupId) {
        final GroupRepresentation group = new GroupRepresentation();
        final String keycloakGroupName = KeycloakConstants.GROUP_NAME_ADMIN;
        group.setName(keycloakGroupName);
        try (Response response = getGroupById(organisationGroupId).subGroup(group)) {
            log.info("add admin group to /Organisation/{}", organisationGroupId);
            final String adminGroupId = getCreatedId(response);

            Optional<String> maybeClientId = getClientResource().findAll(true).stream()
                    .filter(clientRepresentation -> Objects.equals(KeycloakConstants.WPGWN_APP_CLIENT,
                            clientRepresentation.getClientId()))
                    .map(ClientRepresentation::getId)
                    .findFirst();

            if (maybeClientId.isPresent()) {
                final String clientId = maybeClientId.get();
                addClientRole(clientId, adminGroupId, PermissionPool.MANAGE_ORGANISATION_USERS);
                addClientRole(clientId, adminGroupId, PermissionPool.ORGANISATION_DELETE);
            }

            return adminGroupId;
        }
    }

    private void addClientRole(String clientId, String adminGroupId, String role) {
        List<RoleRepresentation> organisationDeleteRole = getRole(clientId, role);
        if (!organisationDeleteRole.isEmpty()) {
            getGroupResource().group(adminGroupId).roles().clientLevel(clientId).add(organisationDeleteRole);
        }
    }

    public void deleteOrganisationGroup(String orgaGroupId) {
        GroupResource organisationGroup = getGroup(orgaGroupId);
        organisationGroup.remove();
    }

    private List<RoleRepresentation> getRole(String clientId, String role) {
        return Optional.ofNullable(clientId)
                .map(id -> getClientResource().get(id))
                .map(ClientResource::roles)
                .map(rolesResource -> rolesResource.get(role))
                .map(RoleResource::toRepresentation)
                .map(List::of)
                .orElse(List.of());
    }

    /**
     * Sucht die ID der Gruppe mit dem Namen.
     *
     * @param workInProgress
     * @return
     */
    public Optional<String> findGroupIdFor(OrganisationWorkInProgress workInProgress) {
        final String keycloakGroupName = getKeycloakGroupName(workInProgress);
        return getGroupResource().groups(keycloakGroupName, SEARCH_PAGE_INDEX, MAX_SEARCH_RESULTS, false)
                .stream()
                .flatMap(groupRepresentation -> groupRepresentation.getSubGroups().stream())
                .filter(groupRepresentation -> Objects.equals(keycloakGroupName, groupRepresentation.getName()))
                .findFirst()
                .map(GroupRepresentation::getId);
    }

    /**
     * Aktualisiert die Organisations ID im Keycloak, nachdem die Organisation freigeschaltet wurde, d.h. die
     * {@code OrganisationWorkInProgress} wurde in eine {@code Organisation} überführt.
     *
     * @param organisation die im Keycloak zu aktualisierende Organisation
     */
    public void updateOrganisationWorkInProgressToOrganisation(Organisation organisation) {
        Objects.requireNonNull(organisation.getKeycloakGroupId());
        Objects.requireNonNull(organisation.getId());

        final GroupResource organisationGroup = getGroupById(organisation.getKeycloakGroupId());
        final GroupRepresentation groupRepresentation = organisationGroup.toRepresentation();
        groupRepresentation.getAttributes().remove(KeycloakConstants.ORGANISATION_WORK_IN_PROGRESS_ID);
        groupRepresentation.singleAttribute(KeycloakConstants.ORGANISATION_ID, String.valueOf(organisation.getId()));
        organisationGroup.update(groupRepresentation);
    }

    private GroupsResource getGroupResource() {
        return keycloak.realm(keycloakProperties.getRealm()).groups();
    }

    private ClientsResource getClientsResource() {
        return keycloak.realm(keycloakProperties.getRealm()).clients();
    }


    public void addGroupToUser(String keycloakId, String groupId) {
        UserResource userResource = getUserResource(keycloakId);
        log.info("add user [{}] to group [{}]", keycloakId, groupId);
        userResource.joinGroup(groupId);
    }

    public void removeGroupFromUser(String keycloakUserId, String groupId) {
        UserResource userResource = getUserResource(keycloakUserId);
        log.info("remove user [{}] from group [{}]", keycloakUserId, groupId);
        userResource.leaveGroup(groupId);
    }

    public void removeGroupFromUserById(String userId, String groupId) {
        UserResource userResource = getUsersResource().get(userId);
        log.info("remove user [{}] from group [{}]", userId, groupId);
        userResource.leaveGroup(groupId);
    }

    public void removeAllGroupFromUser(String username) {
        UserResource userResource = getUserResource(username);
        List<GroupRepresentation> groupsInKeycloak = userResource.groups();
        for (GroupRepresentation groupRepresentation : groupsInKeycloak) {
            String groupId = groupRepresentation.getId();
            userResource.leaveGroup(groupRepresentation.getId());
            log.info("remove user [{}] from group [{}]", username, groupId);
        }
    }

    public void addGroupsToUser(String username, Set<WpgwnGroup> groupsFromUser) {
        UserResource userResource = getUserResource(username);
        Map<String, GroupDto> groupMaps = getGroupPaths();
        for (WpgwnGroup rcpGroup : groupsFromUser) {
            if (groupMaps.containsKey(rcpGroup.getGroupPath())) {
                String groupId = groupMaps.get(rcpGroup.getGroupPath()).getId();
                userResource.joinGroup(groupId);
                log.info("add user [{}] to group [{}]", username, groupId);
            }
        }
    }

    public void updateOrganisationForUser(String username, Long organisationId) {
        UserRepresentation user = getUser(username);
        user.singleAttribute(KeycloakConstants.ORGANISATION_ID, String.valueOf(organisationId));

        log.debug("Setting organisation id for user [{}] to [{}]", username, organisationId);
        getUsersResource().get(user.getId()).update(user);
    }

    public void deleteOrganisationForUser(String username) {
        UserRepresentation user = getUser(username);
        if (Objects.nonNull(user.getAttributes())) {
            List<String> previousOrganisationId = user.getAttributes().remove(KeycloakConstants.ORGANISATION_ID);
            if (Objects.nonNull(previousOrganisationId)) {
                log.debug("Removing organisation id from user [{}]", username);
                getUsersResource().get(user.getId()).update(user);
            }
        }
    }

    public void changeUserPassword(String username, String password, boolean temporary) {
        CredentialRepresentation passwordCred = new CredentialRepresentation();
        passwordCred.setTemporary(temporary);
        passwordCred.setType(CredentialRepresentation.PASSWORD);
        passwordCred.setValue(password);

        final UsersResource usersResource = getUsersResource();
        UserRepresentation user = getUser(username);

        usersResource.get(user.getId()).resetPassword(passwordCred);
    }

    public UserRepresentation getUser(String username) throws UsernameNotFoundException {
        final List<UserRepresentation> userRepresentations = getUsersResource().search(username, true);
        if (Objects.isNull(userRepresentations) || userRepresentations.size() != 1) {
            throw new UsernameNotFoundException("user with name ["
                    + username
                    + "}] not found or not unique. Size ["
                    + (userRepresentations == null ? "null" : userRepresentations.size())
                    + "]");
        }
        return userRepresentations.get(0);
    }

    public boolean userExists(String username) {
        if (!StringUtils.hasText(username)) {
            return false;
        }

        final List<UserRepresentation> userRepresentations = getUsersResource().search(username, true);
        return Objects.nonNull(userRepresentations) && userRepresentations.size() == 1;
    }

    public UserResource getUserResource(String keycloakUserId) {
        return getUsersResource().get(keycloakUserId);
    }

    private UsersResource getUsersResource() {
        return keycloak.realm(keycloakProperties.getRealm()).users();
    }

    private ClientsResource getClientResource() {
        return keycloak.realm(keycloakProperties.getRealm()).clients();
    }

    public String createKeycloakUser(User user) throws KeycloakEntityNotCreatedException {
        return createKeycloakUser(user, List.of(), false);
    }

    public String createKeycloakUser(User user, List<String> actions) {
        return createKeycloakUser(user, actions, false);
    }

    public String createKeycloakUser(User user, List<String> actions, boolean passwordTemporary)
            throws KeycloakEntityNotCreatedException {
        UserRepresentation userRep = new UserRepresentation();
        userRep.setEnabled(true);
        userRep.setUsername(user.getEmail());
        userRep.setFirstName(user.getFirstName());
        userRep.setLastName(user.getLastName());
        userRep.setEmail(user.getEmail());
        userRep.setEmailVerified(true);
        if (Objects.nonNull(user.getOrganisationId())) {
            userRep.singleAttribute(KeycloakConstants.ORGANISATION_ID, String.valueOf(user.getOrganisationId()));
        } else if (Objects.nonNull(user.getOrganisationWorkInProgressId())) {
            userRep.singleAttribute(KeycloakConstants.ORGANISATION_WORK_IN_PROGRESS_ID,
                    String.valueOf(user.getOrganisationWorkInProgressId()));
        }
        if (StringUtils.hasText(user.getPassword())) {
            CredentialRepresentation passwordCred = new CredentialRepresentation();
            passwordCred.setTemporary(passwordTemporary);
            passwordCred.setType(CredentialRepresentation.PASSWORD);
            passwordCred.setValue(user.getPassword());
            userRep.setCredentials(List.of(passwordCred));
        }
        try (Response response = getUsersResource().create(userRep)) {
            String userId = getCreatedId(response);

            if (!CollectionUtils.isEmpty(actions)) {
                getUsersResource().get(userId).executeActionsEmail(actions);
            }

            return userId;
        }
    }

    public void updateKeycloakUser(String username, User updatedUser) {
        UserRepresentation userRep = getUser(username);
        userRep.setUsername(updatedUser.getEmail());
        userRep.setFirstName(updatedUser.getFirstName());
        userRep.setLastName(updatedUser.getLastName());
        userRep.setEmail(updatedUser.getEmail());
        userRep.setEnabled(true);
        if (Objects.nonNull(updatedUser.getOrganisationId())) {
            userRep.singleAttribute(KeycloakConstants.ORGANISATION_ID, String.valueOf(updatedUser.getOrganisationId()));
        } else {
            userRep.getAttributes().remove(KeycloakConstants.ORGANISATION_ID);
        }
        getUsersResource().get(userRep.getId()).update(userRep);
    }

    public void setEmailValidated(UserRepresentation userRepresentation, boolean isValidated) {
        userRepresentation.setEmailVerified(isValidated);
        getUsersResource().get(userRepresentation.getId()).update(userRepresentation);
    }

    public void deleteKeycloakUser(User user) throws KeycloakUserNotDeletedException {
        UserRepresentation userRep = getUser(user.getEmail());
        try (Response response = getUsersResource().delete(userRep.getId())) {
            final HttpStatus httpStatus = HttpStatus.valueOf(response.getStatus());
            if (httpStatus.is4xxClientError() || httpStatus.is5xxServerError()) {
                throw new KeycloakUserNotDeletedException(user.getEmail(), response);
            }
        }
    }

    public void lockKeycloakUser(User user) {
        UserRepresentation userRep = getUser(user.getEmail());
        userRep.setEnabled(false);
        getUsersResource().get(userRep.getId()).update(userRep);
    }

    public void unlockKeycloakUser(User user) {
        UserRepresentation userRep = getUser(user.getEmail());
        userRep.setEnabled(true);
        getUsersResource().get(userRep.getId()).update(userRep);
    }

    public void sendUpdatePasswordEmailToUser(User user) {
        UserRepresentation userRep = getUser(user.getEmail());
        if (!userRep.isEnabled()) {
            unlockKeycloakUser(user);
        }
        List<String> actions = List.of(KeycloakConstants.UPDATE_PASSWORD);
        getUsersResource().get(userRep.getId()).executeActionsEmail(actions);
    }

    private String getCreatedId(Response response) throws KeycloakEntityNotCreatedException {
        URI location = response.getLocation();
        if (!response.getStatusInfo().equals(Response.Status.CREATED)) {
            throw new KeycloakEntityNotCreatedException(response);
        }
        if (Objects.isNull(location)) {
            return null;
        }
        String path = location.getPath();
        return path.substring(path.lastIndexOf('/') + 1);
    }

    public GroupResource getGroup(String id) {
        return getGroupResource().group(id);
    }

    /**
     * Legt eine Keycloak Gruppe für die Organisation an, falls noch keine vorhanden ist und fügt den Nutzer der Gruppe hinzu.
     *
     * @param principal
     * @param organisationWorkInProgress
     * @return true, falls eine neue Keycloak Gruppe angelegt wurde und die Organisation gespeichert werden muss,
     * sonst false
     */
    public boolean createKeycloakGroupForOrganisationWorkInProgress(@NonNull OAuth2AuthenticatedPrincipal principal,
                                                                    @NonNull
                                                                    OrganisationWorkInProgress organisationWorkInProgress) {
        if (StringUtils.hasText(organisationWorkInProgress.getKeycloakGroupId())) {
            if (Objects.isNull(principal.getAttribute(JwtTokenNames.ORGANISATION_WORK_IN_PROGRESS_ID))) {
                throw new AccessDeniedException("User has no id ["
                        + JwtTokenNames.ORGANISATION_WORK_IN_PROGRESS_ID
                        + "] but organisation a group assigned ["
                        + organisationWorkInProgress.getKeycloakGroupId()
                        + "]");
            }
            log.debug("organisation [{}] has already keycloak group assigned [{}]",
                    organisationWorkInProgress.getRandomUniqueId(), organisationWorkInProgress.getKeycloakGroupId());
            return false;
        }

        // keycloak gruppe anlegen und Nutzer der Gruppe hinzufügen, damit dieser seite org wieder finden kann.
        final String keycloakGroupId = findGroupIdFor(organisationWorkInProgress)
                .orElseGet(() -> addOrganisationWorkInProgressGroup(organisationWorkInProgress));

        organisationWorkInProgress.setKeycloakGroupId(keycloakGroupId);

        if (Objects.isNull(principal.getAttribute(KeycloakConstants.ORGANISATION_WORK_IN_PROGRESS_ID))) {
            log.debug("Adding user [{}] to group [{}]", principal.getName(),
                    organisationWorkInProgress.getKeycloakGroupId());
            addGroupToUser(principal.getName(), getAdminsGroupId(keycloakGroupId));
        } else {
            log.debug("User [{}] is already assigned to the organisation wip [{}].", principal.getName(),
                    organisationWorkInProgress.getId());
        }

        return true;
    }

    public Optional<String> getFirstUserWithEmailInGroup(String groupId) {
        return getGroup(groupId).members().stream()
                .filter(userRepresentation -> StringUtils.hasText(userRepresentation.getEmail())
                        && Boolean.TRUE.equals(userRepresentation.isEmailVerified())).findFirst()
                .map(UserRepresentation::getId);
    }
}
