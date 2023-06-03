import { Injectable } from '@nestjs/common';
import { ResponseDtoMapper } from '../../common/types';
import { StandardAuthController } from '../controllers/standard-auth.controller';
import { SuccessResponseDto } from '../../common/dtos/success-response.dto';
import { SigninResponseDto } from '../dtos/response/signin-response.dto';
import { SignupResponseDto } from '../dtos/response/signup-response.dto';
import { SigninInfo } from '../interfaces/signin-info.interface';
import { User } from '../../users/entities/user.entity';
import { SignupInfo } from '../interfaces/signup-info.interface';
import { UserDto } from "../../users/dto/user.dto";

@Injectable()
export class StandardAuthCrdMapper
  implements ResponseDtoMapper<StandardAuthController>
{
  public logoutMapper(): SuccessResponseDto {
    return new SuccessResponseDto('Logout');
  }

  public refreshMapper(): SuccessResponseDto {
    return new SuccessResponseDto('Refresh of access token');
  }

  public signinMapper(signinInfo: SigninInfo): SigninResponseDto {
    return {
      user: User.toDto(signinInfo.user) as UserDto
    };
  }

  public signupMapper(signupInfo: SignupInfo): SignupResponseDto {
    return {
      user: User.toDto(signupInfo.user) as UserDto
    };
  }
}
