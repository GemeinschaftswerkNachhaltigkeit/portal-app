import { UserType } from '../../shared/models/user-type';

type UserDto = {
  firstName: string;
  lastName: string;
  email: string;
  userType: UserType;
};

export default UserDto;
