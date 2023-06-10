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
import { AuthGuard } from '../guards/auth.guard';
import { StandardAuthCrdMapper } from '../mappers/standard-auth-crd.mapper';

@Controller('/auth/standard')
export class StandardAuthController {
  constructor(
    private readonly standardAuthService: StandardAuthService,
    private readonly responseMapper: StandardAuthCrdMapper
  ) {}

  @Post('/signup')
  public async signup(
    @Body() body: SignupDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<SignupResponseDto> {
    const signupInfo = await this.standardAuthService.signup(body);
    res.clearCookie('Auth');
    res.clearCookie('Refresh');
    res.setHeader('Set-Cookie', [
      signupInfo.accessTokenCookie,
      signupInfo.refreshTokenCookie
    ]);
    return this.responseMapper.signupMapper(signupInfo);
  }

  @Post('/signin')
  public async signin(
    @Body() body: SigninDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<SigninResponseDto> {
    const signinInfo = await this.standardAuthService.signin(body);
    res.clearCookie('Auth');
    res.clearCookie('Refresh');
    res.setHeader('Set-Cookie', [
      signinInfo.accessTokenCookie,
      signinInfo.refreshTokenCookie
    ]);
    return this.responseMapper.signinMapper(signinInfo);
  }

  @UseGuards(AuthRefreshGuard)
  @Get('/refresh')
  public async refresh(
    @Req() req: Request,
    @Res({ passthrough: true })
    res: express.Response
  ): Promise<SuccessResponseDto> {
    const generatedJwt = await this.standardAuthService.refreshAccessToken(
      req.user.id,
      req.refreshToken as string
    );
    res.clearCookie('Auth');
    res.setHeader('Set-Cookie', [generatedJwt.cookie]);
    return this.responseMapper.refreshMapper();
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<SuccessResponseDto> {
    await this.standardAuthService.logout(req.user.id);
    res.clearCookie('Auth');
    res.clearCookie('Refresh');
    return this.responseMapper.logoutMapper();
  }
}
