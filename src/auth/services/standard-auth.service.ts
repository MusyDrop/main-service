import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { ProfilesService } from '../../users/profiles.service';
import { SignupDto } from '../dtos/signup.dto';
import { AuthUtilsService } from './auth-utils.service';
import { JwtTokensService } from './jwt-tokens.service';
import { EmailVerificationsService } from './email-verifications.service';
import { SigninDto } from '../dtos/signin.dto';
import { SignupInfo } from '../interfaces/signup-info.interface';
import { SigninInfo } from '../interfaces/signin-info.interface';
import { AuthGuard } from '../guards/auth.guard';
import { GeneratedJwt } from '../interfaces/generated-jwt.interface';

@Injectable()
export class StandardAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly authUtilsService: AuthUtilsService,
    private readonly jwtTokensService: JwtTokensService,
    private readonly emailVerificationService: EmailVerificationsService
  ) {}

  public async signup(signupDto: SignupDto): Promise<SignupInfo> {
    const existingUser = await this.usersService.findOneNullable({
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
      accessTokenCookie,
      refreshToken,
      refreshTokenExpiresAt,
      refreshTokenCookie
    } = await this.jwtTokensService.generateTokenPair({
      userId: user.id,
      userEmail: user.email,
      userGuid: user.guid,
      roles: []
    });

    await this.emailVerificationService.sendEmailVerification(
      user.id,
      user.email
    );

    return {
      email: user.email,
      userGuid: user.guid,

      accessToken,
      accessTokenExpiresAt,
      accessTokenCookie,
      refreshToken,
      refreshTokenExpiresAt,
      refreshTokenCookie
    };
  }

  public async signin(dto: SigninDto): Promise<SigninInfo> {
    const user = await this.usersService.findOneWithProfileNullable({
      email: dto.email
    });

    if (!user) {
      throw new BadRequestException('Email or password is incorrect');
    }

    if (!user.password) {
      throw new UnprocessableEntityException('Please use your OAuth provider');
    }

    const isPasswordCorrect =
      await this.authUtilsService.comparePasswordCandidate(
        dto.password,
        user.password
      );

    if (!isPasswordCorrect) {
      throw new BadRequestException('Email or password is incorrect');
    }

    const emailVerification =
      await this.emailVerificationService.findOneNullable({
        user: { id: user.id },
        verified: true
      });

    if (!emailVerification) {
      throw new BadRequestException(
        'Please verify your email in order to sign in.'
      );
    }

    const {
      accessToken,
      accessTokenExpiresAt,
      accessTokenCookie,
      refreshToken,
      refreshTokenExpiresAt,
      refreshTokenCookie
    } = await this.jwtTokensService.generateTokenPair({
      userId: user.id,
      userEmail: user.email,
      userGuid: user.guid,
      roles: []
    });

    return {
      user,
      accessToken,
      accessTokenExpiresAt,
      accessTokenCookie,
      refreshToken,
      refreshTokenExpiresAt,
      refreshTokenCookie
    };
  }

  public async refresh(
    userId: number,
    refreshToken: string
  ): Promise<GeneratedJwt> {
    const user = await this.usersService.findOne({
      id: userId
    });

    const token = await this.jwtTokensService.findRefreshTokenNullable({
      user: { id: userId },
      token: refreshToken
    });

    if (!token) {
      throw new UnauthorizedException('Session was terminated.');
    }

    return this.jwtTokensService.generateAccessToken({
      userId,
      userGuid: user.guid,
      userEmail: user.email,
      roles: []
    });
  }
}
