import { UserRole } from './user-role';

export interface User {
  azp: string;
  lastName: string;
  firstName: string;
  username: string;
  email: string;
  roles: UserRole[];
  justRegistered: boolean;
  orgWipId?: number;
  orgId?: number;
  sub?: string;
}
