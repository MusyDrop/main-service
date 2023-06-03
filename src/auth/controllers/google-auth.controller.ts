import { Body, Controller, Post, Res } from '@nestjs/common';
import { GoogleSignupDto } from '../dtos/google-signup.dto';
import { GoogleAuthService } from '../services/google-auth.service';
import { Response } from 'express';
import { SignupResponseDto } from '../dtos/response/signup-response.dto';
import { GoogleAuthCrdMapper } from '../mappers/google-auth-crd.mapper';

@Controller('/auth/google')
export class GoogleAuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    public readonly responseDtoMapper: GoogleAuthCrdMapper
  ) {}

  @Post('/signup')
  public async signup(
    @Body() body: GoogleSignupDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<SignupResponseDto> {
    const signupInfo = await this.googleAuthService.signup(body.authCode);

    res.clearCookie('Auth');
    res.clearCookie('Refresh');
    res.setHeader('Set-Cookie', [
      signupInfo.accessTokenCookie,
      signupInfo.refreshTokenCookie
    ]);

    return this.responseDtoMapper.signupMapper(signupInfo);
  }
}
