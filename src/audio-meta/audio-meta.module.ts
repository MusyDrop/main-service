import { Module } from '@nestjs/common';
import { AnalyzerApiClient } from './analyzer.api-client';
import { HttpModule } from '@nestjs/axios';
import { ExtendedConfigService } from '../config/extended-config.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ExtendedConfigService],
      useFactory: (config: ExtendedConfigService) => ({
        baseURL: `${config.get(
          'microservices.audioMetaService.baseUrl'
        )}/api/meta`
      })
    })
  ],
  providers: [AnalyzerApiClient],
  exports: [AnalyzerApiClient]
})
export class AudioMetaModule {}
