import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { TwoFactorAuthService } from '../services/two-factor-auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { Readable } from 'node:stream';
import { Request, Response } from 'express';
import { toFileStream } from 'qrcode';
import { SuccessResponseDto } from '../../common/dtos/success-response.dto';

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
}
