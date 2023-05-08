import { UserStatus } from '../../shared/models/user-status';
import { UserType } from '../../shared/models/user-type';

type UserListDto = {
  email: string;
  userType: UserType;
  status: UserStatus;
};

export default UserListDto;
