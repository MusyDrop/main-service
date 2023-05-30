import { Module } from '@nestjs/common';
import { BullModule as RootBullModule } from '@nestjs/bull';
import { ExtendedConfigService } from '../config/extended-config.service';
import { ConfigModule } from '../config/config.module';
import { BullService } from './bull.service';
import { BullQueue } from './bull-queue.enum';

@Module({
  imports: [
    RootBullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ExtendedConfigService],
      useFactory: async (config: ExtendedConfigService) => ({
        redis: {
          host: config.get('redis.host'),
          port: config.get('redis.port')
        },
        prefix: 'audio-meta'
      })
    }),

    // Iterate over queues and register them
    ...Object.values(BullQueue).map((value) =>
      RootBullModule.registerQueue({ name: value })
    )
  ],
  providers: [BullService],
  exports: [RootBullModule]
})
export class BullModule {}
