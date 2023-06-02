import Joi from 'joi';
import { JoiConfig } from '../../utils/joi/joiTypes';
import * as process from 'process';
import { AnyObject } from '../../utils/types';

export interface AuthConfig {
  accessTokenSecret: string;
  accessTokenExpiresInSec: number;
  refreshTokenSecret: string;
  refreshTokenExpiresInSec: number;

  emailVerificationExpiresInSec: number;

  googleClientId: string;
  googleClientSecret: string;

  twoFactorAuthAppName: string;
}

export const authConfigSchema = (): JoiConfig<AuthConfig> => ({
  accessTokenSecret: {
    value: process.env.AUTH_ACCESS_TOKEN_SECRET as string,
    schema: Joi.string().required()
  },
  accessTokenExpiresInSec: {
    value: parseInt(process.env.AUTH_ACCESS_TOKEN_EXPIRES_IN_SEC as string, 10),
    schema: Joi.number().required()
  },
  refreshTokenSecret: {
    value: process.env.AUTH_REFRESH_TOKEN_SECRET as string,
    schema: Joi.string().required()
  },
  refreshTokenExpiresInSec: {
    value: parseInt(
      process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN_SEC as string,
      10
    ),
    schema: Joi.number().required()
  },
  emailVerificationExpiresInSec: {
    value: parseInt(
      process.env.AUTH_EMAIL_VERIFICATION_EXPIRES_IN_SEC as string,
      10
    ),
    schema: Joi.number().required()
  },
  googleClientId: {
    value: process.env.AUTH_GOOGLE_CLIENT_ID as string,
    schema: Joi.string().required()
  },
  googleClientSecret: {
    value: process.env.AUTH_GOOGLE_CLIENT_SECRET as string,
    schema: Joi.string().required()
  },
  twoFactorAuthAppName: {
    value: process.env.AUTH_2FA_APP_NAME as string,
    schema: Joi.string().required()
  }
});
