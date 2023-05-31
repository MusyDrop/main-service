import { JoiConfig } from '../../utils/joi/joiTypes';
import Joi from 'joi';

export interface MailerConfig {
  apiKey: string;
  sender: string;
  templates: {
    verification: string;
  };
}

export const mailerConfigSchema = (): JoiConfig<MailerConfig> => ({
  apiKey: {
    value: process.env.MAILER_API_KEY as string,
    schema: Joi.string().required()
  },
  sender: {
    value: process.env.MAILER_SENDER as string,
    schema: Joi.string().required()
  },
  templates: {
    verification: {
      value: process.env.MAILER_EMAIL_VERIFICATION_TEMPLATE_ID as string,
      schema: Joi.string().required()
    }
  }
});
