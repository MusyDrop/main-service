import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException
} from '@nestjs/common';
import { GeneratedTwoFactorCredentials } from '../interfaces/generated-2fa-credentials.interface';
import { authenticator } from 'otplib';
import { ExtendedConfigService } from '../../config/extended-config.service';
import { UsersService } from '../../users/users.service';
import { TwoFactorEnableInfo } from '../interfaces/two-factor-enable-info.interface';
import { JwtTokensService } from './jwt-tokens.service';
import { SigninInfo } from '../interfaces/signin-info.interface';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    private readonly config: ExtendedConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtTokensService
  ) {}

  public async generateTwoFactorAuthSecret(
    email: string
  ): Promise<GeneratedTwoFactorCredentials> {
    const secret = authenticator.generateSecret();

    const otpAuthUrl = authenticator.keyuri(
      email,
      this.config.get('auth.twoFactorAuthAppName'),
      secret
    );

    await this.usersService.updateByEmail(email, {
      twoFactorAuthSecret: secret
    });

    return {
      secret,
      otpAuthUrl
    };
  }

  public async enableTwoFactorAuth(
    userId: number,
    authCode: string
  ): Promise<TwoFactorEnableInfo> {
    const signinInfo = await this.singin(userId, authCode);

    await this.usersService.updateById(userId, {
      isTwoFactorAuthEnabled: true
    });

    return signinInfo;
  }

  public async singin(userId: number, authCode: string): Promise<SigninInfo> {
    const user = await this.usersService.findOneWithProfile({ id: userId });

    if (!user.twoFactorAuthSecret) {
      throw new UnprocessableEntityException(
        'Please, register our app in the OTP provider'
      );
    }

    const valid = authenticator.verify({
      secret: user.twoFactorAuthSecret as string, // user has generated secret at this point
      token: authCode
    });

    if (!valid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }

    const pair = await this.jwtService.generateTokenPair({
      userId: user.id,
      userEmail: user.email,
      userGuid: user.guid,
      isTwoFactorAuthGranted: true,
      roles: []
    });

    return {
      user,

      accessToken: pair.accessToken,
      accessTokenExpiresAt: pair.accessTokenExpiresAt,
      accessTokenCookie: pair.accessTokenCookie,

      refreshToken: pair.refreshToken,
      refreshTokenExpiresAt: pair.refreshTokenExpiresAt,
      refreshTokenCookie: pair.refreshTokenCookie
    };
  }
}
