import { Injectable } from '@nestjs/common';
import { ResponseDtoMapper } from '../../common/types';
import { GoogleAuthController } from '../controllers/google-auth.controller';
import { SignupResponseDto } from '../dtos/response/signup-response.dto';
import { SignupInfo } from '../interfaces/signup-info.interface';

@Injectable()
export class GoogleAuthCrdMapper
  implements ResponseDtoMapper<GoogleAuthController>
{
  public signupMapper(signupInfo: SignupInfo): SignupResponseDto {
    return {
      email: signupInfo.email,
      userGuid: signupInfo.userGuid
    };
  }
}
