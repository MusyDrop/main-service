import { Injectable, Scope } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ExtendedConfigService } from '../../config/extended-config.service';
import { GoogleUserInfo } from '../interfaces/google-user-info.interface';

@Injectable()
export class GoogleHttpService {
  constructor(private readonly config: ExtendedConfigService) {}

  public async getUserInfoByAuthCode(
    authCode: string
  ): Promise<GoogleUserInfo> {
    const client = await this.createClientFromAuthCode(authCode);

    const res = await client.request<GoogleUserInfo>({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'GET'
    });

    return res.data;
  }

  public createRawClient(): OAuth2Client {
    return new OAuth2Client({
      clientId: this.config.get('auth.googleClientId'),
      clientSecret: this.config.get('auth.googleClientSecret'),
      redirectUri: 'postmessage'
    });
  }

  public async createClientFromAuthCode(
    authCode: string
  ): Promise<OAuth2Client> {
    const rawClient = this.createRawClient();
    const credentials = await rawClient.getToken({
      code: authCode
    });
    rawClient.setCredentials(credentials.tokens);

    return rawClient;
  }
}
