import { Injectable } from '@nestjs/common';
import { ResponseDtoMapper } from '../../common/types';
import { TwoFactorAuthController } from '../controllers/two-factor-auth.controller';
import { SuccessResponseDto } from '../../common/dtos/success-response.dto';
import { SigninResponseDto } from '../dtos/response/signin-response.dto';
import { SigninInfo } from '../interfaces/signin-info.interface';
import { User } from '../../users/entities/user.entity';
import { UserDto } from '../../users/dto/user.dto';

@Injectable()
export class TwoFactorAuthCrdMapper
  implements ResponseDtoMapper<TwoFactorAuthController>
{
  public generateMapper(): SuccessResponseDto {
    return new SuccessResponseDto('2FA QR-code generation');
  }

  public enableMapper(): SuccessResponseDto {
    return new SuccessResponseDto('Enabling 2FA');
  }

  public signinMapper(signinInfo: SigninInfo): SigninResponseDto {
    return {
      user: User.toDto(signinInfo.user) as UserDto
    };
  }
}
