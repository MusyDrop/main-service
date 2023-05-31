import Joi from 'joi';
import { JoiConfig } from '../../utils/joi/joiTypes';

export interface AuthConfig {
  accessTokenSecret: string;
}

export const authConfigSchema = (): JoiConfig<AuthConfig> => ({
  accessTokenSecret: {
    value: process.env.AUTH_ACCESS_TOKEN_SECRET as string,
    schema: Joi.string().required()
  }
});
