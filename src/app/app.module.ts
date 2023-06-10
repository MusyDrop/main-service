import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '../config/config.module';
import { LoggerModule } from '../logger/logger.module';
import { S3Module } from '../s3/s3.module';
import { MailerModule } from '../mailer/mailer.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { DbModule } from '../db/db.module';
import { MetadataMiddleware } from '../common/middlewares/metadata.middleware';
import { ProjectsModule } from '../projects/projects.module';
import { AudioMetaModule } from '../audio-meta/audio-meta.module';
import { SentryModule } from '../sentry/sentry.module';
import { RenderServiceModule } from '../render-service/render-service.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRoot(),
    S3Module,
    AuthModule,
    UsersModule,
    MailerModule,
    DbModule,
    ProjectsModule,
    AudioMetaModule,
    SentryModule,
    RenderServiceModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  // supplying a middleware here allows DI container usage inside a middleware
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(MetadataMiddleware).forRoutes('*');
  }
}
