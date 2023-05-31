import Joi from 'joi';
import { JoiConfig } from '../../utils/joi/joiTypes';

export interface AuthConfig {
  accessTokenSecret: string;
  accessTokenExpiresInSec: number;
  refreshTokenSecret: string;
  refreshTokenExpiresInSec: number;

  emailVerificationExpiresInSec: number;
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
  }
});
