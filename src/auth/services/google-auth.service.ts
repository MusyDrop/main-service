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

    const existingUser = await this.usersService.findOneNullable({
      email: userInfo.email
    });

    if (existingUser) {
      await this.usersService.updateByEmail(userInfo.email, {
        isOAuthEnabled: true
      });

      const pair = await this.jwtService.generateTokenPair({
        userId: existingUser.id,
        userEmail: existingUser.email,
        userGuid: existingUser.guid,
        roles: [],
        isTwoFactorAuthGranted: false
      });

      return {
        user: existingUser,
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
      user: { id: newUser.id },
      profilePictureUrl: userInfo.picture
    });

    const pair = await this.jwtService.generateTokenPair({
      userId: newUser.id,
      userEmail: newUser.email,
      userGuid: newUser.guid,
      roles: [],
      isTwoFactorAuthGranted: false
    });

    return {
      user: newUser,
      accessToken: pair.accessToken,
      accessTokenExpiresAt: pair.accessTokenExpiresAt,
      accessTokenCookie: pair.accessTokenCookie,

      refreshToken: pair.refreshToken,
      refreshTokenExpiresAt: pair.refreshTokenExpiresAt,
      refreshTokenCookie: pair.refreshTokenCookie
    };
  }
}
