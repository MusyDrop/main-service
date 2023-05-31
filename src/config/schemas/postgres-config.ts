import { JoiConfig } from '../../utils/joi/joiTypes';
import Joi from 'joi';

export interface PostgresConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export const postgresConfigSchema = (): JoiConfig<PostgresConfig> => ({
  host: {
    value: process.env.POSTGRES_HOST as string,
    schema: Joi.string().required()
  },
  port: {
    value: parseInt(process.env.POSTGRES_PORT as string, 10),
    schema: Joi.number().required()
  },
  username: {
    value: process.env.POSTGRES_USERNAME as string,
    schema: Joi.string().required()
  },
  password: {
    value: process.env.POSTGRES_PASSWORD as string,
    schema: Joi.string().required()
  },
  database: {
    value: process.env.POSTGRES_DATABASE as string,
    schema: Joi.string().required()
  }
});
