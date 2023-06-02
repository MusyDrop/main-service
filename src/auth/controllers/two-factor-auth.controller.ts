import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { TwoFactorAuthService } from '../services/two-factor-auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { Request, Response } from 'express';
import { SuccessResponseDto } from '../../common/dtos/success-response.dto';
import { EnableTwoFactorAuthDto } from '../dtos/enable-two-factor-auth.dto';

@Controller('/auth/2fa')
export class TwoFactorAuthController {
  constructor(private readonly twoFactorAuthService: TwoFactorAuthService) {}

  @UseGuards(AuthGuard)
  @Post('/generate')
  public async generate(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<SuccessResponseDto> {
    const { otpAuthUrl } =
      await this.twoFactorAuthService.generateTwoFactorAuthSecret(req.email);

    await this.twoFactorAuthService.pipeOtpAuthUrlToStream(res, otpAuthUrl);

    return new SuccessResponseDto('2FA QR-code generation');
  }

  @UseGuards(AuthGuard)
  @Post('/enable')
  public async enable(
    @Req() req: Request,
    @Body() body: EnableTwoFactorAuthDto
  ): Promise<SuccessResponseDto> {
    await this.twoFactorAuthService.enableTwoFactorAuth(
      req.userId,
      body.authCode
    );

    return new SuccessResponseDto('Enabling 2FA');
  }
}
