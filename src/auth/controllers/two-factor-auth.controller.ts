import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { TwoFactorAuthService } from '../services/two-factor-auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { Request, Response } from 'express';
import { SuccessResponseDto } from '../../common/dtos/success-response.dto';
import { EnableTwoFactorAuthDto } from '../dtos/enable-two-factor-auth.dto';
import { toFileStream } from 'qrcode';
import { SigninTwoFactorDto } from '../dtos/signin-two-factor.dto';
import { SigninResponseDto } from '../dtos/response/signin-response.dto';
import { TwoFactorAuthCrdMapper } from '../mappers/two-factor-auth-crd.mapper';

@Controller('/auth/2fa')
export class TwoFactorAuthController {
  constructor(
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly responseMapper: TwoFactorAuthCrdMapper
  ) {}

  @UseGuards(AuthGuard)
  @Post('/generate')
  public async generate(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<SuccessResponseDto> {
    const { otpAuthUrl } =
      await this.twoFactorAuthService.generateTwoFactorAuthSecret(
        req.user.email
      );

    res.setHeader('content-type', 'image/png');
    await toFileStream(res, otpAuthUrl);

    return this.responseMapper.generateMapper();
  }

  @UseGuards(AuthGuard)
  @Post('/enable')
  public async enable(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: EnableTwoFactorAuthDto
  ): Promise<SuccessResponseDto> {
    const enableTwoFactorAuthInfo =
      await this.twoFactorAuthService.enableTwoFactorAuth(
        req.user.id,
        body.authCode
      );

    res.clearCookie('Auth');
    res.clearCookie('Refresh');
    res.setHeader('Set-Cookie', [
      enableTwoFactorAuthInfo.accessTokenCookie,
      enableTwoFactorAuthInfo.refreshTokenCookie
    ]);

    return this.responseMapper.enableMapper();
  }

  @UseGuards(AuthGuard)
  @Post('/signin')
  public async signin(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: SigninTwoFactorDto
  ): Promise<SigninResponseDto> {
    const signinInfo = await this.twoFactorAuthService.singin(
      req.user.id,
      body.authCode
    );
    res.clearCookie('Auth');
    res.clearCookie('Refresh');
    res.setHeader('Set-Cookie', [
      signinInfo.accessTokenCookie,
      signinInfo.refreshTokenCookie
    ]);

    return this.responseMapper.signinMapper(signinInfo);
  }
}
