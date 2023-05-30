import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '../config/config.module';
import { LoggerModule } from '../logger/logger.module';
import { BullModule } from '../bull/bull.module';
import { AnalyzerModule } from '../analyzer/analyzer.module';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRoot(),
    BullModule,
    AnalyzerModule,
    S3Module
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
