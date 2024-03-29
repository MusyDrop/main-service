import { JoiConfig } from '../../utils/joi/joiTypes';
import Joi from 'joi';
import * as process from 'process';

export interface MinioConfig {
  host: string;
  port: number;
  buckets: {
    audioFilesBucket: string;
  };
  accessKey: string;
  secretKey: string;
}

export const minioConfigSchema: () => JoiConfig<MinioConfig> = () => ({
  host: {
    value: process.env.MINIO_HOST as string,
    schema: Joi.string().required()
  },
  port: {
    value: parseInt(process.env.MINIO_PORT as string, 10),
    schema: Joi.number().required()
  },
  buckets: {
    audioFilesBucket: {
      value: process.env.MINIO_AUDIO_FILES_BUCKET as string,
      schema: Joi.string().required()
    }
  },
  accessKey: {
    value: process.env.MINIO_ACCESS_KEY as string,
    schema: Joi.string().required()
  },
  secretKey: {
    value: process.env.MINIO_SECRET_KEY as string,
    schema: Joi.string().required()
  }
});
