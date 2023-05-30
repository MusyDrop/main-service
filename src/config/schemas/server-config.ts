import Joi from 'joi';
import { NodeEnv } from '../node-env.enum';
import { LogLevel } from '../../logger/log-level.enum';
import { JoiConfig } from '../../utils/joi/joiTypes';

export interface ServerConfig {
  port: number;
  loggerLevel: LogLevel;
  nodeEnv: NodeEnv;
  adminEmail: string;
  adminPassword: string;
  serverBaseUrl: string;
  isProduction: boolean;
}

export const serverConfigSchema = (): JoiConfig<ServerConfig> => ({
  port: {
    value: parseInt(process.env.PORT as string, 10),
    schema: Joi.number().required()
  },
  loggerLevel: {
    value: process.env.LOGGER_GLOBAL_LOG_LEVEL as LogLevel,
    schema: Joi.string().equal(...Object.keys(LogLevel)) // equal, valid no longer accept arrays, sad :(
  },
  nodeEnv: {
    value: process.env.NODE_ENV as NodeEnv,
    schema: Joi.string()
      .equal(...Object.keys(NodeEnv))
      .required() // equal, valid no longer accepts arrays, sad :(
  },
  adminEmail: {
    value: process.env.INIT_ADMIN_EMAIL as string,
    schema: Joi.string().required()
  },
  adminPassword: {
    value: process.env.INIT_ADMIN_PASSWORD as string,
    schema: Joi.string().required()
  },
  serverBaseUrl: {
    value: process.env.SERVER_BASE_URL as string,
    schema: Joi.string().required()
  },
  isProduction: {
    value: (process.env.NODE_ENV as NodeEnv) === NodeEnv.production,
    schema: Joi.boolean().required()
  }
});
