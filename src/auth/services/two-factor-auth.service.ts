import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException
} from '@nestjs/common';
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

  public async enableTwoFactorAuth(
    userId: number,
    authCode: string
  ): Promise<void> {
    const user = await this.usersService.findOne({ id: userId });

    const valid = authenticator.verify({
      secret: user.twoFactorAuthSecret as string, // user has generated secret at this point
      token: authCode
    });

    if (!valid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }

    await this.usersService.updateById(userId, {
      isTwoFactorEnabled: true
    });
  }
}
