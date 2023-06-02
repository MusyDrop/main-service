import { Injectable } from '@nestjs/common';
import { SignupInfo } from '../interfaces/signup-info.interface';
import { ExtendedConfigService } from '../../config/extended-config.service';
import { GoogleHttpService } from './google-http.service';
import { UsersService } from '../../users/users.service';
import { JwtTokensService } from './jwt-tokens.service';
import { ProfilesService } from '../../users/profiles.service';

@Injectable()
export class GoogleAuthService {
  constructor(
    private readonly config: ExtendedConfigService,
    private readonly googleHttpService: GoogleHttpService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtTokensService,
    private readonly profilesServices: ProfilesService
  ) {}

  /**
   * Signs up user using google OAuth2
   * @param authCode
   */
  public async signup(authCode: string): Promise<SignupInfo> {
    const userInfo = await this.googleHttpService.getUserInfoByAuthCode(
      authCode
    );

    const user = await this.usersService.findOneNullable({
      email: userInfo.email
    });

    if (user) {
      await this.usersService.updateByEmail(userInfo.email, {
        isOAuthEnabled: true
      });

      const pair = await this.jwtService.generateTokenPair({
        userId: user.id,
        userEmail: user.email,
        userGuid: user.guid,
        roles: [],
        isTwoFactorAuthGranted: false
      });

      return {
        userGuid: user.guid,
        email: user.email,

        accessToken: pair.accessToken,
        accessTokenExpiresAt: pair.accessTokenExpiresAt,
        accessTokenCookie: pair.accessTokenCookie,

        refreshToken: pair.refreshToken,
        refreshTokenExpiresAt: pair.refreshTokenExpiresAt,
        refreshTokenCookie: pair.refreshTokenCookie
      };
    }

    const newUser = await this.usersService.create({
      email: userInfo.email,
      isOAuthEnabled: true
    });

    await this.profilesServices.create({
      firstName: userInfo.given_name,
      lastName: userInfo.family_name,
      country: userInfo.locale,
      user: { id: user.id },
      profilePictureUrl: userInfo.picture
    });

    const pair = await this.jwtService.generateTokenPair({
      userId: user.id,
      userEmail: user.email,
      userGuid: user.guid,
      roles: [],
      isTwoFactorAuthGranted: false
    });

    return {
      userGuid: newUser.guid,
      email: newUser.email,

      accessToken: pair.accessToken,
      accessTokenExpiresAt: pair.accessTokenExpiresAt,
      accessTokenCookie: pair.accessTokenCookie,

      refreshToken: pair.refreshToken,
      refreshTokenExpiresAt: pair.refreshTokenExpiresAt,
      refreshTokenCookie: pair.refreshTokenCookie
    };
  }
}
