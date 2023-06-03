import { Injectable } from '@nestjs/common';
import { ResponseDtoMapper } from '../../common/types';
import { UsersController } from '../users.controller';
import { User } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UsersCrdMapper implements ResponseDtoMapper<UsersController> {
  public updateMapper(user: User): UserDto {
    return User.toDto(user) as UserDto;
  }
}
