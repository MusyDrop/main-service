import { forwardRef, Module } from '@nestjs/common';
import { StandardAuthService } from './services/standard-auth.service';
import { StandardAuthController } from './standard-auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerification } from './entities/email-verification.entity';
import { EmailVerificationsService } from './services/email-verifications.service';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '../config/config.module';
import { AuthUtilsService } from './services/auth-utils.service';
import { JwtTokensService } from './services/jwt-tokens.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { MailerModule } from '../mailer/mailer.module';
import { EmailVerificationsController } from './email-verifications.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailVerification, RefreshToken]),
    forwardRef(() => UsersModule),
    ConfigModule,
    MailerModule
  ],
  controllers: [StandardAuthController, EmailVerificationsController],
  providers: [
    StandardAuthService,
    EmailVerificationsService,
    JwtTokensService,
    AuthUtilsService
  ],
  exports: [StandardAuthService, EmailVerificationsService, AuthUtilsService]
})
export class AuthModule {}
