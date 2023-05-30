import { JoiUtil } from '../utils/joi/JoiUtil';
import { ServerConfig, serverConfigSchema } from './schemas/server-config';
import { RedisConfig, redisConfigSchema } from './schemas/redis-config';
import {
  MicroservicesConfig,
  microservicesConfigSchema
} from './schemas/microservices-config';
import { MinioConfig, minioConfigSchema } from './schemas/minio-config';
import { JoiAppConfig } from '../utils/joi/joiTypes';

// the keys from here in the custom config service
export interface AppConfig {
  server: ServerConfig;
  redis: RedisConfig;
  microservices: MicroservicesConfig;
  minio: MinioConfig;
}

export const appSchema = (): JoiAppConfig<AppConfig> => ({
  server: serverConfigSchema(),
  redis: redisConfigSchema(),
  microservices: microservicesConfigSchema(),
  minio: minioConfigSchema()
});

export const configuration = (): AppConfig => {
  const schema = appSchema();
  // validate each schema and extract actual values
  return Object.keys(schema).reduce(
    (config, key) => ({
      ...config,
      [key]: JoiUtil.validate(schema[key as keyof AppConfig])
    }),
    {} as AppConfig
  );
};
