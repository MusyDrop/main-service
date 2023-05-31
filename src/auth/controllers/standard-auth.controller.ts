import { Body, Controller, Post, Response } from '@nestjs/common';
import { StandardAuthService } from '../services/standard-auth.service';
import { SignupDto } from '../dtos/signup.dto';
import { SignupResponseDto } from '../dtos/response/signup-response.dto';
import { SigninDto } from '../dtos/signin.dto';
import { SigninResponseDto } from '../dtos/response/signin-response.dto';
import express from 'express';

@Controller('/standard-auth')
export class StandardAuthController {
  constructor(private readonly standardAuthService: StandardAuthService) {}

  @Post('/signup')
  public async signup(@Body() body: SignupDto): Promise<SignupResponseDto> {
    const signupInfo = await this.standardAuthService.signup(body);

    return {
      email: signupInfo.email,
      userGuid: signupInfo.userGuid
    };
  }

  @Post('/signin')
  public async signin(
    @Body() body: SigninDto,
    @Response({ passthrough: true }) res: express.Response
  ): Promise<SigninResponseDto> {
    const signinInfo = await this.standardAuthService.signin(body);

    res.setHeader('Set-Cookie', [
      signinInfo.accessTokenCookie,
      signinInfo.refreshTokenCookie
    ]);

    return {
      user: {
        email: signinInfo.user.email,
        guid: signinInfo.user.guid,
        profile: {
          firstName: signinInfo.user.profile.firstName,
          lastName: signinInfo.user.profile.lastName,
          phone: signinInfo.user.profile.phone,
          country: signinInfo.user.profile.country
        }
      }
    };
  }
}
