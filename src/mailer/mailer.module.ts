import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  controllers: [MailerController],
  providers: [MailerService],
  exports: [MailerService]
})
export class MailerModule {}
