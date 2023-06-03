import { Injectable } from '@nestjs/common';
import { ResponseDtoMapper } from '../../common/types';
import { GoogleAuthController } from '../controllers/google-auth.controller';
import { SignupResponseDto } from '../dtos/response/signup-response.dto';
import { SignupInfo } from '../interfaces/signup-info.interface';
import { User } from '../../users/entities/user.entity';
import { UserDto } from '../../users/dto/user.dto';

@Injectable()
export class GoogleAuthCrdMapper
  implements ResponseDtoMapper<GoogleAuthController>
{
  public signupMapper(signupInfo: SignupInfo): SignupResponseDto {
    return {
      user: User.toDto(signupInfo.user) as UserDto
    };
  }
}
