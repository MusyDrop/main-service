import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { ProfilesService } from '../../users/profiles.service';
import { SignupDto } from '../dtos/signup.dto';
import { SignupResponseDto } from '../dtos/response/signup-response.dto';
import { AuthUtilsService } from './auth-utils.service';
import { JwtTokensService } from './jwt-tokens.service';
import { EmailVerificationsService } from './email-verifications.service';

@Injectable()
export class StandardAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly authUtilsService: AuthUtilsService,
    private readonly jwtTokensService: JwtTokensService,
    private readonly emailVerificationService: EmailVerificationsService
  ) {}

  public async signup(signupDto: SignupDto): Promise<SignupResponseDto> {
    const existingUser = await this.usersService.findByNullable({
      email: signupDto.email
    });

    if (existingUser) {
      throw new BadRequestException('User with such email already exists');
    }

    const passwordHash = await this.authUtilsService.generateBcryptHash(
      signupDto.password
    );

    const user = await this.usersService.create({
      email: signupDto.email,
      password: passwordHash
    });

    await this.profilesService.create({
      firstName: signupDto.firstName,
      lastName: signupDto.lastName,
      country: signupDto.country,
      phone: signupDto.phone,
      user: { id: user.id }
    });

    const {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt
    } = await this.jwtTokensService.generateTokenPair({
      userId: user.id,
      userEmail: user.email,
      userGuid: user.guid,
      roles: []
    });

    const emailVerification =
      await this.emailVerificationService.sendEmailVerification(
        user.id,
        user.email
      );

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
      email: user.email,
      userGuid: user.guid,
      emailVerificationGuid: emailVerification.guid
    };
  }
}
