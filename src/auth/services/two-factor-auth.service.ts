import { Injectable } from '@nestjs/common';
import { GeneratedTwoFactorCredentials } from '../interfaces/generated-2fa-credentials.interface';
import { authenticator } from 'otplib';
import { ExtendedConfigService } from '../../config/extended-config.service';
import { UsersService } from '../../users/users.service';
import { Writable } from 'node:stream';
import { toFileStream } from 'qrcode';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    private readonly config: ExtendedConfigService,
    private readonly usersService: UsersService
  ) {}

  public async generateTwoFactorAuthSecret(
    email: string
  ): Promise<GeneratedTwoFactorCredentials> {
    const secret = authenticator.generateSecret();

    const otpAuthUrl = authenticator.keyuri(
      email,
      this.config.get('auth.twoFactorAuthAppName'),
      secret
    );

    await this.usersService.updateByEmail(email, {
      twoFactorAuthSecret: secret
    });

    return {
      secret,
      otpAuthUrl
    };
  }

  public async pipeOtpAuthUrlToStream(
    stream: Writable,
    url: string
  ): Promise<void> {
    await toFileStream(stream, url);
  }
}
