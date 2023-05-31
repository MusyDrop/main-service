import { ProfileDto } from './profile.dto';

export class UserDto {
  guid: string;
  email: string;

  profile: ProfileDto;
}
