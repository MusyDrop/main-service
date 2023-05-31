import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerification } from './entities/email-verification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmailVerificationService implements OnModuleInit {
  constructor(
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>
  ) {}

  async onModuleInit(): Promise<void> {
    // const emailV = this.emailVerificationRepository.create();
    // emailV.setExpiresAt();
    // await this.emailVerificationRepository.save(emailV);
  }
}
