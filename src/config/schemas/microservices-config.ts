import { JoiConfig } from '../../utils/joi/joiTypes';
import Joi from 'joi';

export interface MicroservicesConfig {
  audioMetaService: {
    baseUrl: string;
  };
  renderService: {
    baseUrl: string;
  };
}

export const microservicesConfigSchema =
  (): JoiConfig<MicroservicesConfig> => ({
    audioMetaService: {
      baseUrl: {
        value: process.env.AUDIO_META_SERVICE_BASE_URL as string,
        schema: Joi.string().required()
      }
    },
    renderService: {
      baseUrl: {
        value: process.env.RENDER_SERVICE_BASE_URL as string,
        schema: Joi.string().required()
      }
    }
  });
