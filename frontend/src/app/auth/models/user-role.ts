export enum UserRole {
  ORGANISATION_SUBMIT_FOR_APPROVAL = 'ORGANISATION_SUBMIT_FOR_APPROVAL',
  ORGANISATION_CHANGE = 'ORGANISATION_CHANGE',
  ORGANISATION_PUBLISH = 'ORGANISATION_PUBLISH',
  ACTIVITY_CHANGE = 'ACTIVITY_CHANGE',
  ACTIVITY_PUBLISH = 'ACTIVITY_PUBLISH',
  GUEST = 'GUEST',
  ORGANISATION_ADMIN = 'ORGANISATION_ADMIN',
  RNE_ADMIN = 'RNE_ADMIN',
  MANAGE_ORGANISATION_USERS = 'MANAGE_ORGANISATION_USERS',
  MARKETPLACE_FEATURE = 'MARKETPLACE_FEATURE'
}

export enum UserPermission {
  GUEST = 'GUEST',
  ORGANISATION_OWNER = 'ORGANISATION_OWNER',
  RNE_ADMIN = 'RNE_ADMIN'
}

// todo: check permissions
export const UserPermissionRoleMap = {
  [UserPermission.RNE_ADMIN]: [UserRole.RNE_ADMIN],
  [UserPermission.ORGANISATION_OWNER]: [
    UserRole.ACTIVITY_CHANGE,
    UserRole.ORGANISATION_CHANGE,
    UserRole.ORGANISATION_SUBMIT_FOR_APPROVAL
  ],
  [UserPermission.GUEST]: [UserRole.GUEST]
};
