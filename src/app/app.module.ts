import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '../config/config.module';
import { LoggerModule } from '../logger/logger.module';
import { S3Module } from '../s3/s3.module';
import { MailerModule } from '../mailer/mailer.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { DbModule } from '../db/db.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRoot(),
    S3Module,
    AuthModule,
    UsersModule,
    MailerModule,
    DbModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
