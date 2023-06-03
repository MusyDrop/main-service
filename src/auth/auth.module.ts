import { forwardRef, Module } from '@nestjs/common';
import { StandardAuthService } from './services/standard-auth.service';
import { StandardAuthController } from './controllers/standard-auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerification } from './entities/email-verification.entity';
import { EmailVerificationsService } from './services/email-verifications.service';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '../config/config.module';
import { JwtTokensService } from './services/jwt-tokens.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { MailerModule } from '../mailer/mailer.module';
import { EmailVerificationsController } from './controllers/email-verifications.controller';
import { GoogleAuthController } from './controllers/google-auth.controller';
import { GoogleAuthService } from './services/google-auth.service';
import { GoogleHttpService } from './services/google-http.service';
import { TwoFactorAuthController } from './controllers/two-factor-auth.controller';
import { TwoFactorAuthService } from './services/two-factor-auth.service';
import { GoogleAuthCrdMapper } from './mappers/google-auth-crd.mapper';
import { StandardAuthCrdMapper } from './mappers/standard-auth-crd.mapper';
import { TwoFactorAuthCrdMapper } from './mappers/two-factor-auth-crd.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailVerification, RefreshToken]),
    forwardRef(() => UsersModule),
    ConfigModule,
    MailerModule
  ],
  controllers: [
    StandardAuthController,
    EmailVerificationsController,
    GoogleAuthController,
    TwoFactorAuthController
  ],
  providers: [
    StandardAuthService,
    EmailVerificationsService,
    JwtTokensService,
    GoogleAuthService,
    GoogleHttpService,
    TwoFactorAuthService,
    GoogleAuthCrdMapper,
    StandardAuthCrdMapper,
    TwoFactorAuthCrdMapper
  ],
  exports: [
    StandardAuthService,
    EmailVerificationsService,
    JwtTokensService,
    UsersModule
  ]
})
export class AuthModule {}
