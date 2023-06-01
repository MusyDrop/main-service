import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { StandardAuthService } from '../services/standard-auth.service';
import { SignupDto } from '../dtos/signup.dto';
import { SignupResponseDto } from '../dtos/response/signup-response.dto';
import { SigninDto } from '../dtos/signin.dto';
import { SigninResponseDto } from '../dtos/response/signin-response.dto';
import express, { Request, Response } from 'express';
import { SuccessResponseDto } from '../../common/dtos/success-response.dto';
import { AuthRefreshGuard } from '../guards/auth-refresh.guard';

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
    @Res({ passthrough: true }) res: Response
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

  @UseGuards(AuthRefreshGuard)
  @Get('/refresh')
  public async refresh(
    @Req() req: Request,
    @Res({ passthrough: true })
    res: express.Response
  ): Promise<SuccessResponseDto> {
    const generatedJwt = await this.standardAuthService.refresh(
      req.userId,
      req.refreshToken
    );

    res.setHeader('Set-Cookie', [generatedJwt.cookie]);

    return new SuccessResponseDto('Refresh of access token');
  }
}
