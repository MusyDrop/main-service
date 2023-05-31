import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerification } from './entities/email-verification.entity';
import { EmailVerificationService } from './email-verification.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailVerification]),
    forwardRef(() => UsersModule)
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailVerificationService],
  exports: [AuthService, EmailVerificationService]
})
export class AuthModule {}
