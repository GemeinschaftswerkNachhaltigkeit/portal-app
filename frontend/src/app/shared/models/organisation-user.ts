import { UserStatus } from 'src/app/shared/models/user-status';
import { UserType } from 'src/app/shared/models/user-type';

export type OrgaUserDto = {
  UUID: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: UserType;
  status: UserStatus;
};
