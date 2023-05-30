import { Module } from '@nestjs/common';
import { AnalyzerService } from './analyzer.service';
import { AnalyzerController } from './analyzer.controller';
import { BullModule } from '../bull/bull.module';
import { AudioMetadataQueueProcessor } from './audio-metadata-queue.processor';
import { S3Module } from '../s3/s3.module';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [BullModule, S3Module, ConfigModule],
  controllers: [AnalyzerController],
  providers: [AnalyzerService, AudioMetadataQueueProcessor]
})
export class AnalyzerModule {}
